import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";
import { useUser, useSession } from "@clerk/clerk-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/Loader";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import AddCompanyDrawer from "@/components/AddCompanyDrawer";
import { api } from "@/api/api";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company_id: z.string().min(1, { message: "Select or add a new company" }),
  requirements: z.string().min(1, { message: "Requirements is necessary" }),
});

const Posting = () => {
  //////////// for checking the clerk session  is loaded or not
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const hasFetchedCompanies = useRef(false);
  const [postJobLoading, setPostJobLoading] = useState(false);

  const navigate = useNavigate();

  /// useFetch hook is not used because it is causing on selecting a file input /so to avoid that useRef is used
  ///for fetching companies

  const fetchCompanies = useCallback(async () => {
    if (!isLoaded || !session || hasFetchedCompanies.current) return;

    setCompaniesLoading(true);
    try {
      const token = await session.getToken();
      const response = await api.get(`/api/candidate/getCompanies`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });


      setCompanies(response.data.data);
      hasFetchedCompanies.current = true; // Mark as fetched
    } catch (err) {
      console.error("Error fetching job:", err);
    } finally {
      setCompaniesLoading(false);
    }
  }, [isLoaded, session]);

  useEffect(() => {
    if (isLoaded) {
      fetchCompanies();
    }
  }, [isLoaded]);

  /// for refetching companies
  const refetchCompanies = () => {
    hasFetchedCompanies.current = false;
    fetchCompanies();
    hasFetchedCompanies.current = true;
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      title: "",
      description: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  if (!isLoaded || companiesLoading) {
    return <Loader className="mb-4 " width={"100%"} color="violet" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    navigate("/jobs");
  }

  const onSubmit = async (data) => {
    setPostJobLoading(true);

    try {
      const token = await session.getToken();

      const res = await api.post(`/api/recruiter/postJob`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for sending files
        },
        withCredentials: true,
      });

      navigate("/jobs");
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setPostJobLoading(false);
    }
  };

  return (
    <div>
      {/* <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1> */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-8 md:p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className=" flex  flex-col   md:flex-row gap-4 w-full ">
          <div className="flex flex-col md:w-1/2 gap-2">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="flex md:w-1/2  ">
            <div className="flex flex-col w-7/12 md:w-9/12 gap-2">
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Companies">
                        {field.value
                          ? companies?.find(
                              (company) => company._id === field.value
                            )?.name
                          : "Company"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies?.map(({ name, _id }) => (
                          <SelectItem key={_id} value={_id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.company_id && (
                <p className="text-red-500">{errors.company_id.message}</p>
              )}
            </div>

            <div className=" text-end w-5/12 md:w-3/12 ">
              <AddCompanyDrawer
                className="w-full"
                refetchCompanies={refetchCompanies}
                session={session}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor value={field.value} onChange={field.onChange} />
            )}
          />
           {errors.requirements && (
              <p className="text-red-500">{errors.requirements.message}</p>
            )}
        </div>
        <Button
          type="submit"
          variant={postJobLoading ? "loading" : "blue"}
          size="lg"
          className="mt-2 relative"
        >
          {postJobLoading && <Loader />}
          {postJobLoading ? "Submitting..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
};

export default Posting;
