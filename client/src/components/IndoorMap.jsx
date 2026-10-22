import { motion } from "framer-motion";
import {
  Ticket,
  Coffee,
  Bath,
  TrainFront,
  MapPin,
  UserRound,
} from "lucide-react";

const places = [
  {
    name: "Entrance",
    x: "8%",
    y: "82%",
    icon: <MapPin />,
    color: "bg-green-500",
  },
  {
    name: "Ticket Counter",
    x: "22%",
    y: "62%",
    icon: <Ticket />,
    color: "bg-blue-500",
  },
  {
    name: "Waiting Hall",
    x: "42%",
    y: "52%",
    icon: <TrainFront />,
    color: "bg-yellow-500",
  },
  {
    name: "Food Court",
    x: "68%",
    y: "36%",
    icon: <Coffee />,
    color: "bg-orange-500",
  },
  {
    name: "Restroom",
    x: "82%",
    y: "22%",
    icon: <Bath />,
    color: "bg-purple-500",
  },
  {
    name: "Platform 1",
    x: "55%",
    y: "72%",
    icon: <TrainFront />,
    color: "bg-red-500",
  },
  {
    name: "Platform 2",
    x: "75%",
    y: "72%",
    icon: <TrainFront />,
    color: "bg-red-600",
  },
];

const IndoorMap = ({ currentLocation = "Entrance" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-10 rounded-3xl bg-white p-8 shadow-2xl"
    >
      <h2 className="mb-6 text-center text-3xl font-bold">
        Indoor Railway Map
      </h2>

      <div className="relative h-[650px] w-full overflow-hidden rounded-3xl border-4 border-slate-200 bg-slate-100">

        {/* Walk Path */}

        <svg
          className="absolute inset-0 h-full w-full"
        >
          <line
            x1="8%"
            y1="82%"
            x2="22%"
            y2="62%"
            stroke="#2563eb"
            strokeWidth="8"
          />

          <line
            x1="22%"
            y1="62%"
            x2="42%"
            y2="52%"
            stroke="#2563eb"
            strokeWidth="8"
          />

          <line
            x1="42%"
            y1="52%"
            x2="68%"
            y2="36%"
            stroke="#2563eb"
            strokeWidth="8"
          />

          <line
            x1="68%"
            y1="36%"
            x2="82%"
            y2="22%"
            stroke="#2563eb"
            strokeWidth="8"
          />

          <line
            x1="42%"
            y1="52%"
            x2="55%"
            y2="72%"
            stroke="#16a34a"
            strokeWidth="8"
          />

          <line
            x1="55%"
            y1="72%"
            x2="75%"
            y2="72%"
            stroke="#16a34a"
            strokeWidth="8"
          />
        </svg>

        {/* Current User */}

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="absolute left-[8%] top-[82%] z-20"
        >
          <div className="rounded-full bg-cyan-600 p-3 text-white shadow-xl">
            <UserRound size={24} />
          </div>

          <p className="mt-2 rounded bg-cyan-600 px-2 py-1 text-xs text-white">
            You
          </p>
        </motion.div>

        {/* Places */}

        {places.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{
              scale: 1.1,
            }}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
            }}
          >
            <div
              className={`${item.color} rounded-full p-4 text-white shadow-xl`}
            >
              {item.icon}
            </div>

            <p className="mt-2 rounded-lg bg-white px-2 py-1 text-center text-sm font-semibold shadow">
              {item.name}
            </p>
          </motion.div>
        ))}

      </div>

      <div className="mt-6 rounded-xl bg-blue-50 p-5">
        <h3 className="text-xl font-bold text-blue-700">
          Current Position
        </h3>

        <p className="mt-2 text-lg">
          📍 {currentLocation}
        </p>
      </div>
    </motion.div>
  );
};

export default IndoorMap;