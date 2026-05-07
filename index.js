import express from 'express';
import mongoose from 'mongoose';
import categoryRouter from './routes/category.js';
import routerUser from './routes/user.js';
import routerProvider from './routes/provider.js';
import routerCourse from './routes/course.js';
import routerLogin from './routes/login.js';
import routerRegister from "./routes/register.js"
import cors from "cors";

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());

mongoose.connect(
    `mongodb://127.0.0.1:27017/edupress`
)

app.get('/', (req, res) => {
  res.status(200).send({ 
    message: 'Chào mừng bạn đến với web học Edupress' 
  });
});

// Danh mục
  app.use('/', categoryRouter);
// Tài khoản
  app.use('/', routerUser);
// Nhà cung cấp
  app.use('/', routerProvider);
// Khóa học
  app.use('/', routerCourse);
// Đăng nhập
  app.use('/', routerLogin);
// Đăng ký
  app.use('/', routerRegister);

app.listen(PORT, (req, res) => {  
  console.log(`Server is running on port ${PORT}`);
});