/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import Loader from "./Loader";
import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./ApplicationCard";
import NotFound from "./NotFound";

import CustomPagination from "./CoustomPagination";

const CreatedApplications = ({ currentPage,  setCurrentPage }) => {
  const { isLoaded } = useUser();
  const [paginatedApplications, setPaginatedApplications] = useState([]);
  const ITEMS_PER_PAGE = 5;

  const {
    data: applications,
    loading: loadingApplications,
    refreshHook: refreshApplications,
  } = useFetch("/api/candidate/fetchApplications");

  useEffect(() => {
    if (isLoaded) {
      refreshApplications();
    }
  }, [isLoaded]);

  // Handle pagination
  useEffect(() => {
    if (applications?.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedApplications(applications.slice(startIndex, endIndex));
    }
  }, [applications, currentPage]);

  if (!isLoaded || loadingApplications) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {applications?.length > 0 ? (
          paginatedApplications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              isCandidate={true}
            />
          ))
        ) : (
          <NotFound text={"oOps..! No Applications Found"} />
        )}
      </div>

      {
        applications?.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(applications?.length / ITEMS_PER_PAGE)}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={applications?.length}
            className="mt-4"
          />
        )
      }

    </div>
  );
};

export default CreatedApplications;
