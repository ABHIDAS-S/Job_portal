import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

function GetInTouch() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10px" }); // Trigger animation when it's in view

  return (
    <div className="w-full flex items-center justify-center md:h-screen py-14 bg-gray-700 px-10  overflow-x-hidden">
      <div className="md:w-2/3 w-full text-white flex flex-col">
        <motion.div
          ref={ref}
          className="w-full text-4xl md:text-7xl font-bold" // Decreased text size for small screens
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h1 className="w-full md:w-2/3 leading-tight break-words"> {/* Added break-words for long text */}
            How can we help you. Get in touch
          </h1>
        </motion.div>
        <motion.div
          className="flex mt-8 flex-col md:flex-row md:justify-between"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="w-full md:w-2/3 text-gray-400">
            Have questions or need assistance? We're here to help! Our dedicated
            support team is ready to assist you with any inquiries about our job
            portal.
          </p>
          <motion.div
            className="w-full md:w-44 pt-6 md:pt-0" // Full width for small screens
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isInView ? { scale: [1, 1.05, 1] } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Link to={"/contact"} className="bg-red-500 justify-center text-center rounded-lg shadow px-10 py-3 flex items-center mx-auto">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default GetInTouch;
