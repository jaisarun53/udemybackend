import express from "express";
import Course from "./course.model.js";
import {
  courseValidationSchema,
  paginationDataValidationSchema,
} from "./course.validation.js";
import mongoose from "mongoose";
const router = express.Router();
// add course--------------
router.post("/course/add", async (req, res) => {
  // extrect new course from body
  const newCourse = req.body;
  //   validation
  try {
    await courseValidationSchema.validate(newCourse);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  //   save course
  await Course.create(newCourse);
  // send response
  return res.status(201).send({ message: "Course added successfully" });
});
// edit course---------------
router.put("/course/edit/:id", async (req, res) => {
  // extract course id from req.params
  const courseId = req.params.id;
  // check for valid mongo id
  const isValidmongoseId = mongoose.isValidObjectId(courseId);
  // if not valid mongo id, throw error
  if (!isValidmongoseId) {
    return res.status(400).send({ message: "invalid mongose id" });
  }
  // find course by id
  const course = await Course.findOne({ _id: courseId });
  // if not course, throw error
  if (!course) {
    return res.status(400).send({ message: "course doesnot exist" });
  }
  // extract new values from req.body
  const newValues = req.body;

  try {
    // validate new values
    await courseValidationSchema.validate(newValues);
  } catch (error) {
    // if validation fails, throw error
    return res.status(400).send({ message: error.message });
  }

  // edit course
  await Course.updateOne(
    { _id: courseId },
    {
      $set: {
        ...newValues,
      },
    }
  );
  // send response
  return res.status(201).send({ message: "course updated successfully" });
});
// delete course------------------
router.delete("/course/delete/:id", async (req, res) => {
  // extract course id
  const courseId = req.params.id;
  //   // check valide mongo id
  const isValidmongoseId = mongoose.isValidObjectId(courseId);
  //   // if not valaide throw error

  if (!isValidmongoseId) {
    return res.status(400).send({ message: "invalid mongose id" });
  }
  // find course by id
  const course = await Course.findOne({ _id: courseId });
  // if not course throw error
  if (!course) {
    return res.status(400).send({ message: "course doesnot exist" });
  }
  // delete course
  await Course.deleteOne({ _id: courseId });
  // send response
  return res.status(200).send({ message: " course deleted successfully " });
});
// courselist
router.get("/course/list", async (req, res) => {
  // extract pagination data from req.body
  const peginationData = req.body;
  // validate pagination data
  let validatedData;
  try {
    validatedData = await paginationDataValidationSchema.validate(
      peginationData
    );
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  // if validation fails,throw error
  const skip = (validatedData.page - 1) * validatedData.limit;
  // find courses
  const course = await Course.aggregate([
    { $match: {} },
    {
      $skip: skip,
    },
    {
      $limit: validatedData.limit,
    },
    {
      $project: { name: 1, dutation: 1, price: 1, tutorName: 1 },
    },
  ]);
  // send response
  return res.status(200).send({ message: "success", couseList: course });
});
export default router;
