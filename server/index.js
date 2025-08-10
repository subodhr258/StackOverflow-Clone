import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import postRoutes from "./routes/Posts.js";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a StackOverflow clone API");
});

// Batch API endpoint
app.post("/api/batch", async (req, res) => {
  try {
    const { requests } = req.body;
    if (!requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: "Invalid batch request format" });
    }

    const responses = [];
    
    for (const request of requests) {
      try {
        const { method, url, data, headers } = request;
        
        // Create a mock request object for internal routing
        const mockReq = {
          method: method.toUpperCase(),
          url,
          body: data,
          headers: { ...req.headers, ...headers },
          params: {},
          query: {}
        };
        
        // Create a mock response object to capture the response
        let mockRes = {
          statusCode: 200,
          data: null,
          json: function(data) { this.data = data; return this; },
          status: function(code) { this.statusCode = code; return this; },
          send: function(data) { this.data = data; return this; }
        };

        // Route the request internally (simplified routing for POST requests)
        if (method.toUpperCase() === 'POST') {
          if (url.includes('/questions/Ask')) {
            // Import and call question controller
            const { AskQuestion } = await import('./controllers/Questions.js');
            await AskQuestion(mockReq, mockRes);
          } else if (url.includes('/posts/upload')) {
            // Import and call post controller
            const { uploadPost } = await import('./controllers/Posts.js');
            await uploadPost(mockReq, mockRes);
          }
          // Add more routes as needed
        }

        responses.push({
          status: mockRes.statusCode,
          data: mockRes.data
        });
      } catch (error) {
        responses.push({
          status: 500,
          error: error.message
        });
      }
    }

    res.json({ responses });
  } catch (error) {
    res.status(500).json({ error: "Batch processing failed" });
  }
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 5000;

const mongoURI = process.env.CONNECTION_URL;
mongoose.set("strictQuery", true);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
  )
  .catch((err) => console.log(err.message));
