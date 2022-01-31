import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Configuration, OpenAIApi } from "openai";
import SpotifyWebApi from "spotify-web-api-node";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000 * 3, // 3 Minutes
  uniqueTokenPerInterval: 300, // 300 users per second
});

const MAX_REQUESTS = 15;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    res.status(401).end();
  }

  try {
    await limiter.check(res, MAX_REQUESTS, session.accessToken);
  } catch (e) {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }

  const accessToken = session.accessToken as string;

  const spotifyApi = new SpotifyWebApi();
  const timeRange = req.query.time_range || ("long_term" as any);
  spotifyApi.setAccessToken(accessToken);

  try {
    const topTracks1 = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
      limit: 50,
    });
    const topTracks2 = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
      offset: 49,
      limit: 50,
    });

    const topThreeTracks = topTracks1.body.items.slice(0, 3);
    const topHundredTracks = [
      ...topTracks1.body.items,
      ...topTracks2.body.items,
    ];

    const topHundredSongNames = topHundredTracks
      .map((track) => track.name)
      .join(",");

    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion("text-davinci-001", {
      prompt: `Describe the personality of the listener of the following song names in 4 sentences with at least 6 words each.
      ${topHundredSongNames}
      

      `,
      temperature: 0.7,
      max_tokens: 128,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // @ts-ignore
      user: session?.user?.name || "",
    });

    const parts = response.data.choices[0].text.split(".");
    const partsFilterd = parts.map((p) => {
      if (p.startsWith(",")) {
        return p.replace(",", "");
      }
      return p.replace("following songs", "songs");
    });

    res.json({
      topThreeTracks,
      classification: partsFilterd,
    });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    console.log(e);
    return;
  }
};
export default handler;
