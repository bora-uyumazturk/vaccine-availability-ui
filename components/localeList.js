import LocaleDetail from "./localeDetail";
import React from "react";
import { useEffect } from "react";

export default function LocaleList({ location, changeLocation, entries }) {
  console.log(entries);
  // https://www.robinwieruch.de/react-scroll-to-item
  const refs = entries.reduce((acc, value) => {
    acc[value.city.toLowerCase()] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    console.log("from LocaleList:");
    console.log(location);
    if (location) {
      refs[location.toLowerCase()].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location]);

  return (
    <ul className="flex-initial border overflow-auto h-full">
      {entries.map((e) => (
        <LocaleDetail
          location={location}
          changeLocation={changeLocation}
          inputRef={refs[e.city.toLowerCase()]}
          entry={e}
        ></LocaleDetail>
      ))}
    </ul>
  );
}
