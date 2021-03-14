import useSWR from "swr";
import { useState, useEffect } from "react";
import _ from "lodash";

import Map from "../components/map";
import LocaleList from "../components/localeList";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Body() {
  const { data, error } = useSWR("/api/", fetcher);

  const [location, setLocation] = useState(null);

  const [center, setCenter] = useState({
    long: -96.11,
    lat: 41.819,
    zoom: 4,
    minZoom: 2.5,
  });

  // TODO: more robust error handling
  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center w-screen h-full">
        <LocaleList
          location={location}
          changeLocation={setLocation}
          entries={[]}
        />
        <div className="relative h-full w-3/4 md:w-2/4 border flex justify-center items-center">
          <img src="/grid.svg" />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center w-screen h-full">
      <LocaleList
        location={location}
        changeLocation={setLocation}
        entries={_.orderBy(data["data"], ["state", "city"])}
      />
      <Map
        center={center}
        location={location}
        changeLocation={setLocation}
        entries={data["data"]}
      />
    </div>
  );
}
