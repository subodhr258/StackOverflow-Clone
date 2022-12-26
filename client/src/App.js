import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AllRoutes from "./AllRoutes";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";
import { fetchAllPosts } from "./actions/posts";
import Chatbot from "./components/Chatbot/Chatbot";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Chatbot />
        <AllRoutes />
      </Router>
    </div>
  );
}

export default App;
