/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/api/api";
import { useState } from "react";
import Loader2 from "./Loader";

const ApplicationCard = ({ application, isCandidate = false, session }) => {
  const [loadingApplicationStatus, setLoadingApplicationStatus] =
    useState(false);
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resumePath;
    link.target = "_blank";
    link.click();
  };

  const handleStatusChange = async (status) => {
    setLoadingApplicationStatus(true);

    try {
      const token = await session.getToken();
      const data = { status: status };

      const res = await api.patch(
        `/api/recruiter/changeApplicationStatus/${application._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setLoadingApplicationStatus(false);
    } catch (error) {
      console.error("Error saving job:", error);
      setLoadingApplicationStatus(false);
    }
  };

  return (
    <Card className="relative text-sm sm:text-lg">
      {loadingApplicationStatus && <Loader2 width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold text-sm sm:text-lg">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}

          {!isCandidate && (
            <div className="text-md">{application?.candidate_name}</div>
          )}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between text-sm sm:text-lg">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center text-sm sm:text-lg">
            <School size={15} />
            {application?.education.charAt(0).toUpperCase() +
              application?.education.slice(1)}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.createdAt).toLocaleDateString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewScheduled">
                Interview Scheduled
              </SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
