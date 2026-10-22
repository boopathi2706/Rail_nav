import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  LocateFixed,
  Volume2,
  Square,
  CheckCircle2,
} from "lucide-react";

const RouteInformation = ({
  currentLocation,
  destination,
  distance,
  duration,
  steps = [],
}) => {
  const speakRoute = () => {
    if (!steps.length) {
      const speech = new SpeechSynthesisUtterance(
        `Navigation started.
         Your destination is ${destination}.
         Distance is ${distance}.
         Estimated walking time is ${duration}.`
      );

      speech.lang = "en-IN";
      speech.rate = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
      return;
    }

    window.speechSynthesis.cancel();

    steps.forEach((step, index) => {
      const speech = new SpeechSynthesisUtterance(
        `Step ${index + 1}. ${step}`
      );

      speech.lang = "en-IN";
      speech.rate = 1;

      window.speechSynthesis.speak(speech);
    });
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-3xl bg-white p-8 shadow-2xl"
    >
      <h2 className="mb-8 text-3xl font-bold text-slate-800">
        Route Information
      </h2>

      {/* Cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Current */}

        <div className="rounded-2xl bg-blue-50 p-6">

          <LocateFixed
            className="text-blue-600"
            size={35}
          />

          <h3 className="mt-4 font-bold">
            Current Location
          </h3>

          <p className="mt-2 text-gray-600">
            {currentLocation
              ? "Detected Successfully"
              : "Searching..."}
          </p>

        </div>

        {/* Destination */}

        <div className="rounded-2xl bg-red-50 p-6">

          <MapPin
            className="text-red-500"
            size={35}
          />

          <h3 className="mt-4 font-bold">
            Destination
          </h3>

          <p className="mt-2 text-gray-600">
            {destination || "Not Selected"}
          </p>

        </div>

        {/* Distance */}

        <div className="rounded-2xl bg-green-50 p-6">

          <Navigation
            className="text-green-600"
            size={35}
          />

          <h3 className="mt-4 font-bold">
            Distance
          </h3>

          <p className="mt-2 text-2xl font-bold text-green-700">
            {distance || "--"}
          </p>

        </div>

        {/* Time */}

        <div className="rounded-2xl bg-yellow-50 p-6">

          <Clock
            className="text-yellow-600"
            size={35}
          />

          <h3 className="mt-4 font-bold">
            Walking Time
          </h3>

          <p className="mt-2 text-2xl font-bold text-yellow-700">
            {duration || "--"}
          </p>

        </div>

      </div>

      {/* Buttons */}

      <div className="mt-8 flex flex-wrap gap-5">

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: .95,
          }}
          onClick={speakRoute}
          className="flex items-center gap-3 rounded-xl bg-green-600 px-7 py-4 font-semibold text-white shadow-lg"
        >
          <Volume2 />

          Start Voice Navigation

        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: .95,
          }}
          onClick={stopVoice}
          className="flex items-center gap-3 rounded-xl bg-red-600 px-7 py-4 font-semibold text-white shadow-lg"
        >
          <Square />

          Stop Voice

        </motion.button>

      </div>

      {/* Steps */}

      {steps.length > 0 && (

        <div className="mt-10">

          <h3 className="mb-5 text-2xl font-bold">
            Navigation Steps
          </h3>

          <div className="space-y-4">

            {steps.map((step, index) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * .1,
                }}
                className="flex items-start gap-4 rounded-xl bg-slate-100 p-5"
              >

                <CheckCircle2
                  className="mt-1 text-green-600"
                />

                <div>

                  <h4 className="font-semibold">

                    Step {index + 1}

                  </h4>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: step,
                    }}
                    className="text-gray-600"
                  />

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      )}

    </motion.div>
  );
};

export default RouteInformation;