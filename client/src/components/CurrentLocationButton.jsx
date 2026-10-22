import React from "react";
import { motion } from "framer-motion";
import { LocateFixed } from "lucide-react";

const CurrentLocationButton = ({ map, currentLocation }) => {
  const handleCurrentLocation = () => {
    if (!map || !currentLocation) return;

    map.panTo(currentLocation);

    map.setZoom(20);
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        rotate: 10,
      }}
      whileTap={{
        scale: 0.9,
      }}
      onClick={handleCurrentLocation}
      className="
        absolute
        bottom-6
        right-6
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-2xl
        transition-all
        hover:bg-blue-600
        hover:text-white
      "
    >
      <LocateFixed size={28} />
    </motion.button>
  );
};

export default CurrentLocationButton;