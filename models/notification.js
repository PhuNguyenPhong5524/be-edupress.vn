import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, 
    title: { type: String, required: true },
    message: { type: String, required: true },
    ref_id: { type: mongoose.Schema.Types.ObjectId }, 
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);