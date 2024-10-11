import { CreateOrganization, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/services/api";
import { toast } from "react-toastify";

const CreateOrganizationPage = () => {
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleOrganizationCreated = async (organization) => {
    setIsCreating(true);

    try {
      const organizationData = {
        name: organization.name,
        clerkOrganizationId: organization.id,
        creatorId: user.id,
      };

      const response = await axios.post(
        `${API_BASE_URL}/organization`,
        organizationData
      );

      if (response.status === 201) {
        navigate("/dashboard/home");
        toast.success("Organization Created!");
      } else {
        console.log("Failed to store organization in DB:", response.data);
      }
    } catch (error) {
      setErrorMessage("Error storing organization in the database");
      console.error("Error:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-20">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isCreating ? (
        <p>Creating organization...</p>
      ) : (
        <CreateOrganization
          path="/auth/create-organization"
          afterCreateOrganizationUrl={(organization) => {
            handleOrganizationCreated(organization);
          }}
        />
      )}
    </div>
  );
};

export default CreateOrganizationPage;
