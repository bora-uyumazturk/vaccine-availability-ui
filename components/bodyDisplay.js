import { useState, useEffect } from "react";
import _ from "lodash";
import Map from "../components/map";
import LocaleList from "../components/localeList";

export default function BodyDisplay({ entries }) {
  const defaultEntry = _.orderBy(
    _.filter(entries, (x) => {
      return x.status === "Available";
    }),
    ["state", "city"]
  )[0];

  const [location, setLocation] = useState(null);

  const [rendered, setRendered] = useState(false);

  const [center, setCenter] = useState({
    long: -96.11,
    lat: 41.819,
    zoom: 6,
    minZoom: 2.5,
  });

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center w-screen h-3/4 py-5">
      <LocaleList
        location={location}
        rendered={rendered}
        changeLocation={setLocation}
        entries={_.orderBy(entries, ["state", "city"])}
      />
      <Map
        center={center}
        location={location}
        defaultLocation={defaultEntry ? defaultEntry.identifier : null}
        changeLocation={setLocation}
        rendered={rendered}
        changeRendered={setRendered}
        entries={entries}
      />
    </div>
  );
}
