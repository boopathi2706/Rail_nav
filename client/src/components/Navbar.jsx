import React, { useState } from "react";
import { Menu, X, TrainFront } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const menus = [
    { name: "Home", to: "home", path: "/" },
    { name: "Stations", to: "station", path: "/stations" },
    { name: "Assistant", to: "assistant", path: "/chatbot" },
    { name: "Purpose", to: "purpose", path: "/about" },
  ];

  const handleNavClick = (path, to) => {
    setOpen(false);
    if (!isHomePage && path === "/") {
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <RouterLink to="/">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 p-2.5 text-white shadow-md shadow-blue-500/25">
              <TrainFront size={22} className="rotate-3" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Rail<span className="text-blue-600">Nav</span>
              </span>
              <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest leading-none mt-0.5">
                Indian Railways
              </p>
            </div>
          </motion.div>
        </RouterLink>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {menus.map((item) => {
            const isActive = location.pathname === item.path;
            return isHomePage && item.path === "/" ? (
              <ScrollLink
                key={item.name}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={700}
                activeClass="text-blue-600 font-semibold"
                className="relative cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </ScrollLink>
            ) : (
              <RouterLink
                key={item.name}
                to={item.path}
                className={`relative text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 h-[2px] w-full bg-blue-600"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </RouterLink>
            );
          })}
        </div>

        {/* Desktop Buttons (Matching the reference design) */}
        <div className="hidden items-center gap-3 md:flex">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            Log in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Sign up
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden focus:outline-none"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 bg-white shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              {menus.map((item) => (
                <RouterLink
                  key={item.name}
                  to={item.path}
                  onClick={() => handleNavClick(item.path, item.to)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </RouterLink>
              ))}

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
                <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition-all">
                  Log in
                </button>
                <button className="w-full rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                  Sign up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;