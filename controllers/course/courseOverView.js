import courseOverviewModel from "../../models/course/courseOverview.js";

export const createCourseOverview = async (req, res) => {
  try {
    const { course_id, overview_name } = req.body;

    if (!course_id || !overview_name) {
      return res.status(400).send({
        message: "Missing course_id or overview_name"
      });
    }

    const overview = await courseOverviewModel.create({
      course_id,
      overview_name
    });

    return res.status(201).send({
      message: "Thêm overview thành công",
      data: overview
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};