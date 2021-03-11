export function toIdentifier(name, fip) {
  return `${name.toLowerCase()}-${fip.toLowerCase()}`;
}

export function getByStatus(data, statusName) {
  return _.filter(data, { status: statusName }).map((x) =>
    toIdentifier(x.city_lower, x.fips)
  );
}

export function initCap(str) {
  let words = str.split(" ").map((x) => {
    x = x.toLowerCase();
    return x.charAt(0).toUpperCase() + x.slice(1);
  });

  return words.join(" ");
}
