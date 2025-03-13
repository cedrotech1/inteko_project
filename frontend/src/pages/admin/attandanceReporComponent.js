import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendancePage = () => {
  const { postID } = useParams();
  const [attendanceList, setAttendanceList] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/one/${postID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPostDetails(data.data);
      })
      .catch((err) => console.error("Error fetching post details:", err));
  }, [postID, token]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/attandance`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredAttendance = data.filter((att) => att.postID == postID);
        setAttendanceList(filteredAttendance);
      })
      .catch((err) => console.error("Error fetching attendance:", err));
  }, [postID, token]);

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      attendanceList.map((att) => ({
        Names: `${att.user.firstname} ${att.user.lastname}`,
        Email: att.user.email,
        Phone: att.user.phone,
        "ID Number": att.user.nid,
        "Post Title": att.post.title,
        "Attendance Status": att.attended ? "Present" : "Absent",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(data, `Attendance_${postID}.xlsx`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Attendance report for Post</h2>

      <div className="card shadow-lg mb-4">
        <div className="card-body">
          <h4 className="card-title text-primary">Post Details</h4>
          {postDetails ? (
            <div>
              <p><strong>Title:</strong> {postDetails.title}</p>
              <p><strong>Description:</strong> {postDetails.description}</p>
              <p><strong>Category:</strong> {postDetails.category.name}</p>
              <p><strong>Status:</strong> {postDetails.status}</p>
              <p><strong>Posted by:</strong> {postDetails.user.firstname} {postDetails.user.lastname}</p>
              <p><strong>User Email:</strong> {postDetails.user.email}</p>
            </div>
          ) : (
            <p className="text-muted">Loading post details...</p>
          )}
        </div>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Attended Users:</h4>
          <button className="btn btn-success" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Names</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ID Number</th>
              <th>Post Title</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.length > 0 ? (
              attendanceList.map((att) => (
                <tr key={att.id}>
                  <td>{att.user.firstname} {att.user.lastname}</td>
                  <td>{att.user.email}</td>
                  <td>{att.user.phone}</td>
                  <td>{att.user.nid}</td>
                  <td>{att.post.title}</td>
                  <td>{new Date(att.createdAt).toLocaleString()}</td>

                  <td>{att.attended ? "Present" : "Absent"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
