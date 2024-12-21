import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Ensure you have Firebase setup correctly

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    registrationNo: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      // Create preview URL for image
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      // Upload image to Firebase Storage
      const fileExtension = image.name.split(".").pop();
      const storageRef = ref(storage, `students/${registrationNo}.${fileExtension}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Save student data to Firestore
      await setDoc(doc(db, "students", registrationNo), {
        name,
        branch,
        registration_no: registrationNo,
        imageUrl,
      });

      // Clear form after successful submission
      setFormData({ name: "", branch: "", registrationNo: "", image: null });
      setPreviewUrl(null);
      alert("Student added successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Add New Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Enter student's full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              type="text"
              name="branch"
              placeholder="Enter branch/department"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNo">Registration Number</Label>
            <Input
              id="registrationNo"
              type="text"
              name="registrationNo"
              placeholder="Enter registration number"
              value={formData.registrationNo}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Student Photo</Label>
            <div className="flex flex-col items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Adding Student..." : "Add Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStudent;
