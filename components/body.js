import useSWR from "swr";
import { useState, useEffect } from "react";
import _ from "lodash";

import BodyDisplay from "../components/bodyDisplay";
import LocaleList from "../components/localeList";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Body() {
  const { data, error } = useSWR("/api", fetcher);

  // TODO: more robust error handling
  if (error) return <div>failed to load</div>;
  if (!data)
    return (
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center w-screen h-3/4 py-5">
        <LocaleList entries={[]} />
        <div className="relative h-full w-3/4 md:w-2/4 border flex justify-center items-center">
          <img src="/grid.svg" />
        </div>
      </div>
    );

  return <BodyDisplay entries={data["data"]} />;
}
