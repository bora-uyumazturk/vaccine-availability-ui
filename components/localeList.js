import LocaleDetail from "./localeDetail";
import { useEffect } from "react";

export default function LocaleList({ location, entries }) {
  useEffect(() => {
    console.log("from LocaleList:");
    console.log(location);
  }, [location]);

  return (
    <ul className="flex-initial border overflow-auto h-full">
      {entries.map((e) => (
        <LocaleDetail entry={e}></LocaleDetail>
      ))}
    </ul>
  );
}
