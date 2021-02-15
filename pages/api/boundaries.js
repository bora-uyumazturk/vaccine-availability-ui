// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import _ from "lodash";

// Merge features and city data.
function updateFeatures(features, city_data) {
  var updatedFeatures = features.map((el) => {
    var city = el.properties.NAME.toLowerCase();
    var correspondingEntry = _.find(
      city_data,
      _.matchesProperty("city_lower", city)
    );
    if (correspondingEntry) {
      el.properties.pctAvailable = correspondingEntry.pctAvailable;
      el.properties.totalAvailable = correspondingEntry.totalAvailable;
      el.properties.status = correspondingEntry.status;
      return el;
    }
  });

  return _.filter(updatedFeatures, "properties.status");
}

const JSON_URL =
  "https://raw.githubusercontent.com/bora-uyumazturk/us-place-geojson/main/dmv-boundaries.json";

const CSV_URL =
  "https://raw.githubusercontent.com/bora-uyumazturk/scrape-covid-availability/main/data/vaccine_info.csv";

// currently returns sample data
export default async function handler(req, res) {
  let promises = [d3.csv(CSV_URL), d3.json(JSON_URL)];

  Promise.all(promises).then((allData) => {
    let csv_data = allData[0];
    let json_data = allData[1];

    csv_data = csv_data.map((x) => {
      x.city_lower = x.city.toLowerCase();
      return x;
    });

    // filter to DMV
    csv_data = _.chain(csv_data)
      .groupBy("state")
      .pick(["VA", "MD", "DC"])
      .values()
      .flatten()
      .value();

    json_data.features = updateFeatures(json_data.features, csv_data);

    res.status(200).json({ data: json_data });
  });
}
