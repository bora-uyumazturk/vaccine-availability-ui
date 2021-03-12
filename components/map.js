import { useState, useEffect, useRef } from "react";
import { usePosition } from "use-position";
import { toIdentifier, getByStatus } from "../lib/utils";
import { FIPS_URL, SYRINGE_IMAGE } from "../lib/constants";
import _ from "lodash";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const LARGE = 0.4;
const MEDIUM = 0.3;
const SMALL = 0.2;

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ center, location, changeLocation, entries }) {
  let ref = useRef(null);

  let fipsRef = useRef(null);

  let clickedLocation = useRef(null);

  const [clicked, setClicked] = useState(false);

  const { latitude, longitude } = usePosition();

  const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

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
              "circle-radius": 10,
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

    // fetch map from fips to state
    const setFips = async () => {
      fipsRef.current = await fetch("/api/fips").then((res) => res.json());
      fipsRef.current = Object.keys(fipsRef.current.data).reduce((acc, k) => {
        const v = parseInt(fipsRef.current.data[k]);
        acc[v] = k;
        return acc;
      }, {});
    };
    setFips();
  }, []);

  // add changing of coordinates on location change
  useEffect(() => {
    if (ref.current && location) {
      const [city, state] = location.split("-");

      console.log(clicked);
      if (clicked === false && fipsRef.current) {
        let curZoom = ref.current.getZoom();

        geocodingClient
          .forwardGeocode({
            query: `${city}, ${fipsRef.current[parseInt(state)]}`,
            types: ["place"],
            countries: ["US"],
            autocomplete: false,
            limit: 1,
          })
          .send()
          .then((response) => {
            return response.body.features[0].center;
          })
          .then((response) => {
            ref.current.flyTo({
              center: response,
              // zoom: Math.max(center.zoom, curZoom),
              zoom: curZoom,
            });
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

  return <div id="my-map" className="relative h-full w-2/4" />;
}
