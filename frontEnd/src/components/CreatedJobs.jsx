import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import JobCard from "./JobCard";
import useFetch from "@/hooks/useFetch";
import Loader from "./Loader";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import CustomPagination from "./CoustomPagination";

const ITEMS_PER_PAGE = 6;

const CreatedJobs = () => {
  const { isLoaded } = useUser();
  // const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedJobs, setPaginatedJobs] = useState([]);

  const {
    data: jobs=[],
    loading,
    refreshHook,
  } = useFetch("/api/recruiter/getMyJobs");

  // Load jobs when user is loaded
  useEffect(() => {
    if (isLoaded ) {
      refreshHook();
    }
  }, [isLoaded]);



  // Handle pagination
  useEffect(() => {
    if (jobs?.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedJobs(jobs.slice(startIndex, endIndex));
    } else {
      setPaginatedJobs([]);
    }
  }, [jobs, currentPage]);

  // Handle job deletion
 // Handle job deletion with useCallback
 const onDeleteJob = useCallback(async (jobId) => {
  const updatedJobs = jobs.filter((job) => job._id !== jobId);
  if (
    currentPage > 1 &&
    updatedJobs.length > 0 &&
    Math.ceil(updatedJobs.length / ITEMS_PER_PAGE) < currentPage
  ) {
    setCurrentPage(prev => prev - 1);
  }
  refreshHook();
}, [jobs, currentPage, refreshHook]);

  if (!isLoaded || loading) {
    return <Loader className="mt-4" width="100%" color="#36d7b7" />;
  }

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <div className="flex flex-col gap-8">
      {loading ? (
        <Loader className="mt-4" width="100%" color="#36d7b7" />
      ) : (
        <>
          {jobs?.length > 0 ? (
            <motion.div
              className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {paginatedJobs.map((job) => (
                <motion.div key={job._id} variants={itemVariants} layout>
                  <JobCard job={job} onJobAction={onDeleteJob} isMyJob={true} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NotFound text="oOps..! No Jobs Found" />
            </motion.div>
          )}

          {/* Pagination */}

          {jobs?.length > 0 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil(jobs.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={jobs.length}
              className="mt-4"
            />
          )}
        </>
      )}
    </div>
  );
};

export default CreatedJobs;
