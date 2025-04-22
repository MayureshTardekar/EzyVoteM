import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Card from "../components/Card";

const CreateSecureEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    candidates: [
      { name: "", bio: "" },
      { name: "", bio: "" },
    ],
    manifesto: "",
    voterLimit: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    voterAddresses: [],
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle input changes for text fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for candidate fields
  const handleCandidateChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedCandidates = [...eventData.candidates];
    updatedCandidates[index][field] = value;
    setEventData((prevData) => ({
      ...prevData,
      candidates: updatedCandidates,
    }));
  };

  // Add a new candidate field
  const addCandidate = () => {
    setEventData((prevData) => ({
      ...prevData,
      candidates: [...prevData.candidates, { name: "", bio: "" }],
    }));
  };

  // Remove a candidate field
  const removeCandidate = (index: number) => {
    if (eventData.candidates.length > 2) {
      const updatedCandidates = eventData.candidates.filter(
        (_, i) => i !== index
      );
      setEventData((prevData) => ({
        ...prevData,
        candidates: updatedCandidates,
      }));
    } else {
      toast.error("At least 2 candidates are required.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Change the URL to include the full path
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventData,
          isSecure: true,
          voterAddresses: eventData.voterAddresses
            .filter(addr => addr.trim()) // Remove empty addresses
            .map(addr => addr.trim().toLowerCase()) // Normalize addresses
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create secure event");
      }

      toast.success("Secure event created successfully!");
      // Reset form
      setEventData({
        title: "",
        candidates: [
          { name: "", bio: "" },
          { name: "", bio: "" },
        ],
        manifesto: "",
        voterLimit: 0,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        voterAddresses: [],
      });
    } catch (error: any) {
      console.error("Error creating secure event:", error);
      toast.error(error.message || "An error occurred while creating the secure event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-amber-600">
          Create Secure Event
        </h1>
        <p className="mt-2 text-gray-600">
          Create a premium voting event with whitelisted addresses.
        </p>
      </header>

      <Card className="mx-auto max-w-4xl p-6 border-2 border-amber-200">
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Candidates Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Candidates</h2>
            {eventData.candidates.map((candidate, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Candidate {index + 1}</h3>
                  {eventData.candidates.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`candidate-name-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    id={`candidate-name-${index}`}
                    value={candidate.name}
                    onChange={(e) =>
                      handleCandidateChange(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter candidate name"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`candidate-bio-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Candidate Bio
                  </label>
                  <textarea
                    id={`candidate-bio-${index}`}
                    value={candidate.bio}
                    onChange={(e) =>
                      handleCandidateChange(index, "bio", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter candidate bio"
                    rows={2}
                    required
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={addCandidate}
              variant="secondary"
              className="mt-4 border border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Plus size={16} /> Add Candidate
            </Button>
          </div>

          {/* Manifesto (Optional) */}
          <div className="mb-4">
            <label
              htmlFor="manifesto"
              className="block text-sm font-medium text-gray-700"
            >
              Manifesto (Optional)
            </label>
            <textarea
              id="manifesto"
              name="manifesto"
              value={eventData.manifesto}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter manifesto details"
              rows={4}
            />
          </div>

          {/* Number of Voters */}
          <div className="mb-4">
            <label
              htmlFor="voterLimit"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Voters
            </label>
            <input
              type="number"
              id="voterLimit"
              name="voterLimit"
              value={eventData.voterLimit}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter voter limit"
              required
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={eventData.startDate}
              onChange={handleInputChange}
              min={getTodayDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={eventData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={eventData.endDate}
              onChange={handleInputChange}
              min={getTodayDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={eventData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          {/* Whitelist section with premium styling */}
          <div className="mb-4 mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <label className="block text-sm font-medium text-amber-700 mb-2">
              Whitelisted Addresses (comma separated)
            </label>
            <textarea
              value={eventData.voterAddresses.join(",")}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  voterAddresses: e.target.value
                    .split(",")
                    .map((addr) => addr.trim()),
                })
              }
              className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
              placeholder="0x123..., 0x456..."
              required
            />
            <p className="mt-2 text-sm text-amber-600">
              Only these addresses will be able to participate in this secure
              voting event.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Create Secure Event
          </Button>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default CreateSecureEvent;
