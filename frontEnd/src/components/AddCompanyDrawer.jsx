/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/api/api";
import { useState } from "react";
import Loader2 from "./Loader";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ refetchCompanies, session }) => {
  const [loadingAddCompany, setLoadingAddCompany] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("logo", data.logo[0]);
    setLoadingAddCompany(true);

    try {
      const token = await session.getToken();

      const res = await api.post(`/api/recruiter/addCompany`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for sending files
        },
        withCredentials: true,
      });


      setLoadingAddCompany(false);
      refetchCompanies();
    } catch (error) {
      console.error("Error saving job:", error);
      setLoadingAddCompany(false);
      setError(error);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary" >
          Add Company
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        {loadingAddCompany && <Loader2 width={"100%"} />}
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex flex-col lg:flex-row lg:items-start gap-2 p-4 pb-0">
          <div className="flex flex-col lg:w-5/12 gap-2">
            {/* Company Name */}
            <Input placeholder="Company name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 lg:w-5/12 ">
            {/* Company Logo */}
            <Input
              type="file"
              accept="image/*"
              className="file:text-gray-500"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-red-500">{errors.logo.message}</p>
            )}
          </div>

          <Button
          
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className={`  ${loadingAddCompany ? "cursor-not-allowed" : ""}    lg:w-2/12 ` }
          >
            {loadingAddCompany ? "Adding..." : "Add"}
          </Button>
        </form>

        <DrawerFooter>
          {error?.message && <p className="text-red-500">{error?.message}</p>}

          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
