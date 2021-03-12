import Head from "next/head";
import useSWR from "swr";
import { useState, useEffect } from "react";

import Body from "../components/body";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen max-h-screen py-2">
      <Head>
        <title>cvs vaccine (dot) net</title>
        <link rel="icon" href="/syringe.png" />
        # for mapbox-gl-js
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <main className="flex flex-col items-center flex-initial px-4 h-3/4 text-center">
        <h1 className="text-6xl font-bold">cvs 💉 (dot) net</h1>
        <p className="p-2">
          Check Covid vaccine availability in CVS locations around the country.
        </p>

        <Body />
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t margin-top">
        <a
          className="flex items-center justify-center"
          href="https://bora-uyumazturk.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with ❤️ by Bora
        </a>
      </footer>
    </div>
  );
}
