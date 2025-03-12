import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/v1/notification/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-primary mb-4">
        <FaBell className="me-2" /> Notifications {" "}
        {notifications.length > 0 && (
          <Badge bg="danger">{notifications.length}</Badge>
        )}
      </h3>
      <Row>
        {notifications.length === 0 ? (
          <p className="text-muted text-center">No new notifications.</p>
        ) : (
          notifications.map((notification) => (
            <Col md={6} lg={4} key={notification.id} className="mb-3">
              <Card className={notification.isRead ? "border-secondary" : "border-warning"}>
                <Card.Body>
                  <Card.Title>
                    <FaBell className={notification.isRead ? "text-secondary" : "text-warning"} /> {" "}
                    {notification.title}
                  </Card.Title>
                  <Card.Text className="text-muted">{notification.message}</Card.Text>
                  <small className="text-muted">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </small>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  {!notification.isRead && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <FaCheck /> Read
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default Notifications;
