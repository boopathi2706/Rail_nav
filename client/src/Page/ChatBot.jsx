import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Sparkles,
  TrainFront,
  Circle,
  MessageSquare,
  Compass,
  CornerDownRight,
} from "lucide-react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! Welcome to RailNav.\nI'm your smart railway assistant.\n\nAsk me anything about platforms, ticket counters, restrooms, canteens, or waiting halls!",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestions = [
    "Where is Platform 3?",
    "Locate the Ticket Counter",
    "Where is the Waiting Hall?",
    "Is there a food canteen?",
    "Where is the restroom?",
    "How do I scan QR Code?",
  ];

  const knowledge = {
    platform: "Platform information can be viewed by selecting the station terminal guide. Typically, Platforms 1-3 are near the main concourse.",
    ticket: "The ticket counters are located near the main entrance/exit lobby on the ground floor.",
    restroom: "Clean restrooms and washrooms are located near the Platform 2 waiting hall and the main exit zone.",
    toilet: "Clean restrooms and washrooms are located near the Platform 2 waiting hall and the main exit zone.",
    waiting: "The air-conditioned and general waiting halls are situated on the first floor above the main entrance hall.",
    canteen: "The food court, IRCTC food plaza, and tea stalls are available beside Platform 3 and near Platform 5.",
    food: "The food court, IRCTC food plaza, and tea stalls are available beside Platform 3 and near Platform 5.",
    qr: "Scan the QR code printed at the entrance or platforms to launch the direct interactive indoor map.",
    navigation: "RailNav provides smart indoor pathfinding. Just search for a station and click 'Explore Terminal Maps'.",
    parking: "Vehicular parking is available outside the east terminal gate.",
    exit: "The main exit terminal gates are located opposite the booking and ticketing counters.",
    wifi: "Free RailWire high-speed WiFi is available inside the station. Connect and register with your phone number.",
    complaint: "You can file complaints directly using the Complaint Form in the footer section of our portal.",
  };

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Process reply
    setTimeout(() => {
      let replyText = "I'm sorry, I couldn't find details on that specific topic. Try asking about platforms, ticket counters, restrooms, food canteens, or QR navigation.";
      const query = textToSend.toLowerCase();

      // Simple keyword matching
      for (const key in knowledge) {
        if (query.includes(key)) {
          replyText = knowledge[key];
          break;
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);
      setTyping(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <section className="bg-slate-50 py-16 px-6 lg:px-8 relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-0 h-[400px] w-[400px] rounded-full bg-blue-50/70 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-cyan-50/70 blur-3xl -z-10"></div>

      <div className="mx-auto max-w-7xl">
        {/* Title Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 mb-3"
          >
            <Sparkles size={13} className="text-blue-500 animate-pulse" />
            AI Helpdesk
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            RailNav AI Assistant
          </h1>
          <p className="mt-3 text-slate-500 max-w-md mx-auto font-medium">
            Get instant guidance about station layouts, facilities, platform routes, and exit paths.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-10 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          {/* Left Column - Instructions & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Compass className="text-blue-600" size={20} />
                Smart Assistant Features
              </h3>

              <ul className="space-y-3.5 text-sm font-semibold text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CornerDownRight size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Interactive indoor mapping responses</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CornerDownRight size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Real-time terminal directory database</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CornerDownRight size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Instant facility queries matching</span>
                </li>
              </ul>
            </motion.div>

            {/* Quick Suggestions Cards */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
            >
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-slate-400" />
                Frequently Asked
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sugg, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(sugg)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:text-blue-600 text-slate-650 transition-colors text-left cursor-pointer"
                  >
                    {sugg}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Premium Chat Interface */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 rounded-[2rem] bg-white border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[550px]"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-2xl p-2 text-white border border-white/10">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-none">RailNav Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Circle size={8} fill="#10B981" className="text-emerald-400 border-none animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-none">Online</span>
                  </div>
                </div>
              </div>
              <TrainFront className="text-white/20" size={32} />
            </div>

            {/* Chat Message Window Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Bot size={15} />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4.5 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10"
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                      } whitespace-pre-line`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-650 shrink-0">
                        <User size={15} />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Bot Typing Bubble State */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 justify-start"
                  >
                    <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Bot size={15} />
                    </div>
                    <div className="bg-white border border-slate-100 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce delay-150"></span>
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce delay-300"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef}></div>
            </div>

            {/* Input Send Area */}
            <div className="bg-white border-t border-slate-100 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  placeholder="Ask anything about the station facilities..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none placeholder-slate-400 focus:bg-white focus:border-blue-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="rounded-2xl bg-blue-600 p-3.5 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChatBot;