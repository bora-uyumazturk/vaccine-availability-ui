// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import { FIPS_URL } from "../../lib/constants";

// currently returns sample data
export default async function handler(req, res) {
  let fips_map = await d3.json(FIPS_URL);

  return res.status(200).json({ data: fips_map });
}
