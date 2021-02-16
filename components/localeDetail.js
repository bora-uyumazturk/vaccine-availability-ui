export default function LocaleDetail({
  location,
  changeLocation,
  inputRef,
  entry,
}) {
  const getFont = (location) => {
    if (location === entry.city.toLowerCase()) {
      return "text-blue-600";
    }
  };

  return (
    <div
      ref={inputRef}
      className={`p-3 text-xs text-left ${getFont(
        location
      )} border-bottom w-auto hover:text-blue-600 focus:text-blue-600`}
      onClick={() => changeLocation(entry.city.toLowerCase())}
    >
      {entry.city}, {entry.state}
      <br />
      Percent available: {entry.pctAvailable}
      <br />
      Status: {entry.status}
      <br />
      Last updated: {entry.lastUpdated}
    </div>
  );
}
