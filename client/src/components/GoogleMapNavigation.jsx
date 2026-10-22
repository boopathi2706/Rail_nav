import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { motion } from "framer-motion";

import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  DirectionsService,
  Marker,
} from "@react-google-maps/api";

import SearchPanel from "./SearchPanel";
import StationMarkers from "./StationMarkers";
import CurrentLocationButton from "./CurrentLocationButton";
import RouteInformation from "./RouteInformation";
import NavigationControls from "./NavigationControls";

import { stationLocations } from "../data/stationLocations";

const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "700px",
};

const defaultCenter = {
  lat: 11.0168,
  lng: 76.9558,
};

const GoogleMapNavigation = () => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API,
    libraries,
  });

  const [map, setMap] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(null);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const [directions, setDirections] = useState(null);

  const [distance, setDistance] = useState("");

  const [duration, setDuration] = useState("");

  const [steps, setSteps] = useState([]);

  const [navigate, setNavigate] = useState(false);

  const [isNavigating, setIsNavigating] =
    useState(false);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  /* ---------------- GPS ---------------- */

  useEffect(() => {

    if (!navigator.geolocation) return;

    const watchId =
      navigator.geolocation.watchPosition(

        (position) => {

          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

        },

        (err) => console.log(err),

        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }

      );

    return () =>
      navigator.geolocation.clearWatch(watchId);

  }, []);

  /* ---------------- Center ---------------- */

  const center = useMemo(() => {

    return currentLocation || defaultCenter;

  }, [currentLocation]);

  /* ---------------- Navigate ---------------- */

  const handleNavigate = () => {

    if (!selectedPlace) return;

    setNavigate(true);

    setIsNavigating(true);

  };

  /* ---------------- Reset ---------------- */

  const resetNavigation = () => {

    setDirections(null);

    setDistance("");

    setDuration("");

    setSteps([]);

    setNavigate(false);

    setIsNavigating(false);

  };

  /* ---------------- Directions Callback ---------------- */

  const directionsCallback =
    useCallback((result, status) => {

      if (status !== "OK") return;

      setDirections(result);

      const leg =
        result.routes[0].legs[0];

      setDistance(leg.distance.text);

      setDuration(leg.duration.text);

      setSteps(
        leg.steps.map(
          (step) =>
            step.instructions.replace(
              /<[^>]*>?/gm,
              ""
            )
        )
      );

    }, []);

  if (!isLoaded) {

    return (

      <div className="flex h-screen items-center justify-center">

        <h2 className="text-3xl font-bold">

          Loading Google Maps...

        </h2>

      </div>

    );

  }

  return (

    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100 py-10">

      <div className="mx-auto max-w-7xl px-5">

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >

          <h1 className="text-5xl font-bold text-slate-800">

            Rail Navigation

          </h1>

          <p className="mt-4 text-lg text-slate-600">

            Smart Indoor Railway Navigation

          </p>

        </motion.div>

        <SearchPanel
          stations={stationLocations}
          selectedPlace={selectedPlace}
          setSelectedPlace={setSelectedPlace}
          onNavigate={handleNavigate}
        />

                {/* Google Map */}

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mt-8 overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "700px",
            }}
            center={center}
            zoom={19}
            onLoad={(mapInstance) => setMap(mapInstance)}
            options={{
              streetViewControl: false,
              fullscreenControl: false,
              mapTypeControl: false,
              clickableIcons: false,
              zoomControl: true,
              gestureHandling: "greedy",
            }}
          >
            {/* Current User */}

            {currentLocation && (
              <Marker
                position={currentLocation}
                title="Your Current Location"
                animation={window.google.maps.Animation.DROP}
              />
            )}

            {/* All Station Markers */}

            <StationMarkers
              stations={stationLocations}
              selectedPlace={selectedPlace}
            />

            {/* Route */}

            {navigate &&
              currentLocation &&
              selectedPlace && (
                <DirectionsService
                  options={{
                    origin: currentLocation,
                    destination: {
                      lat: selectedPlace.lat,
                      lng: selectedPlace.lng,
                    },
                    travelMode:
                      window.google.maps.TravelMode.WALKING,
                  }}
                  callback={directionsCallback}
                />
              )}

            {/* Draw Route */}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  suppressMarkers: false,
                  polylineOptions: {
                    strokeColor: "#2563EB",
                    strokeWeight: 6,
                    strokeOpacity: 0.85,
                  },
                }}
              />
            )}
          </GoogleMap>

          {/* Floating GPS Button */}

          <CurrentLocationButton
            map={map}
            currentLocation={currentLocation}
          />
        </motion.div>

        {/* Route Details */}

        <RouteInformation
          currentLocation={currentLocation}
          destination={selectedPlace?.name}
          distance={distance}
          duration={duration}
          steps={steps}
        />

        {/* Navigation Controls */}

        <NavigationControls
          isNavigating={isNavigating}
          setIsNavigating={setIsNavigating}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          resetNavigation={resetNavigation}
        />

      </div>

    </section>

  );
};

export default GoogleMapNavigation;