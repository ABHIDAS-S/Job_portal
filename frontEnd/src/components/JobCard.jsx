/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Link } from "react-router-dom";
import { useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { api } from "@/api/api";
import Loader from "./Loader";
import { useToast } from "@/hooks/use-toast"


const JobCard = ({
  job,
  onJobAction,
  isMyJob = false,
  updateJobSavedStatus,
}) => {


  
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useSession();
  const { toast } = useToast();

  // handle save job

  const handleSaveJob = async () => {
    setIsSaving(true);
    try {
      const token = await session.getToken();

      // Make API call to save/unsave the job
      const response = await api(`/api/candidate/saveJob/${job._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      updateJobSavedStatus(job._id, !job.saved);
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // handle delete  job
  const handleDeleteJob = async () => {
    setIsSaving(true);
    try {
      const token = await session.getToken();

      // Make API call to save/unsave the job
      const response = await api(`/api/recruiter/deleteJob/${job._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onJobAction(job._id);
      toast({
        title: "Job deleted !",
        description: "The job has been deleted successfully",
      })
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="flex flex-col relative">
      {isSaving && <Loader />}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                {job?.title?.length > 20
                  ? job?.title?.substring(0, 20) + "..."
                  : job?.title}
              </TooltipTrigger>
              <TooltipContent>
                <p>{job?.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isMyJob && (
            <AlertDialog>
              <AlertDialogTrigger>
                {" "}
                <Trash2Icon
                  size={18}
                  className=" cursor-pointer hover:scale-110 duration-100 ease-in-out"
                  //   onClick={handleDeleteJob}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone and will permanently remove
                    this job and all associated data from our system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteJob}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && <img src={job?.company?.logo} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job?.location}
          </div>
        </div>
        <hr />
        {job?.description?.substring(0, job?.description.indexOf(".")).length >
        130 ? (
          <p>{job.description.substring(0, 130) + "..."}</p>
        ) : (
          <p>{job.description}</p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job._id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={isSaving}
          >
            {job.saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
