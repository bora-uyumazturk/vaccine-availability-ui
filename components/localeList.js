import LocaleDetail from "./localeDetail";
import React from "react";
import { useState, useEffect } from "react";
import { toIdentifier } from "../lib/utils";

export default function LocaleList({ location, changeLocation, entries }) {
  // https://www.robinwieruch.de/react-scroll-to-item
  const refs = entries.reduce((acc, value) => {
    acc[toIdentifier(value.city, value.fips)] = React.createRef();
    return acc;
  }, {});

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (location && !clicked) {
      refs[location.toLowerCase()].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setClicked(false);
  }, [location]);

  return (
    <div
      onClick={() => setClicked(true)}
      className="flex flex-row md:flex-col border overflow-scroll h-32 min-h-min md:h-full md:max-h-full md:min-h-0 w-3/4 md:w-1/5 md:divide-y"
    >
      {entries.map(
        (e) =>
          e.status === "Available" && (
            <LocaleDetail
              location={location}
              changeLocation={changeLocation}
              inputRef={refs[toIdentifier(e.city, e.fips)]}
              entry={e}
            ></LocaleDetail>
          )
      )}
    </div>
  );
}
