import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { hoverSound, clickSound } from '../utils/Sounds';
import { Button } from '../components/ui/button';

const Home = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: 'Thousands of Icons',
      description: 'Access our vast collection of high-quality icons for all your projects.',
      icon: '🖼️'
    },
    {
      title: 'Multiple Formats',
      description: 'Download icons in SVG, PNG formats to fit your needs.',
      icon: '📁'
    },
    {
      title: 'Easy to Use',
      description: 'Simple interface to browse, search and download icons quickly.',
      icon: '✨'
    },
    {
      title: 'Free & Premium',
      description: 'Choose from our free collection or upgrade for premium icons.',
      icon: '💎'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24 ">
      <section className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Beautiful Icons for{" "}
          <span className="text-neutral-700 dark:text-neutral-500">Your Projects</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8 max-w-2xl mx-auto"
        >
          Discover thousands of free icons in various styles and formats.
          Perfect for designers, developers, and creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <Link to="/icons" onClick={() => clickSound.play()}>
            <Button className="px-4 py-2 cursor-pointer">Browse Icons</Button>
          </Link>
          <Link to="/upload" onClick={() => clickSound.play()} >
            <Button variant="outline" className="px-4 py-2  cursor-pointer ">
              Upload Icons
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="mb-16 mt-28">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Why Choose IconHub?
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
              className={`p-6 rounded-xl backdrop-blur-xs ${
                theme === "dark"
                  ? " bg-transparent outline border-2 "
                  : "bg-gradient-to-r from-[#abbaab] to-[#ffffff]"
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
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
            Join thousands of designers and developers using IconHub for their
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