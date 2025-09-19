import { useSession, useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/api/api";
import ApplyJobDrawer from "@/components/ApplyJob";
import Loader from "@/components/Loader";
import ApplicationCard from "@/components/ApplicationCard";
const Job = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { session } = useSession();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobStatusLoading, setJobStatusLoading] = useState(false);

  const hasFetchedJob = useRef(false); // Ref to track if the job has been fetched

  /// useFetch hook is not used because it is causing on selecting a file input /so to avoid that useRef is used

  const fetchJob = useCallback(async () => {
    if (!isLoaded || !session || hasFetchedJob.current) return;

    setLoading(true);
    try {
      const token = await session.getToken();
      const response = await api.get(`/api/candidate/jobDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });


      setJob(response.data.data);
      hasFetchedJob.current = true; // Mark as fetched
    } catch (err) {
      console.error("Error fetching job:", err);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
      
    }
  }, [id, isLoaded, session]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const refetchJob = () => {
    hasFetchedJob.current = false;
    fetchJob();
    hasFetchedJob.current = true;
  };

  const handleStatusChange = async (status) => {
    setJobStatusLoading(true);

    try {
      const token = await session.getToken();
      const data = { status: status };

      const res = await api.patch(
        `/api/recruiter/changeHiringStatus/${job._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      job.isOpen = status === "open";
      setJobStatusLoading(false);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  if (!isLoaded || loading) {
    return <Loader />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5 relative  ">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo} className="h-12" alt={job?.title} />
      </div>

      <div className=" flex justify-between bg-slate-700 rounded-sm p-3 text-xs sm:text-md md:text-lg flex-wrap gap-2 ">
        <div className="flex gap-2">
          <MapPinIcon className="w-4 h-4 sm:w-6 sm:h-6" /> {job?.location}
        </div>

        <div className="flex gap-2">
          <Briefcase  className="w-4 h-4 sm:w-6 sm:h-6" /> {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen  className="w-4 h-4 sm:w-6 sm:h-6" /> Open
            </>
          ) : (
            <>
              <DoorClosed  className="w-4 h-4 sm:w-6 sm:h-6" /> Closed
            </>
          )}
        </div>
      </div>

      <hr className="border-gray-600" />

      {jobStatusLoading && <BarLoader width={"100%"} color="#36d7b7" />}

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg    " // add global ul styles - tutorial
      />

      {job?.recruiter_id !== user?.id && (
          <ApplyJobDrawer job={job} user={user} refetchJob={refetchJob} />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard
                key={application.id}
                application={application}
                session={session}
                isCandidate={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Job;
