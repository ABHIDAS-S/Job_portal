import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, PenBox, CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const path = localStorage.getItem("path") || "/";
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams({});
  const [selectedTab, setSelectedTab] = useState(path); // Initialize from localStorage
  const location = useLocation(); // Track location for changes
  const { user } = useUser();

  // Highlight the current tab on page load and URL changes (useful for back/forward button)
  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedTab(currentPath);
    localStorage.setItem("path", currentPath);
  }, [location.pathname]);

  // Handle search params for sign-in
  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
      setSearch({}); // Clear search params after showing sign-in
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false); // Close modal when clicking outside
    }
  };

  const navLinks = [
    { path: "/jobs", label: "Jobs" },
    { path: "/savedJobs", label: "Saved Jobs" },
    { path: "/myJobs", label: "My Jobs" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <nav className="flex items-center justify-between py-2 px-6 border-b mb-10 z-50 w-full">
        <Link 
          onClick={() => setSelectedTab("/")}
          to="/"
        >
          <img src="/hiregrade.png" className="h-10 sm:h-14 md:h-16" alt="Logo" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
          
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} className="hidden md:flex items-center">
                <CircleDot size={15} />
                <Button
                  onClick={() => {
                    setSelectedTab(path); 
                    localStorage.setItem("path", path);
                  }}
                  variant="none"
                  className={`font-extrabold ${selectedTab === path ? "text-blue-500" : ""}`}
                >
                  {label}
                </Button>
              </Link>
            ))}

            
              {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/postJob">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-3" />
                  Post a Job
                </Button>
              </Link>
            )}


            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/savedJobs"
                />
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/myJobs"
                />
                <UserButton.Link
                  label="Contact Us"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/contact"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
