import { useEffect } from "react";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ token }) {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [-77.0364, 38.9072],
      zoom: 8,
      attributionControl: false,
    });

    map.on("load", function () {
      map.addSource("mapbox-boundary", {
        type: "vector",
        url: "mapbox://borauyumazturk.013f7wds",
      });
      map.addLayer({
        id: "boundary-data",
        type: "fill",
        source: "mapbox-boundary",
        "source-layer": "cb_2019_us_place_500k-82b5vo",
        paint: {
          "fill-color": "#00ffff",
          "fill-opacity": 0.5,
          "fill-outline-color": "#0a0a0a",
        },
      });
    });
  });

  return <div id="my-map" className="relative h-full w-2/4" />;
}
