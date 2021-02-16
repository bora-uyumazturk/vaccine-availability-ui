import Head from "next/head";
import useSWR from "swr";
import { useState, useEffect } from "react";

import Map from "../components/map";
import LocaleList from "../components/localeList";
import LocaleDetail from "../components/LocaleDetail";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {
  const [center, setCenter] = useState({
    long: -77.0364,
    lat: 38.9072,
    zoom: 8,
  });

  const [location, setLocation] = useState(null);

  const { data, error } = useSWR("/api/", fetcher);

  // TODO: more robust error handling
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen max-h-screen py-2">
      <Head>
        <title>DMVAccine</title>
        <link rel="icon" href="/favicon.ico" />
        # for mapbox-gl-js
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <main className="flex flex-col items-center flex-initial px-4 h-3/4 text-center">
        <h1 className="text-6xl font-bold">DMVaccine.com</h1>
        <p className="p-2">
          Check Covid vaccine availability in the DC-Maryland-Virginia area.
        </p>

        <div className="flex flex-1 space-x-4 items-center justify-center mt-6 w-screen h-96">
          <LocaleList
            location={location}
            changeLocation={setLocation}
            entries={data["data"]}
          />
          <Map
            center={center}
            location={location}
            changeLocation={setLocation}
            entries={data["data"]}
          />
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-20 border-t margin-top">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}
