import { useCallback, useEffect, useState } from "react";
import "./SubjectsPage.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Icons from "../../../../components/icons/Icons";
import ICourse from "../../../../interface/course/Course";
import VideoPreview from "../../../../components/videoPreview/VideoPreview";
import Navbar from "../../../../components/navbar/Navbar";
import api from '../../../../axios/api';
import { UserSliceState } from "../../../../redux/user/UserSlice";


function SubjectsPage(): JSX.Element {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [teacherNames, setTeacherNames] = useState<{ [key: string]: string }>({});
  const { currentUser }: UserSliceState = useSelector((state: RootState) => state.user);
  const courses: ICourse[] = useSelector(
    (state: RootState) => state.course.courses
  ) as unknown as ICourse[]; // No need for type assertion

  const fetchTeacherName = useCallback(async (teacherId: string) => {
    if (teacherNames[teacherId]) {
      return; // Already fetched
    }
    try {
      const response = await api.get(`/api/teacher/${teacherId}`);
      setTeacherNames(prevState => ({
        ...prevState,
        [teacherId]: response.data.data.username,
      }));
    } catch (error) {
      console.error(`Error fetching teacher with id ${teacherId}:`, error);
      setTeacherNames(prevState => ({
        ...prevState,
        [teacherId]: "Unknown",
      }));
    }
  }, [teacherNames]);

  useEffect(() => {
    courses.forEach(course => {
      if (course.teacher_id) {
        fetchTeacherName(course.teacher_id);
      }
    });
  }, [courses,fetchTeacherName]);

  const handleRowClick = (index: number) => {
    const selectedIndex = selectedRows.indexOf(index);
    const newSelectedRows =
      selectedIndex === -1
        ? [...selectedRows, index]
        : selectedRows.filter((rowIndex) => rowIndex !== index);

    setSelectedRows(newSelectedRows);
  };
 

  return (
    <>
 
      <div className="subjects-page">
        <Navbar />
        <div className="card-container">
          <div className="card">
            <div className="card-header">
              <h3>Subject</h3>
              <h3>Teacher</h3>
              <h3>Course Title (Description)</h3>
              <h3>Price</h3>
              <h3>Slot</h3>
              <h3>Available</h3>
              <h3>Review</h3>
              <h3>Promotion Video</h3>
              <h3>Actions</h3>
            </div>
          </div>
          {courses &&
            courses.map((course, index) => (
              <div
                key={index}
                className={`card ${
                  selectedRows.includes(index) ? "selected-card" : ""
                }`}
                onClick={() => handleRowClick(index)}
              >
                <div className="card-content">
                  <h3>{course.subject} <h6>({course.standard} - {course.syllabus})</h6> </h3>
                  <p>{course.teacher_id ? teacherNames[course.teacher_id] || "Loading..." : "Unknown"}</p>
                  <h3>{course.course_title}</h3>
                  <p>
                    <strong>Price:</strong> {course.prize}
                  </p>
                  {course.slot && (
                    <p>
                      {course.slot.time || null} <br />
                      {course.slot.day.join("-")}
                    </p>
                  )}
                  <p>
                    <strong>Available:</strong>{" "}
                    {course.isAvailable ? "YES" : "NO"}
                  </p>
                  <p>
                    <strong>Review:</strong>Reviews
                  </p>
                  <div className="promotion_video">
                    {course.promotion_video && (
                      <div className="video-preview">
                        <VideoPreview videoUrl={course.promotion_video} />
                      </div>
                    )}
                  </div>
                  <div >
                    { currentUser && currentUser._id && course.students_list.includes(currentUser?._id )?
                    <p>Entrolled</p> :
                    <Icons courseId={course._id} />
                    }
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default SubjectsPage;
