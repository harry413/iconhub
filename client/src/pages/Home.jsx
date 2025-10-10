import React from "react"
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext';
import { hoverSound, clickSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';
import { IoDiamond } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import { FaFileArchive, FaIcons } from "react-icons/fa";
import { GiCircleSparks } from "react-icons/gi";
import CircularOrbit from "../components/CircularOrbit"


const Home = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: 'Thousands of Icons',
      description: 'Access our vast collection of high-quality icons for all your projects.',
      icon: <FaIcons/>
    },
    {
      title: 'Multiple Formats',
      description: 'Download icons in SVG, PNG formats to fit your needs.',
      icon: <FaFileArchive/>
    },
    {
      title: 'Easy to Use',
      description: 'Simple interface to browse, search and download icons quickly.',
      icon: <GiCircleSparks/>
    },
    {
      title: 'Free & Premium',
      description: 'Choose from our free collection or upgrade for premium icons.',
      icon: <IoDiamond />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24 ">
      <section className="flex px-6 flex-col md:flex-row items-center justify-center gap-12 w-full">
       <div className="flex flex-col items-start justify-center text-center md:text-left md:w-1/2">
         <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Beautiful Icons for{" "}
          <span className="text-neutral-700 dark:text-neutral-500 underline hover:text-neutral-500">
            Your Projects
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8  mx-auto"
        >
          Discover thousands of free icons in various styles and formats.
          Perfect for designers, developers, and creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center md:gap-8 gap-2"
        >
          
          <Link to="/icons" onClick={() => clickSound.play()}>
            <input
            type="text"
            placeholder="Search icons..."
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          </Link>
          <div className='px-4 py-2 flex items-center justify-center border-2 rounded-md border-gray-400 gap-2'>
             <h5 className='text-black-800 font-bold'>npm i @harry413/icons </h5>
             <FiCopy className='flex items-center'/>
           </div>
        </motion.div>
       </div>
       <motion.div className="flex items-start justify-center md:w-1/2"
        initial={{ opacity: 0, y: -50, x: -50, scale: 0.5, z:-50 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1.0 , z:0 }}
        transition={{ delay: 0.2, duration: Infinity, type: "spring", stiffness: 50, damping: 20 }}
        onMouseEnter={() => hoverSound.play()}
       >
        {theme === "dark" ? (
          <img
          src="/hero.png"
          alt="Hero"
          className="mx-auto mt-12 w-full max-w-lg rounded-lg"
        />):(
          <img
          src="/hero1.png"
          alt="Hero"
          className="mx-auto mt-12 w-full max-w-lg rounded-lg"
        />
        )}
       </motion.div>
      </section>

      <section className='w-full py-20 px-8'>
        <CircularOrbit />
      </section>

      <section className="mb-16 mt-28">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Why Choose HarryIconify?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onMouseEnter={() => hoverSound.play()}
              className={`p-6 rounded-xl backdrop-blur-xs  ${
                theme === "dark"
                  ? " bg-transparent outline border-2 shadow-md shadow-gray-400 "
                  : "bg-gradient-to-r from-[#abbaab] to-[#ffffff] shadow-xl shadow-gray-900"
              }`}
            >
              <div className="text-4xl mb-4 animate-pulse">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-900 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`p-8 rounded-xl backdrop-blur-xs ${
            theme === "dark"
              ? "bg-gradient-to-r from-slate-800 to-[#1f1c18] "
              : "bg-gradient-to-r from-[#abbaab] to-[#ffffff] "
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands of designers and developers using HarryIconify for their
            projects.
          </p>
          <Link to="/icons" onClick={() => clickSound.play()}>
            <Button className="w-1/2 cursor-pointer px-8 py-3">
              Explore Icons Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
