import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash, FaEye, FaClipboardList } from "react-icons/fa";

const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1/post/`;
let token = localStorage.getItem("token");
const AUTH_TOKEN = `Bearer ${token}`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (postId, actionType, apiEndpoint, successMessage) => {
    setActionLoading((prev) => ({ ...prev, [`${postId}-${actionType}`]: true }));
    try {
      const response = await axios.put(`${API_BASE_URL}${apiEndpoint}/${postId}`, {}, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert(successMessage);
        fetchPosts();
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      alert(`Failed to ${actionType} post.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${postId}-${actionType}`]: false }));
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setActionLoading((prev) => ({ ...prev, [`${postId}-delete`]: true }));
    try {
      const response = await axios.delete(`${API_BASE_URL}delete/${postId}`, {
        headers: {
          accept: "*/*",
          Authorization: AUTH_TOKEN,
        },
      });
      if (response.status === 200) {
        alert("Post deleted successfully!");
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${postId}-delete`]: false }));
    }
  };

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="container mt-4">
      <h3 className="text-center bg-light p-3 rounded">List of Posts</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row>
            {currentPosts.map((post) => (
              <Col key={post.id} md={4} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>
                      <strong>Category:</strong> {post.category.name} <br/>
                      <strong>Status:</strong> {post.status}<span>{post.status === "approved" ? (
                        <FaCheck className="text-success ms-2" />
                      ) : (
                        <FaTimes className="text-danger ms-2" />
                      )}</span>
                      <br />
                    
                      <small className="text-muted">
                        Created: {new Date(post.createdAt).toLocaleString()}
                      </small>
                      <hr/>
                      <small className="text-muted">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
  <div><strong>Province:</strong> {post.province.name}</div>
  <div><strong>District:</strong> {post.district.name}</div>
  <div><strong>Sector:</strong> {post.sector.name}</div>
  <div><strong>Cell:</strong> {post.cell.name}</div>
  <div><strong>Village:</strong> {post.village.name}</div>
</div>

                      </small>
                    </Card.Text>

                    <div className="d-flex justify-content-between">
                      <Button variant="primary" size="sm" href={`/post/${post.id}`}>
                        <FaEye className="me-1" /> Read More
                      </Button>
                          <Button variant="info" size="sm" href={`/attandance_report/${post.id}`}>
                                                                   <FaEye className="me-1" /> Report
                                                                 </Button>
                    </div>

                  
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="me-2"
            >
              Previous
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => (indexOfLastPost < posts.length ? prev + 1 : prev))}
              disabled={indexOfLastPost >= posts.length}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostList;
