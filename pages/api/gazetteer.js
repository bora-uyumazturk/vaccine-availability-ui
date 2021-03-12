// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";
import { GAZETTEER_URL } from "../../lib/constants";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(GAZETTEER_URL);

  return res.status(200).json({ data: data });
}
