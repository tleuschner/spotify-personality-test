import { Session } from "next-auth";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";

export const classifySongsWithFilter = async (
  topHundredSongNames: string,
  session: Session
): Promise<CreateCompletionResponse> => {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  let filterLabel = "2";
  let response: CreateCompletionResponse;
  let iterations = 0;

  while (filterLabel === "2" && iterations < 10) {
    const { data } = await openai.createCompletion("text-davinci-001", {
      prompt: `Describe the personality of the listener of the following song names in 4 sentences with at least 6 words each.
          ${topHundredSongNames}
          
    
          `,
      temperature: 0.7,
      max_tokens: 128,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // @ts-ignore
      user: session?.user?.id || session?.user?.name || "",
    });
    response = data;

    const { data: filterData } = await openai.createCompletion(
      "content-filter-alpha",
      {
        prompt: "<|endoftext|>" + data.choices[0].text + "\n--\nLabel:",
        temperature: 0,
        max_tokens: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        logprobs: 10,
      }
    );

    filterLabel = filterData.choices[0].text;
    const toxicThreshold = -0.355;

    if (filterLabel === "2") {
      let logprobs = filterData.choices[0].logprobs.top_logprobs[0];

      if ((logprobs["2"] || 0) < toxicThreshold) {
        const logprob_0 = logprobs["0"];
        const logprob_1 = logprobs["1"];

        if (logprob_0 && logprob_1) {
          if (logprob_0 > logprob_1) {
            filterLabel = "0";
          } else {
            filterLabel = "1";
          }
        } else if (logprob_0 !== undefined) {
          filterLabel = "0";
        } else if (logprob_1 !== undefined) {
          filterLabel = "1";
        }
      }
    }

    if (!["0", "1", "2"].includes(filterLabel)) {
      filterLabel = "2";
    }
    iterations++;
  }

  if (iterations === 10) {
    return {
      choices: [{ text: "Your songs are too toxic to classify :/" }],
    };
  }

  return response;
};
