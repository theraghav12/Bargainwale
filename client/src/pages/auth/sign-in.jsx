import { API_BASE_URL } from "@/services/api";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Spinner } from "@material-tailwind/react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const { user } = useUser();

  console.log(user);

  useEffect(() => {
    const userValidation = async () => {
      try {
        if (user) {
          const response = await axios.post(`${API_BASE_URL}/checkUser`, {
            clerkId: user.id,
          });
          if (response.status === 200) {
            toast.success("Signed In!", {
              description: `Welcome ${user.fullName ? user.fullName : ""}`,
            });
            if (user.organizationMemberships.length === 0) {
              navigate("/auth/create-organization");
            } else {
              navigate("/dashboard");
            }
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          await axios.post(`${API_BASE_URL}/register`, {
            clerkId: user.id,
            name: user.fullName || user.firstName,
            email: user.emailAddresses[0].emailAddress,
          });

          toast.success("User registered successfully!");
          if (user.organizationMemberships.length === 0) {
            navigate("/create-organization");
          } else {
            navigate("/dashboard");
          }
        } else {
          console.log(err);
        }
      }
    };
    userValidation();
  }, [user, navigate]);

  return (
    <header>
      <SignedOut>
        <div className="flex flex-col items-center justify-center mt-[20%]">
          <Spinner />
          <p className="text-center text-[1.2rem]">Redirecting to Sign in...</p>
        </div>
        <RedirectToSignIn />
      </SignedOut>
    </header>
  );
}
