import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaExclamationTriangle, FaCheckCircle, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const UserPenalties = () => {
  const { userID } = useParams();
  const [penalties, setPenalties] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch penalties");
        }

        const data = await response.json();
        const filteredPenalties = data.filter((penalty) => penalty.userID == userID);
        setPenalties(filteredPenalties);
      } catch (error) {
        console.error("Error fetching penalties:", error);
      }
    };

    fetchPenalties();
  }, [userID, token]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 d-flex align-items-center">
        <FaUser className="text-primary me-2" /> Penalties for User 
      </h2>
      {penalties.length > 0 ? (
        <div className="row">
          {penalties.map((penalty) => (
            <div key={penalty.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm border-start border-danger">
                <div className="card-body">
                  <h5 className="card-title">{penalty.penarity}</h5>
                  <p className="card-text">
                    <strong>Status:</strong>{" "}
                    {penalty.status !== "offered" ? (
                      <span className="badge bg-success">
                        <FaCheckCircle className="me-1" /> Resolved
                      </span>
                    ) : (
                      <span className="badge bg-danger">
                        <FaExclamationTriangle className="me-1" /> Pending
                      </span>
                    )}
                  </p>
                  <p className="card-text">
                    <strong>Post Title:</strong> <span className="text-primary">{penalty.post.title}</span>
                  </p>
                  <p className="card-text">
                    <strong>Meeting at:</strong> {new Date(penalty.post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted">No penalties found for this user.</p>
      )}
    </div>
  );
};

export default UserPenalties;
