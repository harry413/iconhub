import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={footerVariants}
      className="bg-gradient-to-r  dark:from-slate-900 dark:to-slate-500 from-gray-300 to-gray-200 text-gray-600 dark-text-gray-200 py-12 px-4 bottom-0 left-0 right-0"
    >
      <div className="container mx-auto ">
          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
            <img src="/hilogo.png" alt="logo" className=" h-16 w-12 md:h-30 md:w-24 text-center"/>
            
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-200">
              HarryIconify
            </h2>
          </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-8">

          {/* Applications Section */}
          <motion.div variants={itemVariants} className="gap-8">
            <h3 className="text-lg font-semibold mb-4 uppercase text-black dark:text-gray-200">
              Applications
            </h3>
            <ul className="space-y-4">
              {[
                "Authors",
                "Icons",
                "Animated icons",
                "Icon tags",
              ].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-500 dark:text-gray-300 transition-colors text-sm dark:hover:text-gray-200"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-4 uppercase text-black dark:text-gray-200">
              Company
            </h3>
            <ul className="space-y-4">
              {[
                "Who We Are",
                "Global Competency",
                "Our License",
                "Blog",
                "Whats new"
              ].map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-400 dark:text-gray-300 transition-colors text-sm dark:hover:text-gray-200"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* More Section */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase text-black dark:text-gray-200">
                More
              </h3>
              <ul className="space-y-4">
                {["Contact Us", "Careers"].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href="#"
                      className="hover:text-gray-400 dark:text-gray-300 transition-colors text-sm dark:hover:text-gray-200"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

          </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-4 uppercase text-black dark:text-gray-200">
                Follow Us
              </h3>
              <ul className="space-y-4">
                {["LinkedIn", "Github", "Twitter"].map((item) => (
                  <motion.li
                    key={item}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href="#"
                      className="hover:text-gray-400 dark:text-gray-300 transition-colors text-sm dark:hover:text-gray-200"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 my-6 dark:border-gray-200"
        />

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0 text-gray-700 text-sm dark:text-gray-200">
            ©2024. All Rights Reserved.
          </div>
          <div className="text-gray-700 text-center text-sm md:text-right dark:text-gray-200">
            Apollo Tower, 110, Vijay Nagar, Indore - 450001.
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;