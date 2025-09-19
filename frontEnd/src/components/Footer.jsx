/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import React from "react";
import GetInTouch from "./GetInTouch";
import { Link } from "react-router-dom";

const Footer = ({ showGetInTouch = false }) => {
  return (
    <>
      {showGetInTouch && (
        <div>
          <GetInTouch />
        </div>
      )}

      {/* <hr className="border-gray-900 " /> */}
      <footer className={`w-full ${showGetInTouch ? "bg-gray-700" : "bg-gray-900"} p-8`}>
        <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12  text-center md:justify-between">
        <img src="/hiregrade.png" className="h-14" />

          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
            <li>
              <a  className="text-white  text-sm">
                About Us
              </a>
            </li>
            <li>
              <a  className="text-white  text-sm">
                License
              </a>
            </li>
            <li>
              <a  className="text-white  text-sm">
                Contribute
              </a>
            </li>
            <li>
              <Link 
                to="/contact"
                className="text-white  text-sm">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <p className="block mb-4 text-sm text-center text-slate-500 md:mb-0 border-t border-slate-200 mt-4 pt-4">
          Copyright © 2024&nbsp;
          <a
            href="https://material-tailwind.com/"
            target="_blank"
            rel="noreferrer"
          >
           Midhun Mohan
          </a>
          .
        </p>
      </footer>
    </>
  );
};

export default Footer;
