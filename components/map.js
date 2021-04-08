import { useState, useEffect, useRef } from "react";
import { usePosition } from "use-position";
import {
  getByStatus,
  getFeaturesByIdentifier,
  closestPoint,
} from "../lib/utils";
import { SYRINGE_IMAGE } from "../lib/constants";
import _ from "lodash";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

const LARGE = 0.4;
const MEDIUM = 0.3;
const SMALL = 0.25;

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({
  center,
  location,
  defaultLocation,
  changeLocation,
  rendered,
  changeRendered,
  entries,
}) {
  let ref = useRef(null);

  let clickedLocation = useRef(null);

  const [clicked, setClicked] = useState(false);

  const { latitude, longitude, error } = usePosition();

  // set up map and load data
  useEffect(() => {
    // initialize map and set map effects
    ref.current = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/borauyumazturk/ckl4pn50n3lqa17o78ubsy0d0",
      center: [center.long, center.lat],
      zoom: center.minZoom,
      minZoom: center.minZoom,
      attributionControl: false,
    });

    let map = ref.current;

    map.on("load", function () {
      var layers = map.getStyle().layers;
      // Find the id of the last layer in the map style
      // so that we can overlay other layers on top of it.
      var lastLayerId = map.getStyle().layers[map.getStyle().layers.length - 1]
        .id;

      map.addSource("mapbox-gazetteer-points", {
        type: "vector",
        url: "mapbox://borauyumazturk.duv920xw",
      });

      // images to load
      const images = [{ src: SYRINGE_IMAGE, id: "syringe-emoji" }];

      // use promises to reduce nesting
      Promise.all(
        images.map(
          (img) =>
            new Promise((resolve, reject) => {
              map.loadImage(img.src, function (error, res) {
                map.addImage(img.id, res);
                resolve();
              });
            })
        )
      ).then(() => {
        map.addLayer(
          {
            id: "icons",
            type: "symbol",
            source: "mapbox-gazetteer-points",
            "source-layer": "gazetteer_w_identifier-c27278",
            layout: {
              "icon-image": "syringe-emoji",
              "icon-size": [
                "case",
                ["==", ["get", "identifier"], location],
                LARGE,
                SMALL,
              ],
              "icon-allow-overlap": true,
              visibility: "visible",
            },
            filter: ["in", "identifier", ...getByStatus(entries, "Available")],
          },
          lastLayerId
        );

        // have more precise layer for event detection
        map.addLayer(
          {
            id: "circles",
            type: "circle",
            source: "mapbox-gazetteer-points",
            "source-layer": "gazetteer_w_identifier-c27278",
            paint: {
              "circle-radius": 15,
              "circle-opacity": 0.0,
            },
            filter: ["in", "identifier", ...getByStatus(entries, "Available")],
          },
          lastLayerId
        );
      });
    });

    map.on("click", "circles", function (e) {
      const features = e.features;

      if (features.length > 0) {
        setClicked(true);
        changeLocation(features[0].properties.identifier);
      }
    });

    map.on("mousemove", "circles", function (e) {
      const features = e.features;

      if (features.length > 0) {
        var identifier = features[0].properties.identifier;
        map.setLayoutProperty("icons", "icon-size", [
          "case",
          ["==", ["get", "identifier"], clickedLocation.current],
          LARGE,
          ["==", ["get", "identifier"], identifier],
          MEDIUM,
          SMALL,
        ]);
      } else {
        map.setLayoutProperty("icons", "icon-size", [
          "case",
          ["==", ["get", "identifier"], clickedLocation.current],
          LARGE,
          SMALL,
        ]);
      }
    });

    map.on("mouseleave", "circles", function (e) {
      map.setLayoutProperty("icons", "icon-size", [
        "case",
        ["==", ["get", "identifier"], clickedLocation.current],
        LARGE,
        SMALL,
      ]);
    });

    // cleanup in case earlier events didn't fire
    // documentation for the event: https://docs.mapbox.com/mapbox-gl-js/api/map/#map.event:idle
    map.on("idle", function (e) {
      changeRendered(true);

      ref.current.setLayoutProperty("icons", "icon-size", [
        "case",
        ["==", ["get", "identifier"], clickedLocation.current],
        LARGE,
        SMALL,
      ]);

      // ref.current.setLayoutProperty("icons", "visibility", "visible");
    });
  }, []);

  // add changing of coordinates on location change
  useEffect(() => {
    if (rendered) {
      if (location) {
        const feat = getFeaturesByIdentifier(entries, location)[0];

        try {
          ref.current.setLayoutProperty("icons", "icon-size", [
            "case",
            ["==", ["get", "identifier"], location],
            LARGE,
            SMALL,
          ]);
        } catch (error) {}

        if (feat) {
          const curZoom = ref.current.getZoom();

          ref.current.flyTo({
            center: [parseFloat(feat.longitude), parseFloat(feat.latitude)],
            zoom: Math.max(center.zoom, curZoom),
          });
        }
      }

      clickedLocation.current = location;

      setClicked(false);
    }
  }, [location, rendered]);

  useEffect(() => {
    if (rendered) {
      if (ref.current && latitude && longitude) {
        changeLocation(closestPoint(latitude, longitude, entries));
      } else if (error && defaultLocation) {
        console.log(error);
        changeLocation(defaultLocation);
      }
    }
  }, [latitude, longitude, error, rendered]);

  useEffect(() => {
    if (ref.current) {
      try {
        ref.current.setFilter("icons", [
          "in",
          "identifier",
          ...getByStatus(entries, "Available"),
        ]);

        ref.current.setFilter("circles", [
          "in",
          "identifier",
          ...getByStatus(entries, "Available"),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  });

  return <div id="my-map" className="relative h-full w-3/4 md:w-2/4 border" />;
}
