import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import search from "../../assets/search-solid.svg";
import Avatar from "../../components/Avatar/Avatar";
import "./Navbar.css";
import { setCurrentUser } from "../../actions/currentUser";
import { searchQuestions } from "../../api";
import decode from "jwt-decode";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var User = useSelector((state) => state.currentUserReducer);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [dispatch, User?.token, navigate]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      searchQuestions(searchQuery)
        .then((response) => {
          setSearchResults(response.data || []);
          setShowResults(true);
        })
        .catch((error) => {
          console.log("Search error:", error);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <Link to="/" className="nav-item nav-logo">
          <img src={logo} alt="logo" />
        </Link>
        <Link to="/" className="nav-item nav-btn">
          About
        </Link>
        <Link to="/" className="nav-item nav-btn">
          Products
        </Link>
        <Link to="/" className="nav-item nav-btn">
          For Teams
        </Link>
        <form onSubmit={handleSearchSubmit}>
          <div className="form-contents">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <img src={search} alt="search" width="18" className="search-icon" />
            {showResults && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.slice(0, 5).map((result, index) => (
                  <div 
                    key={index} 
                    className="search-result-item"
                    onClick={() => {
                      navigate(`/Questions/${result._id}`);
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    {result.questionTitle}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        {User === null ? (
          <Link to="/Auth/Login" className="nav-item nav-links">
            Log in
          </Link>
        ) : (
          <div className="nav-avatar-btn">
            <Avatar
              backgroundColor="#009dff"
              px="10px"
              py="5px"
              borderRadius="50px"
              color="white"
            >
              <Link
                to={`/Users/${User?.result?._id}`}
                style={{ color: "white", textDecoration: "None" }}
              >
                {User?.result?.name.charAt(0).toUpperCase()}
              </Link>
            </Avatar>
            <button className="nav-item nav-links" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
