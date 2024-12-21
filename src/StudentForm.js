import React, { useState } from "react";
import { addStudent } from "./FirebaseService"; // Importing the Firebase logic

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    registrationNo: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, branch, registrationNo, image } = formData;

    if (!name || !branch || !registrationNo || !image) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      // Use the Firebase service to handle data submission
      await addStudent(formData);
      alert("Student added successfully!");
      setFormData({ name: "", branch: "", registrationNo: "", image: null });
    } catch (error) {
      console.error("Error uploading student details:", error);
      alert("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Student Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="registrationNo"
          placeholder="Registration No"
          value={formData.registrationNo}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
