import mongoose from "mongoose";
// set rules
const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true, //index
    lowercase: true,
  },
  contactNumber: {
    type: String,
    required: false,
    trim: true,
    maxlength: 15,
    minlength: 7,
  },
  isGratuated: {
    type: Boolean,
    required: false,
  },
});
// create table
const Student = mongoose.model("Student", studentSchema);
export default Student;
