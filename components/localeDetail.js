export default function LocaleDetail({
  location,
  changeLocation,
  inputRef,
  entry,
}) {
  const getFont = (location) => {
    if (
      location === `${entry.city.toLowerCase()}-${entry.state.toLowerCase()}`
    ) {
      return "text-blue-600";
    }
  };

  return (
    <div
      ref={inputRef}
      className={`p-3 text-sm text-left ${getFont(
        location
      )} border-bottom w-auto hover:bg-gray-100`}
      onClick={() =>
        changeLocation(
          `${entry.city.toLowerCase()}-${entry.state.toLowerCase()}`
        )
      }
    >
      {entry.city}, {entry.state}
      <br />
      Status: {entry.status}
      <br />
      Last updated: {entry.lastUpdated}
    </div>
  );
}
