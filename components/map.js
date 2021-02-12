import ReactMapGL from "react-map-gl";
import { useState } from "react";

export default function Map({ token }) {
  const [viewport, setViewport] = useState({
    latitude: 38.9072,
    longitude: -77.0364,
    zoom: 6,
  });

  const onViewportChange = (view) => {
    view.width = "50%";
    view.height = "100%";
    setViewport(view);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      onViewportChange={(view) => onViewportChange(view)}
      width="50%"
      height="100%"
    />
  );
}
