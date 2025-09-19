import { Check } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const cardContents = [
  {
    number: "01",
    title: "Job Seekers",
    description:
      "Discover the ideal job that aligns with your skills, passions, and career goals, helping you unlock your full potential.",
    color: "red",
    heading: "Unlock a World of Opportunities",
    paragraph:
      "Our platform is here to connect you with a wide range of job openings, making your job search smoother and more efficient.",
    features: [
      "Personalized Job Matches",
      "One-Click Applications",
      "Application Status Tracking",
      "Resume Assistance",
    ],
  },
  {
    number: "02",
    title: "Recruiters",
    description:
      "Find the perfect candidates for your organization. Streamline your hiring process and connect with top talent efficiently.",
    color: "red",
    heading: "Efficient Talent Acquisition",
    paragraph:
      "Our platform empowers recruiters with powerful tools to streamline the hiring process.",
    features: [
      "AI-Powered Candidate Matching",
      "Applicant Tracking System",
      "Custom Screening Questions",
      "Analytics Dashboard",
    ],
  },
];

// Animation variants for coordinated animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function UserTypeCards() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const card1Opacity = useTransform(scrollYProgress,  [0.1, 0.5], [1, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);

  const card1Y = useTransform(scrollYProgress, [0.1, 0.5], [0, -50]);
  const card2Y = useTransform(scrollYProgress, [0.5, 0.9], [50, 0]);

  return (
    <div ref={containerRef} className="relative">
      <div className="h-[600vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            className="container flex h-screen w-full items-center gap-7"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.8 }}
          >
            <motion.div className="card w-1/3" variants={cardVariants}>
              <div className="box h-full">
                {cardContents.map((content, index) => (
                  <motion.div
                    key={index}
                    className="content absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: index === 0 ? card1Opacity : card2Opacity,
                      // y: index === 0 ? card1Y : card2Y,
                    }}
                  >
                    <motion.h2
                      variants={contentVariants}
                      className="text-1xl font-bold mb-4"
                    >
                      {content.number}
                    </motion.h2>
                    <motion.h3
                      variants={contentVariants}
                      className="text-2xl font-bold mb-3"
                    >
                      {content.title}
                    </motion.h3>
                    <motion.p variants={contentVariants} className="mb-6 text-gray-400">
                      {content.description}
                    </motion.p>
                    <motion.a
                      variants={contentVariants}
                      href="#"
                      className="inline-block bg-red-500 text-white px-6 py-2 rounded-full"
                    >
                      Read More
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="relative w-2/3" variants={cardVariants}>
              {cardContents.map((content, index) => (
                <motion.div
                  key={index}
                  style={{
                    opacity: index === 0 ? card1Opacity : card2Opacity,
                    y: index === 0 ? card1Y : card2Y,
                  }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <motion.h2
                    variants={contentVariants}
                    className="font-bold text-2xl text-violet-500"
                  >
                    {content.heading}
                  </motion.h2>
                  <motion.p variants={contentVariants} className="text-gray-400 mt-3">
                    {content.paragraph}
                  </motion.p>
                  <motion.div className="font-semibold">
                    <div className="flex justify-between mt-6">
                      <ul className="text-gray-400 flex flex-col gap-5 w-1/2">
                        {content.features.slice(0, 2).map((feature, i) => (
                          <motion.li
                            key={i}
                            variants={featureVariants}
                            className="flex gap-2 items-center"
                          >
                            <Check className={`text-${content.color}-500`} />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <ul className="text-gray-400 flex flex-col gap-5 w-1/2">
                        {content.features.slice(2, 4).map((feature, i) => (
                          <motion.li
                            key={i}
                            variants={featureVariants}
                            className="flex gap-2 items-center"
                          >
                            <Check className={`text-${content.color}-500`} />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserTypeCards;


makt this responsive like card in the top and contetn in the bottom in small screens 