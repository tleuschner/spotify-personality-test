import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);
};