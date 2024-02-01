const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const signupController = require("./controllers/signupController");
const signinController = require("./controllers/signinController");

const app = express();
const PORT = process.env.PORT || 5008;

app.use(cors());
app.use(bodyParser.json());

// Define the Job schema
const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Create a mongoose model for jobs
const Job = mongoose.model("Job", jobSchema);

mongoose.connect(
  "mongodb+srv://diptosarker:Dipto2018331034@cluster0.pwg8g6g.mongodb.net/your-database-name?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB!");

  // Ensure the Job model is defined
  try {
    // Check if there are existing jobs
    const existingJobs = await Job.find();
    if (existingJobs.length === 0) {
      const defaultJobs = [
        { title: "Job 1", description: "This is the first job" },
        { title: "Job 2", description: "This is the second job" },
        { title: "Job 3", description: "This is the third job" },
        { title: "Job 4", description: "This is the fourth job" },
        // Add more default jobs as needed
      ];

      await Job.insertMany(defaultJobs);
      console.log("Default jobs added successfully");
    }
  } catch (error) {
    console.error("Error adding default jobs:", error);
  }
});

// Rest of your code remains unchanged...

// Endpoint to get all jobs
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving jobs", error: error.message });
  }
});

// Endpoint to add a new job
app.post("/jobs", async (req, res) => {
  const { title, description } = req.body;

  try {
    const newJob = new Job({ title, description });
    await newJob.save();
    res.json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Error adding job", error: error.message });
  }
});

// Endpoint to delete a job
app.delete("/jobs/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (deletedJob) {
      res.json({ message: "Job deleted successfully", job: deletedJob });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting job", error: error.message });
  }
});

// Endpoint to edit a job
app.put("/jobs/:id", async (req, res) => {
  const jobId = req.params.id;
  const { title, description } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { title, description },
      { new: true }
    );
    if (updatedJob) {
      res.json({ message: "Job updated successfully", job: updatedJob });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating job", error: error.message });
  }
});

app.post("/signup", signupController);
app.post("/signin", signinController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
