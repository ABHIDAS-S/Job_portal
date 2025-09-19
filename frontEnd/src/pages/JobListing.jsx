import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import Loader from "@/components/Loader";
import CardSkeleton from "@/components/CardSkeleton";
import NotFound from "@/components/NotFound";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [location, setLocation] = useState("");
  const [localJobs, setLocalJobs] = useState([]);
  const [showCardSkeleton, setShowCardSkeleton] = useState(true); // Show skeleton on initial load
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showBottomLoader, setShowBottomLoader] = useState(false);

  const { isLoaded } = useUser();

  const {
    data: jobs,
    loading,
    refreshHook,
    error: jobsError,
  } = useFetch(isLoaded ? "/api/candidate/jobLists" : null, {
    searchQuery,
    company_id,
    location,
    page,
  });

  const {
    data: companies,
    refreshHook: refreshCompanies,
    error: companiesError,
  } = useFetch(isLoaded ? "/api/candidate/getCompanies" : null);

  // Separate the companies API call
  useEffect(() => {
    if (isLoaded) {
      refreshCompanies(); // Only call once when component loads
    }
  }, [isLoaded]);

  // Fetch jobs when filters, searchQuery, company_id, or page changes
  useEffect(() => {
    if (isLoaded) {
      refreshHook();
    }
  }, [isLoaded, searchQuery, company_id, location, page]);

  useEffect(() => {
    if (jobs) {
      if (page === 1) {
        setLocalJobs(jobs); // Replace jobs on the first page
        setShowCardSkeleton(false); // Hide skeleton after the first load
      } else {
        // For subsequent pages, merge new jobs while avoiding duplicates
        setLocalJobs((prevJobs) => {
          const currentJobIds = new Set(prevJobs.map((job) => job._id));
          const filteredJobs = jobs.filter(
            (job) => !currentJobIds.has(job._id)
          );
          return [...prevJobs, ...filteredJobs];
        });
      }
      setHasMore(jobs.length >= 6); // Stop further requests if fewer jobs are returned
    }
  }, [jobs, page]);

  // Handle bottom loader for infinite scrolling
  useEffect(() => {
    let loaderTimeout;
    if (loading && page > 1) {
      setShowBottomLoader(true); // Show bottom loader during scroll-based loading
    }
    if (!loading && showBottomLoader) {
      loaderTimeout = setTimeout(() => {
        setShowBottomLoader(false);
      }, 2000); // Keep the loader for at least 2 seconds
    }
    return () => {
      if (loaderTimeout) clearTimeout(loaderTimeout);
    };
  }, [loading, page]);

  // Utility function to debounce scrolling
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (loading || !hasMore) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        setPage((prevPage) => prevPage + 1); // Load more jobs on scroll
      }
    }, 300),
    [loading, hasMore]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const updateJobSavedStatus = (jobId, savedStatus) => {
    setLocalJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, saved: savedStatus } : job
      )
    );
  };

  const handleSearch = (e) => {
    setShowCardSkeleton(true);
    e.preventDefault();
    setSearchQuery(e.target["search-query"].value);
    setPage(1); // Reset page to 1 on search
    setLocalJobs([]); // Clear current jobs when new search starts
  };

  const clearFilters = () => {
    if (!company_id && !location && !searchQuery) {
      return;
    } else {
      setShowCardSkeleton(true);
      setSearchQuery("");
      setCompany_id("");
      setLocation("");
      setPage(1);
      setLocalJobs([]);
    }
  };

  if (!isLoaded) {
    return <Loader />;
  }

  if (jobsError) {
    return <NotFound text={"oOps..! No jobs Were Found"} />;
  }

  return (
    <div>
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="h-10 sm:h-12 flex flex-row w-full gap-2 items-center mb-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title . . . ."
          name="search-query"
          className="h-full flex-1 px-4 text-md bg-slate-700"
        />
        <Button type="submit" className="h-10 sm:h-12 sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Select
            value={location}
            onValueChange={(value) => {
              setShowCardSkeleton(true);
              setLocation(value);
              setLocalJobs([]);
              setPage(1); // Reset page to 1 when location changes
            }}
          >
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map((state) => (
                  <SelectItem key={state.name} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={company_id}
            onValueChange={(value) => {
              setShowCardSkeleton(true);
              setCompany_id(value);
              setLocalJobs([]);
              setPage(1); // Reset page to 1 when company changes
            }}
          >
            <SelectTrigger className="w-full sm:w-1/2">
              <SelectValue
                placeholder={`${
                  companiesError ? "Not companies Found" : "Select Company"
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="sm:w-1/6"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {/* Job Listings */}
      {showCardSkeleton && page === 1 && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-9">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}

      {!showCardSkeleton && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localJobs?.length > 0 ? (
            localJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                updateJobSavedStatus={updateJobSavedStatus}
              />
            ))
          ) : (
            <NotFound text={"Opps.. Jobs Not Found"} />
          )}
        </div>
      )}

      {/* Bottom Loading Indicator */}
      {showBottomLoader && (
        <div className="mt-8 flex justify-center items-center">
          <div className="animate-spin w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default JobListing;
