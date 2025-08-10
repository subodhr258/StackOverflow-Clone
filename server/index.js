import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import postRoutes from "./routes/Posts.js";
// Import controllers for batch processing
import { AskQuestion } from "./controllers/Questions.js";
import { uploadPost } from "./controllers/Posts.js";

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
    
    // Route mapping for batch processing
    const routeMap = {
      'POST /questions/Ask': AskQuestion,
      'POST /posts/upload': uploadPost,
      // Add more routes as needed
    };
    
    for (const request of requests) {
      try {
        const { method, url, data, headers } = request;
        
        // Create a more complete mock request object for internal routing
        const mockReq = {
          method: method.toUpperCase(),
          url,
          originalUrl: url,
          path: url.split('?')[0],
          body: data || {},
          headers: { ...req.headers, ...headers },
          params: {},
          query: {},
          ip: req.ip || '127.0.0.1',
          protocol: req.protocol || 'http',
          hostname: req.hostname || 'localhost',
          get: function(header) { return this.headers[header.toLowerCase()]; },
          // Add any additional Express request properties as needed
        };
        
        // Create a mock response object to capture the response
        let mockRes = {
          statusCode: 200,
          data: null,
          headers: {},
          json: function(data) { this.data = data; return this; },
          status: function(code) { this.statusCode = code; return this; },
          send: function(data) { this.data = data; return this; },
          setHeader: function(name, value) { this.headers[name] = value; return this; },
          // Add any additional Express response properties as needed
        };

        // Route the request using the route mapping
        const routeKey = `${method.toUpperCase()} ${url}`;
        const handler = routeMap[routeKey];
        
        if (handler) {
          await handler(mockReq, mockRes);
        } else {
          // Handle unmapped routes
          mockRes.statusCode = 404;
          mockRes.data = { error: `Route ${routeKey} not found in batch handler` };
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
