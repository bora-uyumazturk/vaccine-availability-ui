// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import { GAZETTEER_URL, FIPS_URL } from "../../lib/constants";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(GAZETTEER_URL);
  let fips_map = await d3.json(FIPS_URL);

  data = data.map((x) => {
    x.fips = fips_map[x.USPS];
    return x;
  });

  return res.status(200).json({ data: data });
}
