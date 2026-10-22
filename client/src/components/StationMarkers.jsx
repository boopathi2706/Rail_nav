import React, { useState } from "react";
import {
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const getMarkerIcon = (type) => {
  switch (type) {
    case "entrance":
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

    case "ticket":
      return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    case "platform":
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

    case "food":
      return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";

    case "restroom":
      return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";

    case "lift":
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    case "escalator":
      return "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";

    default:
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  }
};

const StationMarkers = ({ stations, selectedPlace }) => {
  const [activeMarker, setActiveMarker] = useState(null);

  return (
    <>
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={{
            lat: station.lat,
            lng: station.lng,
          }}
          icon={{
            url: getMarkerIcon(station.type),
          }}
          animation={
            selectedPlace?.id === station.id
              ? window.google.maps.Animation.BOUNCE
              : undefined
          }
          onClick={() => setActiveMarker(station.id)}
        >
          {activeMarker === station.id && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="min-w-[180px]">
                <h2 className="text-lg font-bold">
                  {station.name}
                </h2>

                <p className="text-gray-600 capitalize">
                  {station.type}
                </p>

                <hr className="my-2" />

                <p className="text-sm text-blue-600">
                  📍 Coimbatore Junction
                </p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </>
  );
};

export default StationMarkers;