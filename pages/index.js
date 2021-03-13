import Head from "next/head";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";

import Body from "../components/body";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen max-h-screen py-5">
      <Head>
        <title>cvs vaccine (dot) net</title>
        <link rel="icon" href="/syringe.png" />
        # for mapbox-gl-js
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <h1 className="text-6xl font-bold"> 💉 map (dot) net</h1>
      <p className="p-2 mb-5">
        Check Covid vaccine availability and schedule appointments in CVS
        locations around the country.
      </p>

      <Body />

      <footer className="flex flex-1 flex-col space-y-5 items-center justify-center w-full max-h-20 mt-5 border-t">
        <a
          className="flex items-center justify-center mt-5"
          href="https://bora-uyumazturk.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with
          <img src="/cvs-heart.png" alt="heart" className="h-4 ml-2 mr-2" />
          by Bora
          <br />
        </a>
        <div className="flex justify-center space-x-5">
          <a
            className="flex items-center justify-center"
            href="mailto:bora.uyumazturk@gmail.com"
            target="_blank"
          >
            <img src="/mail.svg" className="h-6" />
          </a>
          <a
            className="flex items-center justify-center"
            href="https://github.com/bora-uyumazturk/vaccine-availability-ui"
            target="_blank"
          >
            <img src="/github.svg" className="h-6" />
          </a>
          <a
            className="flex items-center justify-center"
            href="https://twitter.com/notsleepingturk"
            target="_blank"
          >
            <img src="/twitter.svg" className="h-6" />
          </a>
        </div>
      </footer>
    </div>
  );
}
