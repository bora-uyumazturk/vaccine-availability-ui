import { toIdentifier, initCap } from "../lib/utils";
import { format, addHours } from "date-fns";
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
      className={`p-3 text-sm text-center md:text-left ${getFont(
        location
      )} hover:bg-gray-100 min-h-30 min-w-full max-h-min w-full md:min-w-0`}
      onClick={() => changeLocation(toIdentifier(entry.city, entry.fips))}
    >
      <span className={"text-base font-semibold"}>
        {initCap(entry.city)}, {entry.state}
      </span>
      {entry.status === "Available" && (
        <>
          <br />
          <a className="hover:underline" href={CVS_APPT_URL} target="_blank">
            Schedule an appointment
          </a>
        </>
      )}
      <br />
      <span className="text-xs">
        Last updated:{" "}
        {format(addHours(new Date(entry.lastUpdated), 2), "Pp") + " EST"}
      </span>
    </div>
  );
}
