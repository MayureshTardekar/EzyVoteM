import React, { useState } from "react";
import { Plus, Vote, Trash2, Shield } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateSecureEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    candidates: [
      { name: "", bio: "" },
      { name: "", bio: "" },
    ],
    voterAddresses: [],
    voterLimit: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/create-secure-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        toast.success("Secure event created successfully!");
        setEventData({
          title: "",
          candidates: [
            { name: "", bio: "" },
            { name: "", bio: "" },
          ],
          voterAddresses: [],
          voterLimit: 0,
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        });
      } else {
        throw new Error("Failed to create secure event");
      }
    } catch (error) {
      toast.error("An error occurred while creating the secure event");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700">Create Secure Event</h1>
        <p className="mt-2 text-gray-600">Create a secure voting event with whitelisted addresses.</p>
      </header>

      <Card className="mx-auto max-w-4xl p-6">
        <form onSubmit={handleSubmit}>
          {/* Form fields similar to CreateEvent.tsx */}
          {/* Add a field for voterAddresses */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Whitelisted Addresses (comma separated)
            </label>
            <textarea
              value={eventData.voterAddresses.join(",")}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  voterAddresses: e.target.value.split(","),
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Create Secure Event
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default CreateSecureEvent;