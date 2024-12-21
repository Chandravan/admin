import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

const uploadImageToStorage = async (image, registrationNo) => {
  const fileExtension = image.name.split(".").pop();
  const storageRef = ref(storage, `students/${registrationNo}.${fileExtension}`);
  await uploadBytes(storageRef, image);
  return getDownloadURL(storageRef);
};

const saveStudentDataToFirestore = async (studentData) => {
  const { name, branch, registrationNo, imageUrl } = studentData;
  await setDoc(doc(db, "students", registrationNo), {
    name,
    branch,
    registration_no: registrationNo,
    imageUrl,
  });
};

export const addStudent = async (studentData) => {
  const { image, registrationNo } = studentData;
  const imageUrl = await uploadImageToStorage(image, registrationNo);
  await saveStudentDataToFirestore({ ...studentData, imageUrl });
};
