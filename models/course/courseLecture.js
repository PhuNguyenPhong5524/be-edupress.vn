import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseSection",
    required: true
  },
  title: String,
  duration: String,
  preview: Boolean,
  vid_lectures_url: String
});

    const lectureModel = mongoose.model("Lecture", lectureSchema);
    
export default lectureModel;