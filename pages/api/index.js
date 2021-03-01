// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import _ from "lodash";
import { DATA_URL, FIPS_URL } from "../../lib/constants";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(DATA_URL);
  let fips_map = await d3.json(FIPS_URL);

  data = data.map((x) => {
    x.city_lower = x.city.toLowerCase();
    x.fips = fips_map[x.state];
    return x;
  });

  res.status(200).json({ data: data });
}
