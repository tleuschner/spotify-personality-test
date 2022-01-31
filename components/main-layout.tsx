import Head from "next/head";
import React from "react";
import styles from "./main-layout.module.css";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface LayoutProps {
  title: string;
  home?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ title, children, home = false }) => {
  return (
    <div className={styles.container}>
      <Head>
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://personality.timleuschner.de/"
        />
        <meta property="og:title" content="Deine Musikpersönlichkeit" />
        <meta
          property="og:description"
          content="Begib dich auf eine Reise in die innersten deiner Gefühle"
        />

        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://personality.timleuschner.de/"
        />
        <meta property="twitter:title" content="Deine Musikpersönlichkeit" />
        <meta
          property="twitter:description"
          content="Begib dich auf eine Reise in die innersten deiner Gefühle"
        />
        <meta
          name="description"
          content="Begib dich auf eine Reise in die innersten deiner Gefühle"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      <footer className={styles.footer}>
        {!home && (
          <a
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              signOut({
                redirect: false,
              });
            }}
          >
            Ausloggen
          </a>
        )}
        <Link href="/privacy">Datenschutz</Link>
      </footer>
    </div>
  );
};

export default Layout;
