import React from "react";

import Navbar from "../components/Navbar";
import Home from "./Home";
import StationList from "./StationList";
import AboutWebsite from "./AboutWebsite";
import Footer from "../components/Footer";
import {Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigation = useNavigate();
  return (
    <div>
      <Navbar />

      <section id="home">
        <Home />
      </section>

      <section id="station">
        <StationList />
      </section>

      <section id="purpose">
        <AboutWebsite />
      </section>

      <section id="compiled">
        <Footer />
      </section>
      <motion.button
            whileHover={{
              scale: 1.1,
              rotate: 180,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => navigation("/chatbot")}
            className="cursor-pointer rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-4 shadow-xl text-white absolute bottom-10 right-5 fixed z-25" 
          >
            <Sparkles size={22} />
          </motion.button>
    </div>
  );
};

export default MainPage;