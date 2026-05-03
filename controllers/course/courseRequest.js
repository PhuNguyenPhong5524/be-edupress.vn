import courseRequestModel from "../../models/course/courseRequest.js";

export const createCourseRequest = async (req, res) => {
  try {
    const { course_id, request_name } = req.body;

    if (!course_id || !request_name) {
      return res.status(400).send({
        message: "Missing course_id or request_name"
      });
    }

    const request = await courseRequestModel.create({
      course_id,
      request_name
    });

    return res.status(201).send({
      message: "Thêm requirement thành công",
      data: request
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};