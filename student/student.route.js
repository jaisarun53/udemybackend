import express from "express";
import { addStudentValidationSchema } from "./student.validation.js";
import Student from "./student.model.js";
const router = express.Router();

// add student
router.post("/student/add", async (req, res) => {
  // extract new student from
  const newStudent = req.body;
  console.log(newStudent);
  // validate new student using yup
  let validatedData;
  try {
    validatedData = await addStudentValidationSchema.validate(newStudent);
  } catch (error) {
    // if validation fails, throw error
    return res.status(400).send({ message: error.message });
  }

  // check if user with provided email already exists
  const student = await Student.findOne({ email: newStudent.email });
  // if user exists, throw error
  if (student) {
    return res.status(409).send({ message: "user already exist" });
  }

  console.log({ validatedData });
  // create user
  await Student.create(newStudent);
  // send response
  return res.status(200).send({ message: "student added successfully" });
});
export default router;
