import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, ChevronDown, Code2, Zap, BookOpen, Terminal, Package, Download } from 'lucide-react'

const Docs = () => {
  const [copiedCode, setCopiedCode] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-2 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
        >
          {copiedCode === id ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>
      <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )

  const StepCard = ({ number, title, children, isExpanded, onClick }) => {
  return (
    <motion.div
      className="border-l-4 border-gray-500/30 bg-white/50 dark:bg-gray-800/30 rounded-xl shadow-lg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      variants={itemVariants}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center justify-center w-10 h-10 bg-gray-500/20 text-gray-700 dark:text-white rounded-full font-bold text-lg"
            whileHover={{ scale: 1.1 }}
          >
            {number}
          </motion.div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-400" size={24} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
  const FeatureBox = ({ icon: Icon, title, description }) => (
    <motion.div
      className="bg-white/50 dark:bg-gray-800/30 rounded-xl shadow-lg rounded-lg text-[#2f4f4f] dark:text-[#d3d3d3] p-6 rounded-lg border border-[#2f4f4f]/20 dark:border-gray-600 shadow-md"
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-gray-600 dark:text-gray-400">
          <Icon size={24} />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </motion.div>
  )

  return (
    <div className="min-h-screen  py-8 md:py-16 px-4 md:px-8">
      {/* Hero Section */}
      <motion.div
        className="max-w-4xl mx-auto mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Package className="w-16 h-16 text-[#2f4f4f] dark:text-[#d3d3d3] mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold  text-[#2f4f4f] dark:text-[#d3d3d3] mb-4">
            Installation Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Learn how to install and use the <code className="font-bold text-[#2f4f4f] dark:text-[#d3d3d3] underline">@harry413/icons</code> package in your application
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          variants={containerVariants}
        >
          <FeatureBox
            icon={Zap}
            title="Lightning Fast"
            description="Optimized icon package for maximum performance"
          />
          <FeatureBox
            icon={Code2}
            title="Easy to Use"
            description="Simple API and comprehensive documentation"
          />
          <FeatureBox
            icon={BookOpen}
            title="Well Documented"
            description="Detailed examples and best practices"
          />
        </motion.div>
      </motion.div>

      {/* Installation Steps */}
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Installation Steps
          </h2>

          <motion.div className="space-y-4" variants={containerVariants}>
            {/* Step 1 */}
            <StepCard
              number={1}
              title="Install the Package"
              isExpanded={expandedSection === 0}
              onClick={() => setExpandedSection(expandedSection === 0 ? null : 0)}
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Open your terminal and run the following command in your project root directory:
                </p>
                <CodeBlock
                  code="npm install @harry413/icons"
                  language="bash"
                  id="step1"
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Alternative:</strong> If you prefer Yarn, use: <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">yarn add @harry413/icons</code>
                  </p>
                </div>
              </div>
            </StepCard>

            {/* Step 2 */}
            <StepCard
              number={2}
              title="Import the Icons"
              isExpanded={expandedSection === 1}
              onClick={() => setExpandedSection(expandedSection === 1 ? null : 1)}
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  In your React component, import the icons you need:
                </p>
                <CodeBlock
                  code={`import { IconName } from '@harry413/icons'\n\n// Example: importing specific icons\nimport { Heart, Search, Settings } from '@harry413/icons'`}
                  language="jsx"
                  id="step2"
                />
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Tip:</strong> You can also import and use icons with different names and apply custom styling.
                  </p>
                </div>
              </div>
            </StepCard>

            {/* Step 3 */}
            <StepCard
              number={3}
              title="Use in Your Component"
              isExpanded={expandedSection === 2}
              onClick={() => setExpandedSection(expandedSection === 2 ? null : 2)}
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Use the imported icons in your JSX:
                </p>
                <CodeBlock
                  code={`import React from 'react'\nimport { Heart, Search } from '@harry413/icons'\n\nconst MyComponent = () => {\n  return (\n    <div className="flex gap-4">\n      <Heart size={24} className="text-red-500" />\n      <Search size={24} className="text-blue-500" />\n    </div>\n  )\n}\n\nexport default MyComponent`}
                  language="jsx"
                  id="step3"
                />
              </div>
            </StepCard>

            {/* Step 4 */}
            <StepCard
              number={4}
              title="Customize with Tailwind & Animation"
              isExpanded={expandedSection === 3}
              onClick={() => setExpandedSection(expandedSection === 3 ? null : 3)}
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Combine with Tailwind CSS and Framer Motion for advanced styling and animations:
                </p>
                <CodeBlock
                  code={`import React from 'react'\nimport { motion } from 'framer-motion'\nimport { Heart, Star, Bell } from '@harry413/icons'\n\nconst AnimatedIcon = () => {\n  return (\n    <motion.div\n      animate={{ rotate: 360 }}\n      transition={{ duration: 2, repeat: Infinity }}\n      className="inline-block"\n    >\n      <Star size={32} className="text-yellow-500" />\n    </motion.div>\n  )\n}\n\nconst HoverIcon = () => {\n  const [isHovered, setIsHovered] = React.useState(false)\n\n  return (\n    <motion.button\n      whileHover={{ scale: 1.2 }}\n      whileTap={{ scale: 0.95 }}\n      onHoverStart={() => setIsHovered(true)}\n      onHoverEnd={() => setIsHovered(false)}\n      className="p-2 rounded-lg hover:bg-red-100 transition-colors"\n    >\n      <motion.div\n        animate={isHovered ? { y: -3 } : { y: 0 }}\n      >\n        <Heart size={24} className="text-red-500" />\n      </motion.div>\n    </motion.button>\n  )\n}\n\nexport { AnimatedIcon, HoverIcon }`}
                  language="jsx"
                  id="step4"
                />
              </div>
            </StepCard>
          </motion.div>
        </div>

        {/* Best Practices Section */}
        <motion.div className="mb-12" variants={containerVariants}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Best Practices
          </h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                Do's
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✓ Import only the icons you need</li>
                <li>✓ Use consistent sizing across your app</li>
                <li>✓ Leverage Tailwind utilities for styling</li>
                <li>✓ Use Framer Motion for smooth animations</li>
                <li>✓ Provide proper accessibility attributes</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-red-500"
              variants={itemVariants}
              whileHover={{ x: 5 }}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <ChevronDown size={20} className="text-red-500" />
                Don'ts
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>✗ Don't import entire icon library at once</li>
                <li>✗ Avoid very large icon sizes unnecessarily</li>
                <li>✗ Don't forget to add alt text for accessibility</li>
                <li>✗ Avoid overusing animations</li>
                <li>✗ Don't use icons without proper contrast</li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Advanced Examples */}
        <motion.div className="mb-12" variants={containerVariants}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Advanced Examples
          </h2>

          <motion.div className="space-y-6">
            {/* Example 1: Icon Button */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">Icon Button Component</h3>
              </div>
              <div className="p-6">
                <CodeBlock
                  code={`import { motion } from 'framer-motion'\nimport { Download, Upload } from '@harry413/icons'\n\nconst IconButton = ({ icon: Icon, label, onClick }) => {\n  return (\n    <motion.button\n      whileHover={{ scale: 1.1, backgroundColor: '#EFF6FF' }}\n      whileTap={{ scale: 0.95 }}\n      onClick={onClick}\n      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 transition-colors duration-200"\n    >\n      <motion.div\n        whileHover={{ rotate: 12 }}\n      >\n        <Icon size={20} />\n      </motion.div>\n      <span>{label}</span>\n    </motion.button>\n  )\n}\n\n// Usage\n<IconButton icon={Download} label="Download" onClick={() => console.log('Download')} />\n<IconButton icon={Upload} label="Upload" onClick={() => console.log('Upload')} />`}
                  language="jsx"
                  id="example1"
                />
              </div>
            </motion.div>

            {/* Example 2: Icon Grid */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">Icon Grid with Hover Effect</h3>
              </div>
              <div className="p-6">
                <CodeBlock
                  code={`import { motion } from 'framer-motion'\nimport { Heart, Star, Zap, TrendingUp } from '@harry413/icons'\n\nconst IconGrid = () => {\n  const icons = [\n    { Icon: Heart, label: 'Heart' },\n    { Icon: Star, label: 'Star' },\n    { Icon: Zap, label: 'Lightning' },\n    { Icon: TrendingUp, label: 'Trending' },\n  ]\n\n  const containerVariants = {\n    hidden: { opacity: 0 },\n    visible: {\n      opacity: 1,\n      transition: { staggerChildren: 0.1 },\n    },\n  }\n\n  const itemVariants = {\n    hidden: { opacity: 0, y: 20 },\n    visible: { opacity: 1, y: 0 },\n  }\n\n  return (\n    <motion.div\n      className="grid grid-cols-2 md:grid-cols-4 gap-4"\n      variants={containerVariants}\n      initial="hidden"\n      animate="visible"\n    >\n      {icons.map((item, idx) => (\n        <motion.div\n          key={idx}\n          className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-lg cursor-pointer"\n          variants={itemVariants}\n          whileHover={{ y: -5, scale: 1.05 }}\n        >\n          <item.Icon size={32} className="text-blue-600 mx-auto mb-2" />\n          <p className="text-center text-sm font-medium text-gray-700">{item.label}</p>\n        </motion.div>\n      ))}\n    </motion.div>\n  )\n}\n\nexport default IconGrid`}
                  language="jsx"
                  id="example2"
                />
              </div>
            </motion.div>

            {/* Example 3: Loading Icon */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
            >
              <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white">Animated Loading Icon</h3>
              </div>
              <div className="p-6">
                <CodeBlock
                  code={`import { motion } from 'framer-motion'\nimport { Loader } from '@harry413/icons'\n\nconst LoadingSpinner = ({ size = 32, color = 'text-blue-600' }) => {\n  return (\n    <motion.div\n      animate={{ rotate: 360 }}\n      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}\n      className="inline-block"\n    >\n      <Loader size={size} className={color} />\n    </motion.div>\n  )\n}\n\n// Usage\n<LoadingSpinner size={32} color="text-blue-600" />`}
                  language="jsx"
                  id="example3"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Troubleshooting */}
        <motion.div variants={containerVariants}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Troubleshooting
          </h2>

          <motion.div className="space-y-4">
            <motion.div
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Icons not showing up?
              </h3>
              <p className="text-sm text-red-700 dark:text-red-200">
                Make sure you've installed the package correctly and restarted your development server. Check that you're importing from the correct package name: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs">@harry413/icons</code>
              </p>
            </motion.div>

            <motion.div
              className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-lg"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Bundle size too large?
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-200">
                Import only the icons you need instead of the entire library. This uses tree-shaking to reduce bundle size. Avoid dynamic imports when possible.
              </p>
            </motion.div>

            <motion.div
              className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg"
              variants={itemVariants}
            >
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                TypeScript support?
              </h3>
              <p className="text-sm text-green-700 dark:text-green-200">
                Yes! The @harry413/icons package includes full TypeScript support. You'll get proper type hints and autocomplete in your IDE.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="max-w-4xl mx-auto mt-16"
        variants={itemVariants}
      >
        <motion.div
          className="bg-white/50 dark:bg-gray-800/30 rounded-xl shadow-lg rounded-lg p-8 text-center text-gray-400 dark:text-white"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-500 mb-6">
            Follow the steps above to install <span className="underline">@harry413/icons</span> and start using beautiful icons in your application.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            whileHover={{ scale: 1.02 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black dark:bg-gray-600 text-gray-200 font-semibold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors"
            >
              View on npm
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-500 dark:border-white dark:text-white text-gray-700 font-semibold py-3 px-8 rounded-lg "
            >
              View Repository
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Docs