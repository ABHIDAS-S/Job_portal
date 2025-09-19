import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(()=>{
    if(user && user.unsafeMetadata?.role) navigate(user.unsafeMetadata?.role === "recruiter" ? "/" : "/");
  })

  const handleRoleSelection = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/postJob" : "/jobs");
      })
      .catch((err) => console.log("Error in updating role", err));
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4 " width={"100%"} color="violet" />;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter caveat">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:px-40 p-5">
        <Button
          variant="blue"
          className="h-20 text-xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-20 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
