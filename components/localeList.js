import LocaleDetail from "./localeDetail";

export default function LocaleList({ entries }) {
  return (
    <ul className="border overflow-y-scroll max-h-96">
      {entries.map((e) => (
        <LocaleDetail entry={e}></LocaleDetail>
      ))}
    </ul>
  );
}
