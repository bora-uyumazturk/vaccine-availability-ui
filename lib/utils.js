export function toIdentifier(name, fip) {
  return `${name.toLowerCase()}-${fip.toLowerCase()}`;
}

export function getGazetteerFeatures(data, identifier) {
  const [name, fip] = identifier.split("-");
  console.log([name, fip]);
  return _.filter(data, { NAME_LOWER: name, fips: fip });
}

export function getByStatus(data, statusName) {
  return _.filter(data, { status: statusName }).map((x) =>
    toIdentifier(x.city_lower, x.fips)
  );
}
