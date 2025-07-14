
"use client";

import Hero from "@/components/Hero";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export default function HomePage() {

  const { token, user } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token && !!user;


  return (
    <main>
      <Hero isLoggedIn={isLoggedIn} />
    </main>
  );
}
