import { useState, useEffect, useRef } from "react";
import { usePosition } from "use-position";
import { toIdentifier, getByStatus, getGazetteerFeatures } from "../lib/utils";
import _ from "lodash";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ center, location, changeLocation, entries }) {
  let dataRef = useRef(null);

  let ref = useRef(null);

  const [clicked, setClicked] = useState(false);

  const { latitude, longitude } = usePosition();

  // set up map and load data
  useEffect(() => {
    // initialize map and set map effects
    ref.current = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/borauyumazturk/ckl4pn50n3lqa17o78ubsy0d0",
      center: [center.long, center.lat],
      zoom: center.zoom,
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

      map.addSource("mapbox-dummy-boundary", {
        type: "vector",
        url: "mapbox://borauyumazturk.cu4497hu",
      });

      map.addLayer(
        {
          id: "fully-booked",
          type: "fill",
          source: "mapbox-dummy-boundary",
          "source-layer": "place-boundaries-4z9c5e",
          paint: {
            "fill-color": "#ed3b53",
            "fill-opacity": 1.0,
            "fill-outline-color": "#0a0a0a",
          },
          filter: ["in", "identifier", ...getByStatus(entries, "Fully Booked")],
        },
        firstSymbolId
      );

      map.addLayer(
        {
          id: "available",
          type: "fill",
          source: "mapbox-dummy-boundary",
          "source-layer": "place-boundaries-4z9c5e",
          paint: {
            "fill-color": "#04d91a",
            "fill-opacity": 1.0,
            "fill-outline-color": "#0a0a0a",
          },
          filter: ["in", "identifier", ...getByStatus(entries, "Available")],
        },
        firstSymbolId
      );

      // location highlight layer
      map.addLayer(
        {
          id: "mouse-highlight",
          type: "line",
          source: "mapbox-dummy-boundary",
          "source-layer": "place-boundaries-4z9c5e",
          paint: {
            "line-width": 2,
          },
          // don't highlight anything at first
          filter: false,
        },
        firstSymbolId
      );

      // location highlight layer
      map.addLayer(
        {
          id: "location-highlight",
          type: "line",
          source: "mapbox-dummy-boundary",
          "source-layer": "place-boundaries-4z9c5e",
          paint: {
            "line-color": "#ecf224",
            "line-width": 2,
          },
          // don't highlight anything at first
          filter: false,
        },
        firstSymbolId
      );
    });

    map.on("click", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["fully-booked", "available"],
      });

      if (features.length > 0) {
        setClicked(true);
        changeLocation(features[0].properties.identifier);
      }
    });

    map.on("mousemove", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["fully-booked", "available"],
      });

      if (features.length > 0) {
        var identifier = features[0].properties.identifier;
        map.setFilter("mouse-highlight", ["==", "identifier", identifier]);
      } else {
        map.setFilter("mouse-highlight", false);
      }
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

      if (!clicked) {
        let curZoom = ref.current.getZoom();

        ref.current.flyTo({
          center: [parseFloat(feat.INTPTLONG), parseFloat(feat.INTPTLAT)],
          zoom: Math.max(center.zoom, curZoom),
        });
      }

      ref.current.setFilter("location-highlight", [
        "==",
        "identifier",
        location,
      ]);

      ref.current.setFilter("mouse-highlight", false);
    }

    setClicked(false);
  }, [location, clicked]);

  useEffect(() => {
    if (dataRef.current && latitude && longitude) {
      ref.current.flyTo({
        center: [longitude, latitude],
        zoom: center.zoom,
      });
    }
  }, [latitude, longitude]);

  return <div id="my-map" className="relative h-full w-2/4" />;
}
