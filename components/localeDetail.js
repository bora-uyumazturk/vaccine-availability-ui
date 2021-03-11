import { toIdentifier, initCap } from "../lib/utils";
import { format } from "date-fns";
import { CVS_APPT_URL } from "../lib/constants";

export default function LocaleDetail({
  location,
  changeLocation,
  inputRef,
  entry,
}) {
  const getFont = (location) => {
    if (location === toIdentifier(entry.city, entry.fips)) {
      return "text-blue-600";
    }
  };

  return (
    <div
      ref={inputRef}
      className={`p-3 text-sm text-left ${getFont(
        location
      )} border-bottom w-auto hover:bg-gray-100`}
      onClick={() => changeLocation(toIdentifier(entry.city, entry.fips))}
    >
      <span className={"text-base font-semibold"}>
        {initCap(entry.city)}, {entry.state}
      </span>
      <br />
      Status: {entry.status}
      <br />
      Last updated: {format(new Date(entry.lastUpdated), "Pp")}
      {entry.status === "Available" && (
        <>
          <br />
          Make an{" "}
          <a href={CVS_APPT_URL} target="_blank">
            appointment
          </a>
        </>
      )}
    </div>
  );
}
