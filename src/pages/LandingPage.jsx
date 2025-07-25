// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../components/threejs/ParticleBackground.jsx'; // Our existing background
import { MdMenu, MdClose, MdNotes, MdLightbulb, MdAccountTree, MdQuiz } from 'react-icons/md'; // Icons for features and hamburger

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(0,240,255)" },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  const featureCards = [
    {
      icon: <MdNotes className="text-5xl text-electric mb-4" />,
      title: "Smart Notes",
      description: "Capture, organize, and retrieve your thoughts effortlessly. Tag, link, and structure your knowledge.",
    },
    {
      icon: <MdLightbulb className="text-5xl text-electric mb-4" />,
      title: "AI Flashcards",
      description: "Automatically generate powerful flashcards from your notes to master concepts through active recall.",
    },
    {
      icon: <MdAccountTree className="text-5xl text-electric mb-4" />,
      title: "Knowledge Map",
      description: "Visualize connections between your ideas. See how different topics interlink and build a holistic understanding.",
    },
    {
      icon: <MdQuiz className="text-5xl text-electric mb-4" />,
      title: "Interactive Quizzes",
      description: "Test your understanding with quizzes generated from your flashcards. Identify strengths and areas for improvement.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-midnight text-text-light overflow-hidden">
      <ParticleBackground /> {/* Futuristic particle background */}

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-midnight-900 bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8 lg:hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <button onClick={toggleMobileMenu} className="absolute top-6 right-6 text-electric text-4xl">
              <MdClose />
            </button>
            <Link to="/login" className="text-electric text-3xl font-bold hover:text-electric-light transition-colors" onClick={toggleMobileMenu}>Login</Link>
            <Link to="/register" className="text-electric text-3xl font-bold hover:text-electric-light transition-colors" onClick={toggleMobileMenu}>Register</Link>
            {/* You can add more links here if needed */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col">
        {/* Navbar */}
        <nav className="p-6 flex items-center justify-between">
          <Link to="/" className="text-4xl font-bold text-electric">MindVault</Link>
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/login" className="text-text-light text-lg font-medium hover:text-electric transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-3 rounded-full bg-electric text-midnight font-bold hover:bg-electric-light transition-colors shadow-lg">Register</Link>
          </div>
          <button onClick={toggleMobileMenu} className="text-electric text-4xl lg:hidden">
            <MdMenu />
          </button>
        </nav>

        {/* Hero Section */}
        <motion.section
          className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[calc(100vh-80px)]" // Adjusted height
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-5xl md:text-7xl font-extrabold text-electric mb-6 leading-tight" variants={itemVariants}>
            Unlock Your Mind's Potential
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-text-light max-w-3xl mb-10" variants={itemVariants}>
            MindVault is your personal knowledge hub, powered by intelligent tools to help you learn, organize, and master any subject.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <Link to="/register">
              <motion.button
                className="px-8 py-4 rounded-full bg-electric text-midnight text-lg font-bold shadow-lg hover:shadow-electric-glow transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="px-8 py-4 rounded-full border-2 border-electric text-electric text-lg font-bold hover:bg-electric hover:text-midnight transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Already a Member?
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-midnight-900">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-electric mb-16"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            What MindVault Offers
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-midnight-800 p-8 rounded-lg shadow-xl border border-steel-dark text-center flex flex-col items-center hover:border-electric transition-all duration-300"
                variants={itemVariants}
              >
                {card.icon}
                <h3 className="text-2xl font-semibold text-text-light mb-3">{card.title}</h3>
                <p className="text-text-dark">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-electric mb-16"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="max-w-4xl mx-auto space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="flex flex-col md:flex-row items-center bg-midnight-800 p-6 rounded-lg shadow-md border border-steel-dark" variants={itemVariants}>
              <span className="text-5xl text-violet-glow mb-4 md:mb-0 md:mr-6">1.</span>
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-text-light mb-2">Capture Your Knowledge</h3>
                <p className="text-text-dark">Easily create notes with rich descriptions, tags, and related topics. Your ideas, organized.</p>
              </div>
            </motion.div>
            <motion.div className="flex flex-col md:flex-row items-center bg-midnight-800 p-6 rounded-lg shadow-md border border-steel-dark" variants={itemVariants}>
              <span className="text-5xl text-violet-glow mb-4 md:mb-0 md:mr-6">2.</span>
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-text-light mb-2">Transform & Connect</h3>
                <p className="text-text-dark">MindVault's intelligent system generates flashcards and visualizes connections, turning raw notes into actionable insights.</p>
              </div>
            </motion.div>
            <motion.div className="flex flex-col md:flex-row items-center bg-midnight-800 p-6 rounded-lg shadow-md border border-steel-dark" variants={itemVariants}>
              <span className="text-5xl text-violet-glow mb-4 md:mb-0 md:mr-6">3.</span>
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-text-light mb-2">Master & Retain</h3>
                <p className="text-text-dark">Utilize interactive quizzes and your personalized knowledge map to reinforce learning and achieve mastery.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Call to Action at bottom */}
        <section className="py-20 px-4 text-center bg-midnight-900">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-electric mb-8"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Revolutionize Your Learning?
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/register">
              <motion.button
                className="px-8 py-4 rounded-full bg-electric text-midnight text-lg font-bold shadow-lg hover:shadow-electric-glow transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Sign Up Now
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="px-8 py-4 rounded-full border-2 border-electric text-electric text-lg font-bold hover:bg-electric hover:text-midnight transition-all duration-300"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Log In
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-text-dark text-sm bg-midnight-900 border-t border-steel-dark">
          &copy; {new Date().getFullYear()} MindVault. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
