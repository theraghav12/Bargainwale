import React, { useEffect, useState } from "react";
import {
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/clerk-react";
import axios from "axios";
import { API_BASE_URL } from "@/services/api"; // Update this path as needed
import { toast } from "sonner"; // Use any toast library you prefer
import { useNavigate } from "react-router-dom";

const CreateOrganizationPage = () => {
  const { createOrganization, setActive } = useOrganizationList();
  const { user } = useUser();
  const [organizationName, setOrganizationName] = useState("");
  const [setAsActive, setSetAsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { organization, isLoaded } = useOrganization();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organizationName) {
      toast.error("Organization name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const organization = await createOrganization({
        name: organizationName,
      });

      if (setAsActive) {
        await setActive({ organization });
      }

      const response = await axios.post(`${API_BASE_URL}/organization`, {
        name: organizationName,
        clerkOrganizationId: organization.id,
        creatorId: user.id,
      });
      console.log(response);

      if (response.status === 201) {
        toast.success("Organization created successfully!");
        setOrganizationName("");
        setSetAsActive(true);
        localStorage.setItem("organizationId", response.data.organization?._id);
        navigate("/dashboard");
      } else {
        toast.error("Failed to save organization in the database.");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("An error occurred while creating the organization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative top-10 flex items-center justify-center">
      {isLoaded ? (
        organization === null ? (
          <form
            onSubmit={handleSubmit}
            className="w-[50%] px-8 py-5 bg-white rounded-xl shadow-lg flex flex-col gap-4 items-start"
          >
            <div className="w-full">
              <label
                htmlFor="orgName"
                className="block text-xs font-medium text-gray-700"
              >
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                name="organizationName"
                placeholder="e.g. Acme Co"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={isSubmitting}
                required
                className="mt-1 w-full rounded-md border-gray-200 border shadow-sm sm:text-sm px-2 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting
                ? "Creating organization..."
                : "Create Organization"}
            </button>
          </form>
        ) : (
          <h1 className="text-[1rem]">Organization already created!</h1>
        )
      ) : (
        <h1 className="text-[1rem]">Loading...</h1>
      )}
    </div>
  );
};

export default CreateOrganizationPage;
