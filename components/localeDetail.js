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
      )} font-semibold border-bottom w-auto hover:bg-gray-100`}
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
