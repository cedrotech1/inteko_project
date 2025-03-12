import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FineControl = () => {
  const [fineAmount, setFineAmount] = useState(null);
  const [newAmount, setNewAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");


  const API_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/fine/`;
  const UPDATE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/fine/update`;
 
  useEffect(() => {
    const fetchFine = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });
        const data = await response.json();
        if (data.length > 0) {
          setFineAmount(data[0].amount);
        }
      } catch (error) {
        console.error("Error fetching fine:", error);
      }
    };

    fetchFine();
  }, []);

  // Handle update fine
  const updateFine = async () => {
    if (!newAmount) return;
    setLoading(true);

    try {
      const response = await fetch(UPDATE_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      const result = await response.json();
      if (response.ok) {
        setFineAmount(newAmount);
        setMessage(result.message);
      } else {
        setMessage("Failed to update fine.");
      }
    } catch (error) {
      console.error("Error updating fine:", error);
      setMessage("Error updating fine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center  bg-light">
      <div className="card shadow-lg p-4" style={{ width: "350px", borderRadius: "15px" }}>
        <h2 className="text-center text-primary mb-3">📌 Fine Control</h2>

        <div className="text-center text-secondary mb-4">
          <p>Current Fine: <span className="fw-bold text-dark">{fineAmount} Rwf</span></p>
        </div>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter new fine amount"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
        />

        <button
          onClick={updateFine}
          disabled={loading}
          className="btn btn-primary w-100"
        >
          {loading ? "Updating..." : "Update Fine 💰"}
        </button>

        {message && (
          <p className="mt-3 text-center text-success fw-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default FineControl;
