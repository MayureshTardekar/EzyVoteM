import React, { useState, useRef } from "react";
import { Plus, Vote, Trash2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEvent = () => {
  // State to manage form data
  const [eventData, setEventData] = useState({
    title: "",
    candidates: [
      { name: "", bio: "" }, // Default candidate 1
      { name: "", bio: "" }, // Default candidate 2
    ],
    manifesto: "",
    voterLimit: 0,
    startDate: "", // Add start date
    startTime: "", // Add start time
    endDate: "",   // Add end date
    endTime: "",   // Add end time
  });

  // Ref for file input to reset it programmatically
  const fileInputRef = useRef(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for candidate fields
  const handleCandidateChange = (index: number, field: string, value: string) => {
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
      const updatedCandidates = eventData.candidates.filter((_, i) => i !== index);
      setEventData((prevData) => ({
        ...prevData,
        candidates: updatedCandidates,
      }));
    } else {
      toast.error("At least 2 candidates are required.");
    }
  };

  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate required fields
  if (
    !eventData.title ||
    eventData.candidates.some((candidate) => !candidate.name || !candidate.bio) ||
    eventData.voterLimit <= 0 ||
    !eventData.startDate ||
    !eventData.startTime ||
    !eventData.endDate ||
    !eventData.endTime
  ) {
    toast.error("Please fill out all required fields.");
    return;
  }

  try {
    // Send POST request to create the event
    const response = await fetch("/api/create-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event.");
    }

    // Show success notification
    toast.success("Event created successfully!");

    // Reset form fields after successful submission
    setEventData({
      title: "",
      candidates: [
        { name: "", bio: "" }, // Default candidate 1
        { name: "", bio: "" }, // Default candidate 2
      ],
      manifesto: "",
      voterLimit: 0,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
  } catch (error) {
    // Show error notification
    toast.error("An error occurred while creating the event. Please try again.");
    console.error("Error creating event:", error);
  }
};
  
  return (
    <>
      {/* Header */}
      <header className="text-center py-6">
        <h1 className="text-3xl font-bold">Create New Voting Event</h1>
        <p className="mt-2 text-gray-500">Set up your voting event with all the necessary details.</p>
      </header>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Event Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Candidates Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Candidates</h2>
          {eventData.candidates.map((candidate, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2">
                <label htmlFor={`candidate-name-${index}`} className="block text-sm font-medium text-gray-700">
                  Candidate Name
                </label>
                <input
                  type="text"
                  id={`candidate-name-${index}`}
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate name"
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor={`candidate-bio-${index}`} className="block text-sm font-medium text-gray-700">
                  Candidate Bio
                </label>
                <textarea
                  id={`candidate-bio-${index}`}
                  value={candidate.bio}
                  onChange={(e) => handleCandidateChange(index, "bio", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate bio"
                  rows={3}
                  required
                />
              </div>
              {eventData.candidates.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Remove Candidate
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={addCandidate}
            variant="secondary"
            className="mt-4"
          >
            <Plus size={16} /> Add Candidate
          </Button>
        </div>

        {/* Manifesto (Optional) */}
        <div className="mb-4">
          <label htmlFor="manifesto" className="block text-sm font-medium text-gray-700">
            Manifesto (Optional)
          </label>
          <textarea
            id="manifesto"
            name="manifesto"
            value={eventData.manifesto}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter manifesto details"
            rows={4}
          />
        </div>

        {/* Number of Voters */}
        <div className="mb-4">
          <label htmlFor="voterLimit" className="block text-sm font-medium text-gray-700">
            Number of Voters
          </label>
          <input
            type="number"
            id="voterLimit"
            name="voterLimit"
            value={eventData.voterLimit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter voter limit"
            required
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={eventData.startDate}
            onChange={handleInputChange}
            min={getTodayDate()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={eventData.startTime}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={eventData.endDate}
            onChange={handleInputChange}
            min={getTodayDate()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={eventData.endTime}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
};

export default CreateEvent;