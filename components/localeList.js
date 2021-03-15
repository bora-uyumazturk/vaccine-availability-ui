import LocaleDetail from "./localeDetail";
import React from "react";
import { useState, useEffect } from "react";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

export default function LocaleList({
  location,
  rendered,
  changeLocation,
  entries,
}) {
  // https://www.robinwieruch.de/react-scroll-to-item
  const refs = entries.reduce((acc, value) => {
    acc[value.identifier] = React.createRef();
    return acc;
  }, {});

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const small =
      window.screen.width <=
      parseFloat(fullConfig.theme.screens.md.slice(0, -2));
    if (rendered && location) {
      if (!clicked || small) {
        refs[location.toLowerCase()].current.scrollIntoView({
          behavior: small ? "auto" : "smooth",
          block: "center",
        });
      }
    }

    setClicked(false);
  }, [location, rendered]);

  return (
    <div
      onClick={() => setClicked(true)}
      className="flex flex-row md:flex-col border overflow-hidden md:overflow-scroll h-32 min-h-min md:h-full md:max-h-full md:min-h-0 w-3/4 md:w-1/5 md:divide-y"
    >
      {entries.map(
        (e) =>
          e.status === "Available" && (
            <LocaleDetail
              location={location}
              changeLocation={changeLocation}
              inputRef={refs[e.identifier]}
              entry={e}
              key={e.identifier}
            ></LocaleDetail>
          )
      )}
    </div>
  );
}
