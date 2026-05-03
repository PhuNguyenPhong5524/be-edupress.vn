import lectureModel from "../../models/course/courseLecture.js";

export const createCourseLecture = async (req, res) => {
  try {
    const { section_id, title, duration } = req.body;

    if (!section_id || !title || !duration) {
      return res.status(400).send({
        message: "Missing required fields"
      });
    }

    const lecture = await lectureModel.create(req.body);

    return res.status(201).send({
      message: "Tạo lecture thành công",
      lecture
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};
``