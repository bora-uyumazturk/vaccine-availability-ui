import _ from "lodash";

export function toIdentifier(name, fip) {
  return `${name.toLowerCase()}-${fip.toLowerCase()}`;
}

export function getGazetteerFeatures(data, identifier) {
  const [name, fip] = identifier.split("-");
  return _.filter(data, { NAME_LOWER: name, fips: fip });
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

export function closestPoint(lat, long, gazetteer) {
  const closest = _.minBy(gazetteer, (x) => {
    return distanceBetweenCoordinates(
      lat,
      long,
      parseFloat(x.latitude),
      parseFloat(x.longitude)
    );
  });

  console.log(closest.identifier);

  return closest.identifier;
}

// distance as the crow flies
// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function distanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
