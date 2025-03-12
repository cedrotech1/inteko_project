import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

const AttendancePage = () => {
  const { postID } = useParams();
  const [users, setUsers] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [penaltyText, setPenaltyText] = useState(""); // Dynamic Penalty Text
  const [showModal, setShowModal] = useState(false);
  const [selectedPenaltyID, setSelectedPenaltyID] = useState(null);
  const [status, setStatus] = useState("");
  const [postDetails, setPostDetails] = useState(null); // State to hold post details
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [usersPerPage] = useState(5); // Number of users to display per page
  const token = localStorage.getItem("token");

  const [amount, setAmount] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/fine/`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the response contains an array of fines
        if (data && data.length > 0) {
          setAmount(data[0].amount); // Set the first fine's amount
        }
      })
      .catch((error) => {
        console.error('Error fetching fine:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch users
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  useEffect(() => {
    // Fetch post details
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
    // Fetch attendance for the post
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

  useEffect(() => {
    // Fetch penalties for the post
    fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const filteredPenalties = data.filter((pen) => pen.postID == postID);
        setPenalties(filteredPenalties);
      })
      .catch((err) => console.error("Error fetching penalties:", err));
  }, [postID, token]);

  const markAttendance = async (userID) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/attandance/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID, postID, attended: true }),
      });

      const result = await response.json();
      if (response.ok) {
        setAttendanceList([...attendanceList, { id: result.id, userID, postID }]);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const deleteAttendance = async (attendanceID) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/attandance/${attendanceID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAttendanceList(attendanceList.filter((att) => att.id !== attendanceID));
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const addPenalty = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postID, penarity: penaltyText }),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error adding penalty:", error);
    }
  };

  const updatePenaltyStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/v1/penalties/update/status/${selectedPenaltyID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        const updatedPenalties = penalties.map((penalty) =>
          penalty.id === selectedPenaltyID ? { ...penalty, status } : penalty
        );
        setPenalties(updatedPenalties);
        setShowModal(false);
        // window.location.reload(); // Refresh the page after status update
      }
    } catch (error) {
      console.error("Error updating penalty status:", error);
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mark Attendance and Manage Penalties for Post</h2>

      {/* Post Details Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6">
            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h4 className="card-title text-primary">Post Details</h4>
                {postDetails ? (
                  <div>
                    <p className="card-text">
                      <strong>Title:</strong> {postDetails.title}
                    </p>
                    <p className="card-text">
                      <strong>Description:</strong> {postDetails.description}
                    </p>
                    <p className="card-text">
                      <strong>Category:</strong> {postDetails.category.name}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {postDetails.status}
                    </p>
                    <p className="card-text">
                      <strong>Posted by:</strong> {postDetails.user.firstname} {postDetails.user.lastname}
                    </p>
                    <p className="card-text">
                      <strong>User Email:</strong> {postDetails.user.email}
                    </p>
                    <div className="d-flex flex-wrap">
                      <p className="card-text me-4">
                        <strong>Created At:</strong> {new Date(postDetails.createdAt).toLocaleString()}
                      </p>
                      <p className="card-text">
                        <strong>Updated At:</strong> {new Date(postDetails.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted">Loading post details...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="card p-3 mb-4">
        <h4>Users:</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>names</th>
              <th>Email</th>
              <th>phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const attendedRecord = attendanceList.find((att) => att.userID === user.id);
              return (
                <tr key={user.id}>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    {attendedRecord ? (
                      <button className="btn btn-danger" onClick={() => deleteAttendance(attendedRecord.id)}>
                        Remove Attendance
                      </button>
                    ) : (
                      <button className="btn btn-success" onClick={() => markAttendance(user.id)}>
                        Mark as Attended
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
              <li className="page-item" key={index}>
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Penalties Section - Table View */}
      <div className="card p-3 mb-4">
        <h4>Penalties:</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User</th>
              <th>Penalty Description</th>
              <th>Status</th>
             
            </tr>
          </thead>
          <tbody>
            {penalties.map((penalty) => (
              <tr key={penalty.id}>
                <td>{penalty.user.firstname} {penalty.user.lastname}</td>
                <td>{penalty.penarity}</td>
                <td>
                  <span
                    className={`badge ${
                      penalty.status === "un paid" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {penalty.status.charAt(0).toUpperCase() + penalty.status.slice(1)}
                  </span>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Penalty Form */}
      <div className="mb-4">
        <h4>Add New Penalty:</h4>
        <Form>
          <Form.Group controlId="penaltyText">
            <Form.Label>Fine Description</Form.Label>
            <Form.Control
              type="text"
              value={amount ? `${amount} Rwf` : ''}
              disabled
              onChange={(e) => setPenaltyText(e.target.value)}
              placeholder="Enter penalty description"
            />
          </Form.Group>
          <br/>
          <Button variant="primary" onClick={addPenalty}>
            Add Penalty
          </Button>
        </Form>
      </div>

      {/* Modal for Updating Penalty Status */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Penalty Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="penaltyStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updatePenaltyStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AttendancePage;
