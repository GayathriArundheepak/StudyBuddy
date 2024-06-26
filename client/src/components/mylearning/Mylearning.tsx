import React, { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import api from "../../axios/api";
import "./Mylearning.scss";
import { RootState } from "../../redux/store";
import { UserSliceState } from "../../redux/user/UserSlice";
import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import ICourse from "../../interface/course/Course";

const MyLearning: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const navigate = useNavigate();
  const { currentUser }: UserSliceState = useSelector(
    (state: RootState) => state.user
  );
  const studentId = currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/student/mylearning/${studentId}`);
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          console.error("Error fetching data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const handleStartLearning = (courseId: string) => {
    navigate(`/materials/${courseId}`);
  };

  return (
    <>
      <div className="my-learning-container">
        <Navbar />
        <h2 className="my-learning-heading">My Learning</h2>
        <table className="course-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>standard</th>

              <th>Materials</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.subject}</td>
                <td>
                  {course.standard} - {course.syllabus}
                </td>

                <td>
                  <button onClick={() => handleStartLearning(course._id)}>
                    Start Learning
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      <div className=" footer-home">
        <Footer />
      </div>
      </div>
    </>
  );
};
export default MyLearning;
