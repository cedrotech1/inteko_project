import React, { useState, useEffect } from 'react';

const UserStatistics = () => {
  const [roleCounts, setRoleCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let token=localStorage.getItem('token');
  // Fetch the users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual token and endpoint
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        if (data.success) {
          // Process the users to count roles
          const counts = {};
          data.users.forEach((user) => {
            const role = user.role;
            counts[role] = counts[role] ? counts[role] + 1 : 1;
          });

          // Set the role counts in the state
          setRoleCounts(counts);
        } else {
          throw new Error(data.message || 'Error fetching users');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Render loading or error messages
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2 className="my-4 text-center">User Statistics</h2>
      <div className="row">
        {Object.entries(roleCounts).map(([role, count]) => (
          <div className="col-md-4" key={role}>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">{role}</h5>
                <p className="card-text text-center">
                  <strong>{count}</strong> {count === 1 ? 'user' : 'users'} 
                </p>
              </div>
              <div className="card-footer text-muted text-center">
                <small>Role Count</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatistics;
