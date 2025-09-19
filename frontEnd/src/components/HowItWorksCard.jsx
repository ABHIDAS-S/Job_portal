import { motion } from "framer-motion";
import { BriefcaseBusiness, Scale, Zap } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Dual Expertise",
    description:
      "Agency & In-house - We've been on both sides of the hiring table, so we know how to find the perfect fit for your company.",
    icon: BriefcaseBusiness,
    color: "pink",
  },
  {
    id: 2,
    title: "Fully Transparent",
    description:
      "Clean and clear. This is what you can expect from us and how it should always be.",
    icon: Scale,
    color: "blue",
  },
  {
    id: 3,
    title: "Lightning Speed",
    description: "Speed wins in the talent market. Don't worry; we get things done fast.",
    icon: Zap,
    color: "yellow",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

function HowItWorksCard() {
  return (
    <div className="flex flex-col items-center  gap-10 sm:gap-20 py-16  ">
      <motion.header 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0  }}
        viewport={{ margin: "50px", amount: 0.4 }}
        transition={{ duration: 0.6 ,}}
        className="flex flex-col items-center sm:gap-4 text-center"
      >
        <h2 className="text-2xl  md:text-3xl font-bold caveat">
          Why <span className="text-blue-500 caveat">Hiregrade</span>?
        </h2>
        <h3 className="text-2xl  md:text-4xl font-bold mt-1">
          This Is How We Get Things Done
        </h3>
        <p className="    text-sm  sm:text-lg  md:text-xl text-gray-500">
          We partner with innovative companies, offering a fresh approach to
          hiring and team building. It's what we do best.
        </p>
      </motion.header>

      <motion.div 
        className="flex flex-wrap justify-center gap-8 px-10 md:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "0px", amount: 0.2 }}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="w-[360px] bg-gray-900 shadow-lg p-8 space-y-4 relative overflow-hidden cursor-pointer 
                       transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div 
              className={`w-24 h-24 bg-[#00b4d8] rounded-full absolute -right-5 -top-7 shadow-lg`}
          
            >
              <p className="absolute bottom-6 left-7 text-white text-2xl">
                {String(step.id).padStart(2, '0')}
              </p>
            </div>
            <motion.div 
              className="text-violet-500"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ amount: 0.8 }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <step.icon size={48} />
            </motion.div>
            <motion.h3 
              className="font-bold text-xl"
              whileHover={{ 
                color: "#00b4d8",
                transition: { duration: 0.2 }
              }}
            >
              {step.title}
            </motion.h3>
            <p className="text-sm text-zinc-500 leading-6">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default HowItWorksCard;