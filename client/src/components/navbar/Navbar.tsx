import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { UserSliceState } from "../../redux/user/UserSlice";
import { RootState } from "../../redux/store";
import "./Navbar.scss";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import api from "../../axios/api";
import Search from "../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoursesStart,
  fetchCoursesSuccess,
} from "../../redux/course/CourseSlice"; // Import the fetchCoursesStart action
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Navbar: React.FC = () => {
  const { currentUser }: UserSliceState = useSelector(
    (state: RootState) => state.user
  );
  const userType: string =
    useSelector((state: RootState) => state.user.userType) || "student";
  const profilePicSrc = currentUser?.profilePic 
    ? currentUser?.profilePic
    : "/images/DefaultProfilePic.jpg";
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  console.log(searchResults)
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Construct the profile link based on the user's type
  const profileLink =
    userType === "admin"
      ? "/adminProfile"
      : userType === "teacher"
      ? "/teacherProfile"
      : "/profile";

  const isLoggedIn = currentUser;
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = async (query: string) => {
    console.log("query:", query);
    try {
      dispatch(fetchCoursesStart());
      // Call the API with the search query
      const response = await api.get("/api/course/search-course", {
        params: {
          query: query, // Pass the search query as a parameter
        },
      });
      const searchData = response.data;
      dispatch(fetchCoursesSuccess(response.data));
      navigate("/subjects");

      // Update search results state with data from API
      setSearchResults(searchData);
    } catch (error) {
      console.error("Error searching courses:", error);
    }
  };
  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/#about");
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className={`navbar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <h1 className="logo">StudyBuddy</h1>

      <div className={`sidebar  ${sidebarOpen ? "sidebar-open" : ""}`}>
        <button
          className="sidebar-toggle menuIcon"
          onClick={handleToggleSidebar}
        >
          {!sidebarOpen && <MenuIcon />}
        </button>

        <div className="link-container">
          <button className="sidebar-toggle " onClick={handleToggleSidebar}>
            {sidebarOpen && <CloseIcon />}
          </button>
          <div className="searchbar">
            <Search onSearch={handleSearch} />
          </div>

          <ul className="nav-links">
            <li className="home-link">
              <Link to="/">Home</Link>
            </li>
            {userType === "student" && (
              <li>
                <Link to="/courses">Courses</Link>
              </li>
            )}

            {userType !== "teacher" && userType !== "admin" && (
              <li>
                <a href="#about" onClick={handleAboutClick}>
                  About
                </a>
              </li>
            )}

            {isLoggedIn && userType === "student" && (
              <>
                <li>
                  <Link to="/mylearnings">
                    <AutoStoriesIcon />
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    <ShoppingCartOutlined />
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist">
                    <FavoriteSharpIcon />
                  </Link>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/signin">Signin</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li>
                <Link to={profileLink}>
                  <img
                    className="profile-pic"
                    src={profilePicSrc}
                    alt="Profile pic"
                  />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
