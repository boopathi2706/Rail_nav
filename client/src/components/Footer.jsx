import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import {
  TrainFront,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  TriangleAlert,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "Stations", to: "/stations" },
    { name: "AI Assistant", to: "/chatbot" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white"
    >
      {/* Background Blur */}
      <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-3 shadow-lg">
                <TrainFront size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">RailNav</h2>
                <p className="text-sm text-gray-300">
                  Smart Railway Navigation
                </p>
              </div>
            </div>

            <p className="mt-5 leading-7 text-gray-300">
              RailNav helps passengers easily navigate railway stations by
              finding platforms, ticket counters, waiting halls, canteens,
              restrooms and more using one smart web application.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-semibold">
              Quick Links
            </h3>

            <div className="space-y-4">
              {quickLinks.map((item) => (
                <RouterLink
                  key={item.name}
                  to={item.to}
                  className="block cursor-pointer text-gray-300 transition hover:translate-x-2 hover:text-cyan-400"
                >
                  {item.name}
                </RouterLink>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-6 text-xl font-semibold">
              Contact Us
            </h3>

            <div className="space-y-5 text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="text-cyan-400" />
                <span>support@railnav.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-cyan-400" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-cyan-400" />
                <span>Tamil Nadu, India</span>
              </div>
            </div>
          </motion.div>

          {/* Issue */}
          <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  viewport={{ once: true }}
>
  <h3 className="mb-6 text-xl font-semibold">
    Report an Issue
  </h3>

  <p className="mb-6 text-sm leading-6 text-gray-300">
    Found any issue while using <span className="font-semibold text-cyan-400">RailNav</span>?
    Fill out the form below and we'll get back to you as soon as possible.
  </p>

  <form className="space-y-4">

    {/* Email */}
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none backdrop-blur-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white/15"
      />
    </div>

    {/* Issue */}
    <div>
      <textarea
        rows="4"
        placeholder="Describe your issue..."
        className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 outline-none backdrop-blur-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white/15"
      ></textarea>
    </div>

    {/* Submit */}
    <motion.button
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 10px 25px rgba(59,130,246,0.35)",
      }}
      whileTap={{ scale: 0.96 }}
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg"
    >
      <TriangleAlert size={18} />
      Submit Issue
    </motion.button>

  </form>
</motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/20"></div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} RailNav. All Rights Reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <motion.a
              whileHover={{ y: -6, scale: 1.15 }}
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-3 transition hover:bg-cyan-500"
            >
              <FaGithub size={20} />
            </motion.a>

            <motion.a
              whileHover={{ y: -6, scale: 1.15 }}
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-3 transition hover:bg-cyan-500"
            >
              <FaLinkedin size={20} />
            </motion.a>

            <motion.a
              whileHover={{ y: -6, scale: 1.15 }}
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 p-3 transition hover:bg-cyan-500"
            >
              <FaInstagram size={20} />
            </motion.a>
          </div>

          {/* Scroll To Top */}
          <motion.button
            whileHover={{
              scale: 1.1,
              rotate: 180,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-4 shadow-xl text-white"
          >
            <ArrowUp size={22} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;