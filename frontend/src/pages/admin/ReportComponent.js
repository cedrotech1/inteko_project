import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { FaMoneyBillAlt, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"; // FontAwesome icons

const PenaltiesReport = () => {
  const [penalties, setPenalties] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      setError("");

      const formattedStartDate = startDate ? new Date(startDate).toISOString().substring(0, 10) : "";
      const formattedEndDate = endDate ? new Date(endDate).toISOString().substring(0, 10) : "";
      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties/bylocation`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate: formattedStartDate, endDate: formattedEndDate },
      });

      setPenalties(response.data.data);
      setStatistics(response.data.statistics);
    } catch (err) {
      setError("Failed to fetch penalties");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = penalties.slice(indexOfFirstItem, indexOfLastItem);

  const exportToExcel = () => {
    const formattedData = penalties.map((penalty) => ({
      User: `${penalty.user.firstname} ${penalty.user.lastname}`,
      Email: `${penalty.user.email}`,
      Phone: `${penalty.user.phone}`,
      Penalty: `$${penalty.penarity}`,
      Status: penalty.status,
      Date: new Date(penalty.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penalties");

    // Create and download the Excel file
    XLSX.writeFile(wb, "PenaltiesReport.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Penalties Report</h2>

      {/* Date Filters */}
    

      {/* Statistics */}
      {statistics && (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <FaMoneyBillAlt size={40} className="" style={{marginTop:'0.5cm'}}/>
                <Card.Title>Total Amount</Card.Title>
                <h3>{statistics.totalAmount} Rwf</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <FaCheckCircle size={40} className="text-success" style={{marginTop:'0.5cm'}} />
                <Card.Title>Paid</Card.Title>
                <h3>{statistics.paidCount}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <FaTimesCircle size={40} className="text-danger" style={{marginTop:'0.5cm'}}/>
                <Card.Title>Unpaid</Card.Title>
                <h3>{statistics.unpaidCount}</h3>
              </Card.Body>
            </Card>
          </Col>
       
        </Row>
      )}
       <Button onClick={exportToExcel} variant="success" className="mt-1 my-2">Download as Excel</Button>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Penalties Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>names</th>
                <th>email</th>
                <th>phone</th>
                <th>fines</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((penalty) => (
                <tr key={penalty.id}>
                  <td>{penalty.user.firstname} {penalty.user.lastname}</td>
                  <td>{penalty.user.email} </td>
                  <td>{penalty.user.phone}</td>
                  <td>{penalty.penarity} Rwf</td>
                  <td>
                    <span className={`badge ${penalty.status === "paid" ? "bg-success" : "bg-danger"}`}>
                      {penalty.status}
                    </span>
                  </td>
                  <td>{new Date(penalty.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          variant="outline-secondary"
        >
          Previous
        </Button>
        <span className="align-self-center">Page {currentPage}</span>
        <Button
          disabled={indexOfLastItem >= penalties.length}
          onClick={() => setCurrentPage(currentPage + 1)}
          variant="outline-secondary"
        >
          Next
        </Button>
      </div>

      {/* Download Button */}
     
    </div>
  );
};

export default PenaltiesReport;
