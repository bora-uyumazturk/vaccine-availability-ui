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
    long: -77.0364,
    lat: 38.9072,
    zoom: 4,
    minZoom: 2.5,
  });

  // TODO: more robust error handling
  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <div className="flex flex-1 space-x-4 items-center justify-center mt-6 w-screen h-96">
        <LocaleList
          location={location}
          changeLocation={setLocation}
          entries={[]}
        />
        <div className="relative h-full w-2/4 border" />
      </div>
    );

  return (
    <div className="flex flex-1 space-x-4 items-center justify-center mt-6 w-screen h-96">
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
