import { useEffect, useState } from "react";
import { Card, Container, Spinner, Badge, Alert, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { ExclamationCircleFill, CheckCircleFill, ExclamationTriangleFill, Calendar2EventFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FinesList = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties/mypenarities`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          setPenalties(result);
        } else {
          setError("No fines found.");
        }
      } catch (error) {
        setError("Failed to fetch fines.");
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, []);

  const handlePayPenalty = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/penalties/pay`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          penaltyID: selectedPenalty.id,
          number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setPenalties((prevPenalties) =>
          prevPenalties.map((penalty) =>
            penalty.id === selectedPenalty.id ? { ...penalty, status: "paid" } : penalty
          )
        );
        setShowModal(false);
      } else {
        toast.error("Failed to pay penalty, please try again.");
      }
    } catch (error) {
      toast.error("Error processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">🚨 My Fines</h1>
      <Row>
        {penalties.map((penalty) => (
          <Col md={6} lg={4} key={penalty.id} className="mb-4">
            <Card className="shadow-lg">
              <Card.Body>
                <Card.Title>Penalty on post <hr /></Card.Title>

                <p className="text-muted">
                  {penalty.post.title} post On:{" "}
                  {new Date(penalty.post.createdAt).toLocaleDateString()}
                </p>

                <strong>Status:</strong>{" "}
                <Badge bg={penalty.status === "un paid" ? "warning" : "success"}>
                  {penalty.status}
                </Badge>

                {/* Date Fine Was Offered */}
                <p className="text-muted">
                  <Calendar2EventFill className="me-1" /> Offered On:{" "}
                  {new Date(penalty.createdAt).toLocaleDateString()}
                </p>

                {/* Penalty Information */}
                {penalty.status === "un paid" ? (
                  <>
                    <p className="text-danger fw-bold">
                      <ExclamationCircleFill className="me-1" /> Fine: {penalty.penarity} (un paid)
                    </p>
                    <Alert variant="warning">
                      <ExclamationTriangleFill className="me-1" /> You must go to the village to report about this fine.
                    </Alert>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedPenalty(penalty);
                        setShowModal(true);
                      }}
                    >
                      Pay Fine
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-success fw-bold">
                      <CheckCircleFill className="me-1" /> Fine {penalty.penarity} Paid!
                    </p>
                    <Alert variant="success">
                      <CheckCircleFill className="me-1" /> Congratulations! Your penalty has been resolved.
                    </Alert>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pay Penalty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={handlePayPenalty}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Pay Now"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
         <ToastContainer />
      
    </Container>
  );
};

export default FinesList;
