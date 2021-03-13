// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import { DATA_URL, FIPS_URL, GAZETTEER_URL } from "../../lib/constants";
import { toIdentifier } from "../../lib/utils";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(DATA_URL);
  let fips_map = await d3.json(FIPS_URL);
  let gazetteer = await d3.csv(GAZETTEER_URL);

  data = data.map((x) => {
    x.city_lower = x.city.toLowerCase();
    x.fips = fips_map[x.state];
    return x;
  });

  let identifiers = data.map((x) => toIdentifier(x.city, x.fips));

  gazetteer = gazetteer.filter((x) => identifiers.includes(x.identifier));

  return res.status(200).json({ data: gazetteer });
}
