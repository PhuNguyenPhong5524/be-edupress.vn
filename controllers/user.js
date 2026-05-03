import userModel from "../models/user.js";

export const createUser = async (req, res) => {
  try {
    const { email, username, password, role, flag } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const newUser = await userModel.create({
      email,
      username,
      password,
      role,
      flag
    });

    res.status(201).json({
      message: "Tạo user thành công",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

