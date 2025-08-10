import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/logo.png";
import search from "../../assets/search-solid.svg";
import Avatar from "../../components/Avatar/Avatar";
import "./Navbar.css";
import { setCurrentUser } from "../../actions/currentUser";
import { client } from "../../api";
import decode from "jwt-decode";

const NavBar = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  var User = useSelector((state) => state.currentUserReducer);

  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setCurrentUser(null));
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
  }, [dispatch, User?.token, handleLogout]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      // Use the new API client with debouncing for search
      await client.get('/api/search', { q: query });
    } catch (error) {
      console.log('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or perform search action
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
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
            {isSearching && <span className="search-loading">...</span>}
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
