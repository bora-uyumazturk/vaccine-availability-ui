import LocaleDetail from "./localeDetail";
import React from "react";
import { useState, useEffect } from "react";
import { toIdentifier } from "../lib/utils";

export default function LocaleList({ location, changeLocation, entries }) {
  console.log(entries);
  // https://www.robinwieruch.de/react-scroll-to-item
  // const refs = entries.reduce((acc, value) => {
  //   acc[value.city.toLowerCase()] = React.createRef();
  //   return acc;
  // }, {});
  const refs = entries.reduce((acc, value) => {
    acc[toIdentifier(value.city, value.fips)] = React.createRef();
    return acc;
  }, {});

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    console.log("from LocaleList:");
    console.log(location);
    if (location && !clicked) {
      console.log(location.toLowerCase());
      refs[location.toLowerCase()].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setClicked(false);
  }, [location]);

  return (
    <ul
      onClick={() => setClicked(true)}
      className="flex-initial border overflow-auto h-full"
    >
      {entries.map((e) => (
        <LocaleDetail
          location={location}
          changeLocation={changeLocation}
          inputRef={refs[toIdentifier(e.city, e.fips)]}
          entry={e}
        ></LocaleDetail>
      ))}
    </ul>
  );
}
