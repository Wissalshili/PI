require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.development", 
});
const express = require("express"); 
const cors = require("cors"); 
const mongoose = require("mongoose"); 
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://mohamedjasser:L8xe0h4ZuPBa2yPq@backendnodejs.4fkx6tv.mongodb.net/", {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); 
db.once("open", () => {
});
app.get("/", (req, res) => {
  res.send("Backend is running"); 
});

const authRouter = require("./routes/auth"); 
app.use("/api/auth", authRouter); 

const tasksRouter = require("./routes/tasks"); 
app.use("/api", tasksRouter); 

const port = process.env.PORT || 3001; 
app.listen(port, () => {
  console.log("Server listening the port " + port); 
});
