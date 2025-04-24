import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user && router.pathname === "/signin") {
      router.push("/dashboard");
    }

    if (!user && router.pathname !== "/signin") {
      router.push("/signin");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
