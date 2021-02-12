// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as d3 from "d3";

const DATA_URL =
  "https://raw.githubusercontent.com/bora-uyumazturk/scrape-covid-availability/main/data/vaccine_info.csv";

// currently returns sample data
export default async function handler(req, res) {
  const data = await d3.csv(DATA_URL);
  res.status(200).json({ data: data[0] });
}
