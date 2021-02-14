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
  });

  return <div id="my-map" className="relative h-full w-2/4" />;
}
