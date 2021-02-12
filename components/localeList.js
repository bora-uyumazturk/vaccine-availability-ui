import LocaleDetail from "./localeDetail";

export default function LocaleList({ entries }) {
  return (
    <ul className="flex-initial border overflow-auto h-full">
      {entries.map((e) => (
        <LocaleDetail entry={e}></LocaleDetail>
      ))}
    </ul>
  );
}
