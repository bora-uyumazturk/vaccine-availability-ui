export default function LocaleDetail({ entry }) {
  return (
    <div className="p-6 text-left border-bottom w-96 hover:text-blue-600 focus:text-blue-600">
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
