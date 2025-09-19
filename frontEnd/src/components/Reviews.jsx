/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";

function Review() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  const TestimonialCard = ({ href, imgSrc, name, role, text, index }) => {
    const cardRef = useRef(null);
    const isCardInView = useInView(cardRef);
    
    return (
      <motion.li 
        ref={cardRef}
        className="text-sm leading-6"
        initial={{  y: 10 }}
        animate={isCardInView ? { 
         
          y: 0, 
          // transition: { 
          //   duration: 0.5, 
          //   delay: index * 0.1,
          //   ease: [0.215, 0.61, 0.355, 1] 
          // } 
        } : {}}
      >
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 blur"
            initial={{ opacity: 0.2 }}
            animate={isCardInView ? { 
              opacity: 0.25, 
              transition: { delay: (index * 0.1) + 0.3 } 
            } : {}}
            whileHover={{ opacity: 1 }}
          />
          <a href={href} className="cursor-pointer">
            <div className="relative p-6 space-y-6 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5">
              <div className="flex items-center space-x-4">
                <motion.img
                  src={imgSrc}
                  className="w-12 h-12 bg-center bg-cover border rounded-full"
                  alt={name}
                  initial={{ scale: 0 }}
                  animate={isCardInView ? { 
                    scale: 1, 
                    transition: { 
                      delay: (index * 0.1) + 0.2,
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    } 
                  } : {}}
                />
                <div>
                  <motion.h3 
                    className="text-lg font-semibold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isCardInView ? { 
                      opacity: 1, 
                      x: 0, 
                      transition: { delay: (index * 0.1) + 0.3 } 
                    } : {}}
                  >
                    {name}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-500 text-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isCardInView ? { 
                      opacity: 1, 
                      x: 0, 
                      transition: { delay: (index * 0.1) + 0.4 } 
                    } : {}}
                  >
                    {role}
                  </motion.p>
                </div>
              </div>
              <motion.p 
                className="leading-normal text-gray-300 text-md"
                initial={{ opacity: 0 }}
                animate={isCardInView ? { 
                  opacity: 1, 
                  transition: { delay: (index * 0.1) + 0.5 } 
                } : {}}
              >
                {text}
              </motion.p>
            </div>
          </a>
        </motion.div>
      </motion.li>
    );
  };

  const testimonials = {
    column1: [
      {
        imgSrc: "https://hips.hearstapps.com/hmg-prod/images/kanye-west-attends-the-christian-dior-show-as-part-of-the-paris-fashion-week-womenswear-fall-winter-2015-2016-on-march-6-2015-in-paris-france-photo-by-dominique-charriau-wireimage-square.jpg",
        name: "Kanye West",
        role: "Rapper & Entrepreneur",
        text: "This platform helped me connect with incredible talent for my ventures. It's a game-changer!"
      },
      {
        imgSrc: "https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg",
        name: "Tim Cook",
        role: "CEO of Apple",
        text: "An invaluable resource for finding the right candidates. Our recruitment process has become much more efficient."
      },
      {
        imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNAkA7PCIHmy5VsO3K60rs-8huIfEI5MvNYg&s",
        name: "Parag Agrawal",
        role: "CEO of Twitter",
        text: "This portal has simplified our hiring process, making it easier to find the talent we need to drive our projects forward."
      },
      {
        imgSrc: "https://m.media-amazon.com/images/S/amzn-author-media-prod/scu4qti103e8rupc57dl2f2j96.jpg",
        name: "Oprah Winfrey",
        role: "Media Executive & Philanthropist",
        text: "I’ve seen so many talented individuals find their paths through this platform. It’s inspiring!"
      }
    ],
    column2: [
      {
        imgSrc: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg",
        name: "Elon Musk",
        role: "CEO of SpaceX and Tesla",
        text: "An excellent platform for job seekers and recruiters alike. Highly effective!"
      },
      {
        imgSrc: "https://imageio.forbes.com/specials-images/imageserve/5f7794e2f96d8cf1ef36a5e7/0x0.jpg?format=jpg&crop=1262,1262,x168,y132,safe&height=416&width=416&fit=bounds",
        name: "Sheryl Sandberg",
        role: "Former COO of Facebook",
        text: "This site has been a game-changer for our recruitment process. Highly recommended!"
      },
      {
        imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVOV6OXoWF_hSJSOHw2LuIYaIDsWQFn72yiA&s",
        name: "Richard Branson",
        role: "Founder of Virgin Group",
        text: "The job portal connects innovative thinkers with groundbreaking companies. A true asset!"
      },
      {
        imgSrc: "https://media.licdn.com/dms/image/D4E03AQFrmDuWUxQoMg/profile-displayphoto-shrink_200_200/0/1715645354619?e=2147483647&v=beta&t=_WBVcQpyigwPLI-efv18uQQ3eV_hhzU5DcUlIHl77HA",
        name: "Sundar Pichai",
        role: "CEO of Google",
        text: "An outstanding platform for matching talent with opportunities. Highly recommend it!"
      }
    ],
    column3: [
      {
        imgSrc: "https://pbs.twimg.com/profile_images/1221837516816306177/_Ld4un5A_400x400.jpg",
        name: "Satya Nadella",
        role: "CEO of Microsoft",
        text: "The job portal is intuitive and effective. It has streamlined our recruitment efforts significantly."
      },
      {
        imgSrc: "https://pbs.twimg.com/profile_images/516916920482672641/3jCeLgFb_400x400.jpeg",
        name: "Dan Schulman",
        role: "CEO of PayPal",
        text: "Our experience using this job portal has been fantastic. It connects us with candidates who are a great fit for our culture."
      },
      {
        imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3uykDmUmSO0tEXiBRIyu51cvgmTXqEvqqbg&s",
        name: "Angela Merkel",
        role: "Former Chancellor of Germany",
        text: "This platform has opened doors to exceptional talent that we wouldn't have found otherwise."
      },
      {
        imgSrc: "https://thedecisionlab.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fthedecisionlab%2Fcc70a04a-f6a5-40fd-9799-4a61b89e51bc_barack-obama.png%3Fauto%3Dformat%2Ccompress&w=3840&q=75",
        name: "Barack Obama",
        role: "Former President of the USA",
        text: "I appreciate how this site brings together individuals from diverse backgrounds. It’s a step towards a better future."
      }
    ]
  };
  

  return (
    <motion.section 
      ref={sectionRef}
      id="testimonies" 
      className="py-20 flex justify-center"
    >
      <div className="max-w-6xl  flex flex-col items-center">
        <motion.div 
          className="mb-12 space-y-1 md:mb-16 md:text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0, 
            transition: { 
              duration: 0.6, 
              ease: "easeOut" 
            } 
          } : {}}
        >
          <motion.div 
            className="caveat px-3  text-xl font-semibold text-violet-500  rounded-lg text-center   bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Words from Others
          </motion.div>
          <h1 className="mb-5 caveat text-3xl font-semibold text-white text-center   md:text-5xl">
            It's not just us.
          </h1>
          <p className="   text-md  text-gray-500 text-center md:text-2xl flex-nowrap">
            Here's what others have to say about us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <ul className="space-y-8">
            {testimonials.column1.map((testimonial, index) => (
              <TestimonialCard key={`col1-${index}`} {...testimonial} index={index} />
            ))}
          </ul>

          <ul className="hidden space-y-8 sm:block">
            {testimonials.column2.map((testimonial, index) => (
              <TestimonialCard key={`col2-${index}`} {...testimonial} index={index} />
            ))}
          </ul>

          <ul className="hidden space-y-8 lg:block">
            {testimonials.column3.map((testimonial, index) => (
              <TestimonialCard key={`col3-${index}`} {...testimonial} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

export default Review;