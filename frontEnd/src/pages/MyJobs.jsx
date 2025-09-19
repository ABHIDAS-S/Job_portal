// import CreatedJobs from "@/components/created-jobs";
import CreatedApplications from "@/components/CreatedApplications";
import CreatedJobs from "@/components/CreatedJobs";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/clerk-react";

import { useState } from "react";
 



const MyJobs = () => {
  const { user, isLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState(1);


  const ITEMS_PER_PAGE = 6;



  if (!isLoaded) {
    return <Loader className="mb-4" width={"100%"} color="#36d7b7" />;
  }



  

  return (
    <div>
      {/* <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8 mb-12">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1> */}
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE}  setCurrentPage={setCurrentPage}/>
      ) : (
        <CreatedJobs currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} setCurrentPage={setCurrentPage} />
      )}


    </div>
  );
};

export default MyJobs;
