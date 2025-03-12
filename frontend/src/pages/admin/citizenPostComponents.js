import { useEffect, useState } from "react";
import { Card, Spinner, Container, Row, Col, Badge, Button } from "react-bootstrap";
import { CheckCircleFill, ExclamationCircleFill, ExclamationTriangleFill, InfoCircle } from "react-bootstrap-icons";

const CitizenPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/post/citizen`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.success) {
          setPosts(result.data);
        } else {
          setPosts([]); // Ensure an empty array instead of setting an error
        }
      } catch (error) {
        setPosts([]); // Handle the error by showing no posts
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">📢 Citizen Posts</h1>
      <Row>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Col key={post.id} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.description}</Card.Text>
                  {/* <p><strong>Status:</strong> <Badge bg="success">{post.status}</Badge></p> */}
                  {post.attendances.length > 0 ? (
                    <p className="text-success fw-bold">
                      <CheckCircleFill className="me-1" /> You attended this meeting.
                    </p>
                  ) : post.penalties.length > 0 ? (
                    post.penalties[0].status === "un paid" ? (
                      <p className="text-danger fw-bold">
                        <ExclamationCircleFill className="me-1" /> Penalty: {post.penalties[0].penarity} (Not yet paid)
                      </p>
                    ) : (
                      <p className="text-success fw-bold">
                        <CheckCircleFill className="me-1" /> Penalty {post.penalties[0].penarity} paid successfully!
                      </p>
                    )
                  ) : (
                    <p className="text-warning fw-bold">
                      <ExclamationTriangleFill className="me-1" /> You did not attend this meeting!
                    </p>
                  )}
                  <Button variant="primary" href={`/post/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <InfoCircle size={40} className="text-info mb-2" />
                <h4>No approved posts yet!</h4>
                <p>Check back later for updates.</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CitizenPosts;
