require("dotenv").config();
const app = require("express")();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { DB_PASSWORD, DB_URI, DB_USERNAME } = process.env;
// Connect to database
mongoose.connect(
  // "mongodb://localhost:27017/pesaclub",
  `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_URI}`,
  {
    useNewUrlParser: true
  }
);

// Logging and Parsing
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle CORS
app.use((req, res, next) => {
  res.header("Access-Controll-Allow-Origin", "*");
  res.header("Access-Controll-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Controll-Allow-Methods", "*");
    return res.status(200).json({});
  }
  next();
});

// Import routes
const pesaformRoutes = require("./api/routes/pesaform_routes");
const usersRoutes = require("./api/routes/users_routes");

// Routes handling
app.use("/api/pesaform", pesaformRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
module.exports = app;
