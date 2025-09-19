import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import Loader from "@/components/Loader";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import NotFound from "@/components/NotFound";
import CustomPagination from "@/components/CoustomPagination";

const ITEMS_PER_PAGE = 6;

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedJobs, setPaginatedJobs] = useState([]);
  const { isLoaded } = useUser();

  const {
    data: savedJobsFromApi,
    loading: loadingSavedJobs,
    refreshHook: fnSavedJobs,
  } = useFetch("/api/candidate/fetchSavedJobs");



  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (savedJobsFromApi) {
      setSavedJobs(savedJobsFromApi);
    }
  }, [savedJobsFromApi]);

  // Handle pagination
  useEffect(() => {
    if (savedJobs?.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedJobs(savedJobs.slice(startIndex, endIndex));
    }
  }, [savedJobs, currentPage]);

  if (!isLoaded || loadingSavedJobs) {
    return <Loader />;
  }

  const updateJobSavedStatus = (jobId) => {
    setSavedJobs((prevJobs) => {
      const updatedJobs = prevJobs.filter((job) => job.job_id._id !== jobId);
      // If current page becomes empty, go to previous page
      if (
        updatedJobs.length > 0 &&
        Math.ceil(updatedJobs.length / ITEMS_PER_PAGE) < currentPage
      ) {
        setCurrentPage((prev) => prev - 1);
      }
      return updatedJobs;
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {loadingSavedJobs === false && (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs?.length > 0 ? (
              paginatedJobs.map((saved) => (
                <motion.div
                  key={saved.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <JobCard
                    job={saved?.job_id}
                    onJobAction={fnSavedJobs}
                    savedInit={true}
                    updateJobSavedStatus={updateJobSavedStatus}
                  />
                </motion.div>
              ))
            ) : (
              <NotFound text={"oOps..! No Saved Jobs Found"} />
            )}
          </div>

          {
            savedJobs?.length > 0 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={Math.ceil(savedJobs.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={savedJobs.length}
                className="mt-4"
              />
            )
          }

       
        </>
      )}
    </div>
  );
};

export default SavedJobs;
