import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const cardContents = [
  {
    number: "01",
    title: "Job Seekers",
    description:
      "Discover the ideal job that aligns with your skills, passions, and career goals, helping you unlock your full potential.",
    color: "blue",
    heading: "Unlock a World of Opportunities",
    paragraph:
      "Our platform is here to connect you with a wide range of job openings, making your job search smoother and more efficient.",
    // features: [
    //   "Personalized Job Matches",
    //   "One-Click Applications",
    //   "Application Status Tracking",
    //   "Resume Assistance",
    // ],
  },
  {
    number: "02",
    title: "Recruiters",
    description:
      "Find the perfect candidates for your organization. Streamline your hiring process and connect with top talent efficiently.",
    color: "blue",
    heading: "Efficient Talent Acquisition",
    paragraph:
      "Our platform empowers recruiters with powerful tools to streamline the hiring process.",
    // features: [
    //   "AI-Powered Candidate Matching",
    //   "Applicant Tracking System",
    //   "Custom Screening Questions",
    //   "Analytics Dashboard",
    // ],
  },
];

function UserTypeCards() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-5 p-4 mt-[10rem] sm:mt-10 "
      ref={containerRef}
    >
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "50px", amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center sm:gap-4 text-center"
      >
        <h2 className="text-3xl  md:text-3xl font-bold caveat">
          For <span className="text-red-500 caveat">Job Seekers </span> &{" "}
          <span className="text-blue-500 caveat">Recruiters </span> 
        </h2>
        <h3 className="text-md text-gray-500  sm:text-lg  md:text-xl font-bold mt-1">
          Connecting talent with opportunities for success
        </h3>
      </motion.header>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ">
        {cardContents.map((content, index) => (
          <motion.div
            key={index}
            className="w-full md:w-1/2 max-w-md "
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="card h-full cursor-pointer hover:scale-105">
              <div className="box h-full relative">
                <div
                  className={`content absolute flex flex-col justify-center p-1 transition-opacity duration-300`}
                >
                  <h2 className="text-xl font-bold mb-4 mt-3">
                    {content.number}
                  </h2>
                  <h3 className="text-2xl font-bold mb-3">{content.title}</h3>
                  <p className="mb-6 text-gray-400">{content.description}</p>
                  <a
                    className={` bg-${content.color}-500  text-white px-6 py-2 rounded-full`}
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default UserTypeCards;
