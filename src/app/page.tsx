"use client";
import { useSession } from "next-auth/react";
import LoginPage from "./auth/account/LoginPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/photos");
    }
  }, [session]);

  return <>{!session ? <LoginPage></LoginPage> : <></>}</>;
}
