import { useState, useEffect, useRef } from "react";
import { usePosition } from "use-position";
import { toIdentifier, getByStatus, getGazetteerFeatures } from "../lib/utils";
import { FIPS_URL, SYRINGE_IMAGE } from "../lib/constants";
import _ from "lodash";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const LARGE = 0.4;
const MEDIUM = 0.3;
const SMALL = 0.25;

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ center, location, changeLocation, entries }) {
  let dataRef = useRef(null);

  let ref = useRef(null);

  let clickedLocation = useRef(null);

  const [clicked, setClicked] = useState(false);

  const { latitude, longitude } = usePosition();

  const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

  // set up map and load data
  useEffect(() => {
    // initialize map and set map effects
    ref.current = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [center.long, center.lat],
      zoom: center.minZoom,
      minZoom: center.minZoom,
      attributionControl: false,
    });

    let map = ref.current;

    map.on("load", function () {
      var layers = map.getStyle().layers;
      // Find the index of the first symbol layer in the map style
      // so that we can overlay other layers on top of it.
      var firstSymbolId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol") {
          firstSymbolId = layers[i].id;
          break;
        }
      }

      firstSymbolId = map.getStyle().layers[map.getStyle().layers.length - 1]
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
              "icon-size": SMALL,
              "icon-allow-overlap": true,
            },
            filter: ["in", "identifier", ...getByStatus(entries, "Available")],
          },
          firstSymbolId
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
          firstSymbolId
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

    // fetch gazetteer data
    const setData = async () => {
      dataRef.current = await fetch("/api/gazetteer").then((res) => res.json());
      dataRef.current = dataRef.current.data;
    };
    setData();
  }, []);

  // add changing of coordinates on location change
  useEffect(() => {
    if (dataRef.current && location) {
      const feat = getGazetteerFeatures(dataRef.current, location)[0];

      if (clicked === false && feat) {
        const curZoom = ref.current.getZoom();

        ref.current.flyTo({
          center: [parseFloat(feat.longitude), parseFloat(feat.latitude)],
          zoom: Math.max(center.zoom, curZoom),
        });
      }

      ref.current.setLayoutProperty("icons", "icon-size", [
        "case",
        ["==", ["get", "identifier"], location],
        LARGE,
        SMALL,
      ]);
    }

    clickedLocation.current = location;

    setClicked(false);
  }, [location]);

  useEffect(() => {
    if (ref.current && latitude && longitude) {
      ref.current.flyTo({
        center: [longitude, latitude],
        zoom: center.zoom,
      });
    }
  }, [latitude, longitude]);

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
