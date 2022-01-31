import { signIn } from "next-auth/react";
import styles from "./button.module.css";

const LoginSpotifyButton = () => {
  return (
    <button
      className={styles.spotifyButton}
      onClick={() =>
        signIn("spotify", {
          callbackUrl: window.location.href + "personality",
        })
      }
    >
      <span style={{ lineHeight: 1.5 }}>Log into Spotify</span>
    </button>
  );
};

export default LoginSpotifyButton;
