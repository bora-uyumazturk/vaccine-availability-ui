import Head from "next/head";
import useSWR from "swr";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SYRINGE_IMAGE, CVS_COVID_PAGE } from "../lib/constants";

import Body from "../components/body";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen max-h-screen">
      <Head>
        <title>not walgreens</title>
        <link rel="icon" href={SYRINGE_IMAGE} />
        # for mapbox-gl-js
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <link rel="apple touch icon" href="/preview.png" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://leading-pharmacy-chain-vax-map.net/"
        />
        <meta property="og:image" content="/preview.png" />
        <meta
          property="og:description"
          content="Check Covid vaccine availability and schedule appointments at CVS locations across the country."
        />
        <meta
          property="og:title"
          content="leading-pharmacy-chain-vax-map (dot) net"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://leading-pharmacy-chain-vax-map.net/"
        />
        <meta property="twitter:creator" content="notsleepingturk" />
        <meta
          property="twitter:title"
          content="leading-pharmacy-chain-vax-map (dot) net"
        />
        <meta
          property="twitter:description"
          content="Check Covid vaccine availability and schedule appointments at CVS locations across the country."
        />
        <meta property="twitter:image" content="/preview.png" />
      </Head>

      <div className="flex flex-col flex-none items-center justify-center max-h-1/4 max-w-3/4 min-h-20 pt-2">
        <p className="block text-center text-2xl md:text-4xl font-bold max-w-full">
          leading-pharmacy-chain-
          <img src={SYRINGE_IMAGE} className="h-7 md:h-10 inline-block" />
          -map (dot) net
        </p>
        <p className="block max-w-full text-center pt-2">
          Check Covid vaccine availability and schedule appointments at{" "}
          <a href={CVS_COVID_PAGE} target="_blank" className="hover:underline">
            CVS
          </a>{" "}
          locations around the country.
        </p>
      </div>

      <Body />

      <footer className="flex flex-none flex-col space-y-5 items-center justify-center w-full max-h-1/4 border-t py-2">
        <a
          className="flex items-center justify-center"
          href="https://bora-uyumazturk.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with
          <img src="/cvs-heart.png" alt="heart" className="h-4 ml-2 mr-2" />
          by Bora
          <br />
        </a>
        <div className="flex flex-row justify-center space-x-5">
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
