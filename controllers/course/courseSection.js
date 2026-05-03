import courseSectionModel from "../../models/course/courseSection.js";

export const createCourseSection = async (req, res) => {
  try {
    const { course_id, chapter_title } = req.body;

    if (!course_id || !chapter_title) {
      return res.status(400).send({
        message: "Missing course_id or chapter_title"
      });
    }

    const section = await courseSectionModel.create(req.body);

    return res.status(201).send({
      message: "Tạo section thành công",
      section
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};