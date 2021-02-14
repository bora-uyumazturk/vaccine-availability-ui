import { useState, useEffect } from "react";
import _ from "lodash";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ center, changeLocation, entries }) {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [center.long, center.lat],
      zoom: center.zoom,
      attributionControl: false,
    });

    map.on("load", function () {
      fetch("/api/boundaries")
        .then((res) => res.json())
        .then((geojson) => {
          console.log(geojson);
          return geojson.data;
        })
        .then((geojson) => {
          map.addSource("mapbox-boundary", {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: "boundary-data",
            type: "fill",
            source: "mapbox-boundary",
            paint: {
              "fill-color": {
                property: "status",
                type: "categorical",
                stops: [
                  ["Fully Booked", "#ed3b53"],
                  ["Available", "#3ce862"],
                ],
              },
              "fill-opacity": 0.8,
              "fill-outline-color": "#0a0a0a",
            },
          });
        });
    });

    map.on("click", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["boundary-data"],
      });

      if (features.length > 0) {
        console.log(features[0].properties.NAME);
        changeLocation(features[0].properties.NAME);
      }
    });
  }, []);

  return <div id="my-map" className="relative h-full w-2/4" />;
}
