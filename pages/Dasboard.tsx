import LoginPage from "@/app/auth/login/page";
import Home from "@/app/page";
import { useSession } from "next-auth/react";
import React from "react";

export default function Dasboard() {
  const { data: session } = useSession();

  return <>{session ? <Home></Home> : <LoginPage></LoginPage>}</>;
}
