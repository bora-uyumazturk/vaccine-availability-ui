// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";

const GAZETTEER_URL =
  "https://raw.githubusercontent.com/bora-uyumazturk/us-place-geojson/main/gazetteer.csv";

// currently returns sample data
export default async function handler(req, res) {
  let data = await d3.csv(GAZETTEER_URL);
  return res.status(200).json({ data: data });
}
