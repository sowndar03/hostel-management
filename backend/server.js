require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const loginRoutes = require('./Routes/loginroutes');
const userRoutes = require('./Routes/userroutes');
const masterRoutes = require('./Routes/masterroutes');
const notificationRoutes = require('./Routes/notificationroutes');
const cors = require('cors');
const middleware = require('./Middleware/Middleware');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(helmet());
app.use(express.json());

const middlewares = [middleware.AuthMiddleware];

app.use('/api/login', loginRoutes);
app.use('/api/user', middlewares, userRoutes);
app.use('/api/notification', middlewares, notificationRoutes);

//Master Data
app.use('/api/master', middlewares, masterRoutes);

mongoose.connect(DB_URL)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('DB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
