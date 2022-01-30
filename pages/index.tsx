import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect } from "react";
import Layout from "../components/main-layout";
import LoginSpotifyButton from "../components/spotify-button";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/personality");
    }
  }, [status]);

  return (
    <Layout title="Deine Musikpersönlichkeit" home>
      <main className={styles.main}>
        <h1>
          Deine <br />
          Musikpersönlichkeit
        </h1>
        <LoginSpotifyButton />
        <div style={{ marginTop: "4em" }} />
        <section className={styles.sectionDescription}>
          <p>Begib dich auf eine Reise in die innersten deiner Gefühle.</p>
          <p>
            Lass neuste Errungenschaften der künstlichen Intelligenz deine 100
            meist geliebten Songs analysieren und gewinne Einblicke in dein
            wahres Ich...
          </p>
        </section>
      </main>
    </Layout>
  );
}
