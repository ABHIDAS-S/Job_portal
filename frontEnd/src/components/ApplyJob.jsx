/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "@clerk/clerk-react";
import { api } from "@/api/api";
import Loader from "./Loader";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

function ApplyJobDrawer({ user, job,refetchJob}) {
  const { session } = useSession();
  const [applyError, setApplyError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      experience: "",
      skills: "",
      education: "",
    },
  });

  const onSubmit = (data) => {

    setApplyLoading(true);
    // Create FormData instance
    const formData = new FormData();

    // Append fields to FormData
    formData.append("job_id", job?._id);
    formData.append("candidate_id", user?.id);
    formData.append("name", user?.fullName);
    formData.append("status", "applied");
    formData.append("experience", data.experience);
    formData.append("skills", data.skills);
    formData.append("education", data.education);

    // Append the resume file (from the input)
    formData.append("resume", data.resume[0]); // Ensure `data.resume[0]` is the file

    const applyJobApplication = async () => {
      try {
        const token = await session.getToken();

        const res = await api.post(
          `/api/candidate/applyJob/${job?._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Important for sending files
            },
            withCredentials: true,
          }
        );

        toast({
          title: "Application submitted successfully",
          description: "Your application has been submitted successfully",
        })
        reset();
        refetchJob();
      } catch (error) {
        console.error("Error saving job:", error);
        setApplyError(error);
      } finally {
        setApplyLoading(false);
      }
    };

    applyJobApplication();
  };

  return (
    <Drawer open={job?.isApplied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !job?.isApplied ? "blue" : "darkGreen"}
          // disabled={!job?.isOpen || job?.isApplied}
        >
          {job?.isOpen
            ? job?.isApplied
              ? "Already Applied"
              : "Apply"
            : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill the form below</DrawerDescription>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            type="number"
            placeholder="Years of Experience"
            {...register("experience", {
              required: "Experience is required",
              min: 0,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills (Comma Separated)"
            className="flex-1"
            {...register("skills", { required: "Skills are required" })}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            rules={{ required: "Education is required" }}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="post-graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            placeholder="Resume"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume", { required: "Resume is required" })}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {applyError?.message && (
            <p className="text-red-500">{applyError?.message}</p>
          )}

          {applyLoading && <Loader width={"100%"} color="#36d7b7" />}
          <DrawerFooter>
            <Button
              className={`${applyLoading && "pointer-events-none bg-blue-900"}`}
              type="submit"
              variant="blue"
            >
              {applyLoading ? "Submitting..." : "Apply"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export default ApplyJobDrawer;
