import mongoose from "mongoose";
export const validateMongoseIdFromReqParams = (req, res, next) => {
  // extract id from params
  const studentId = req.params.id;
  // validate mongo id
  const isValidMongoseId = mongoose.isValidObjectId(studentId);
  // if not throw error
  if (!isValidMongoseId) {
    return res.status(400).send({ message: "invalid mongoose id" });
  }
  // call next function
  next();
};
