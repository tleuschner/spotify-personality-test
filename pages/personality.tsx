import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/main-layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useRefreshToken from "../hooks/useRefreshToken";
import TypewriterHeadline from "../components/TypewriterHeadline";
import styles from "../styles/Personality.module.css";
import FadeIn from "react-fade-in";

const Personality = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  useRefreshToken();

  const [classification, setClassification] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [typewriterReady, setTypewriterReady] = useState(false);

  const onReady = useCallback(() => {
    setTypewriterReady(true);
  }, []);

  useEffect(() => {
    const fetchClassification = async () => {
      setLoading(true);
      const res = await fetch("/api/classification");

      if (!res.ok) {
        setLoading(false);
        setClassification(["There has been an error!"]);
      }

      const json = await res.json();
      console.log(json);
      setClassification(json.classification);
      setLoading(false);
    };

    if (status === "authenticated") {
      fetchClassification();
    }
  }, [status]);

  if (status === "unauthenticated") {
    router.push("/");
  }

  if (status === "loading") {
    return <Layout title="Authenticating"></Layout>;
  }

  const showList = !loading && typewriterReady;
  const showLoadingIndicatior = loading && typewriterReady;

  return (
    <Layout title="Deine Persönlichkeit">
      <h1 style={{ wordBreak: "break-word" }}>
        <TypewriterHeadline
          text={`${session?.user?.name} persönlicher Seelenblick`}
          onReady={onReady}
        />
      </h1>

      {showList && (
        <ul className={styles.personalityList}>
          <FadeIn transitionDuration={1000} delay={1000}>
            {classification[0] && <li>{classification[0]}</li>}
            {classification[1] && <li>{classification[1]}</li>}
            {classification[2] && <li>{classification[2]}</li>}
            {classification[3] && <li>{classification[3]}</li>}
          </FadeIn>
        </ul>
      )}
      {showLoadingIndicatior && (
        <div className={styles.loadingIndicator}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </Layout>
  );
};

export default Personality;
