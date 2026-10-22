import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

const SearchPanel = ({
  stations,
  selectedPlace,
  setSelectedPlace,
  onNavigate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="grid gap-5 lg:grid-cols-4">

        <div className="lg:col-span-3">
          <label className="mb-2 block font-semibold text-gray-700">
            Destination
          </label>

          <select
            value={selectedPlace?.id || ""}
            onChange={(e) =>
              setSelectedPlace(
                stations.find(
                  (item) => item.id === Number(e.target.value)
                )
              )
            }
            className="w-full rounded-xl border-2 border-gray-200 p-4 outline-none transition focus:border-blue-500"
          >
            <option value="">Choose Destination</option>

            {stations.map((station) => (
              <option
                key={station.id}
                value={station.id}
              >
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">

          <motion.button
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={onNavigate}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 font-bold text-white shadow-xl"
          >
            <Navigation size={20} />
            Navigate
          </motion.button>

        </div>

      </div>
    </motion.div>
  );
};

export default SearchPanel;