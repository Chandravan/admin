import React, { useState } from "react";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

//const db = getFirestore();
//const storage = getStorage();

const StudentEditor = () => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const fetchStudentDetails = async () => {
    if (!registrationNo) {
      alert("Please enter a registration number!");
      return;
    }

    setLoading(true);
    try {
      const studentRef = doc(db, "students", registrationNo);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        setStudentData({ ...studentSnap.data(), registrationNo });
        setEditing(false); // Exit editing mode if enabled
      } else {
        alert("No student found with this registration number!");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Failed to fetch student details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const { name, branch, imageUrl } = studentData;

    if (!name || !branch || !imageUrl) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const studentRef = doc(db, "students", registrationNo);
      await updateDoc(studentRef, { name, branch, imageUrl });
      alert("Student details updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating student details:", error);
      alert("Failed to update student details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this student?");
    if (!confirmation) return;

    setLoading(true);
    try {
      // Delete Firestore record
      const studentRef = doc(db, "students", registrationNo);
      await deleteDoc(studentRef);

      // Delete image from Storage
      const storageRef = ref(storage, `students/${registrationNo}`);
      await deleteObject(storageRef);

      alert("Student data deleted successfully!");
      setStudentData(null);
      setRegistrationNo("");
    } catch (error) {
      console.error("Error deleting student data:", error);
      alert("Failed to delete student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="student-editor">
      <h2>Search and Edit Student</h2>

      {/* Search Section */}
      <div>
        <input
          type="text"
          placeholder="Enter Registration No"
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
        />
        <button onClick={fetchStudentDetails} disabled={loading}>
          {loading ? "Fetching..." : "Search"}
        </button>
      </div>

      {/* Student Details Section */}
      {studentData && (
        <div className="student-details">
          {!editing ? (
            <>
              <p><strong>Name:</strong> {studentData.name}</p>
              <p><strong>Branch:</strong> {studentData.branch}</p>
              <img src={studentData.imageUrl} alt="Student" style={{ width: "100px" }} />
              <div>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={handleDelete} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={studentData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={studentData.branch}
                onChange={handleChange}
              />
              <button onClick={handleEdit} disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentEditor;
