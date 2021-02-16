// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import _ from "lodash";

const DATA_URL =
  "https://raw.githubusercontent.com/bora-uyumazturk/scrape-covid-availability/main/data/vaccine_info.csv";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(DATA_URL);
  // filter to DMV
  data = _.chain(data)
    .groupBy("state")
    .pick(["VA", "MD", "DC"])
    .values()
    .flatten()
    .value();
  res.status(200).json({ data: data });
}
