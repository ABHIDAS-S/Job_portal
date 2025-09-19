/* eslint-disable react/no-unknown-property */
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";

import Globe from "@/components/Globe";
import UserTypeCards from "@/components/UserTypeCards";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import HowItWorksCard from "@/components/HowItWorksCard";
import Review from "@/components/Reviews";

import Faq from "@/components/Faq";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const LandingPage = () => {
  const carouselRef = useRef(null);
  const buttonRef = useRef(null);
  const isInView = useInView(buttonRef);
  const { user } = useUser();
  const navigate = useNavigate();

  const carouselInView = useInView(carouselRef);

  const handleNavigate = (to) => {
    if (user && user.unsafeMetadata?.role) {
      if (to === "/postJob") {
        if (user.unsafeMetadata?.role === "recruiter") {
          navigate("/postJob");
        } else {
          toast({
            title: "You are not a recruiter",
            description: "You can't post a job",
          });
        }
      } else {
        navigate("/jobs");
      }
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <main className="flex flex-col gap-10 sm:gap-12 py-20 sm:py-14 ">
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url()`,
        }}
        className="relative pb-10 sm:pb-24 "
      >
        {/* SVG Background */}
        <div
          className="absolute left-0 right-0 ml-[50%] transform -translate-x-1/2 overflow-hidden flex justify-center items-center"
          style={{ width: "calc(100vw - 1.1rem)" }}
        >
          <Globe />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center mt-10">
          <motion.h1
            className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tighter py-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Your Dream Job
            <span className="flex items-center gap-2 sm:gap-6">
              and get Hired
            </span>
          </motion.h1>
          <motion.p
            className="text-gray-300 sm:mt-4 text-md sm:text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore thousands of job listings or find the perfect candidate
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          ref={buttonRef}
          className="relative z-10 flex gap-6 justify-center mt-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div
              onClick={() => {
                handleNavigate("/jobs");
              }}
            >
              <Button
                variant="blue"
                size="responsive"
                className="rounded-full  text-lg  "
              >
                Find Jobs
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            <div
              onClick={() => {
                handleNavigate("/postJob");
              }}
            >
              <Button
                variant="destructive"
                size="responsive"
                className="rounded-full text-lg "
              >
                Post a Job
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.div
        ref={carouselRef}
        initial={{ opacity: 0, y: 50 }}
        animate={carouselInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full sm:py-10"
        >
          <CarouselContent className="flex gap-5 sm:gap-20 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>

      <section className="px-4 h-screen mt-10">
        <HowItWorksCard />
      </section>

      <section className="px-10">
        <UserTypeCards />
      </section>

      <section className="px-4  md:mt-40 lg:mt-0  ">
        <Review />
      </section>

      <section className="px-4 mb-10 ">
        <Faq />
      </section>
    </main>
  );
};

export default LandingPage;
