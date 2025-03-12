import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [role, setRole] = useState(null); // Initialize role state

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



useEffect(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      const user = JSON.parse(userString);
      setRole(user.role); // Set role state based on user object
    } catch (error) {
      console.error('Error parsing user object:', error);
    }
  } else {
    console.error('User object not found in local storage');
  }
}, []);









  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setLoading(false);
      } else {
        toast.error('Failed to fetch users');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User added successfully');
        setNewUser({ firstname: '', lastname: '', phone: '', email: '' });
        fetchUsers(); // Refresh the list of users
      } else {
        toast.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    }
  };
  const handleView = (id) => {
    navigate(`../oneUser/${id}`);
  };


  
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">users</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4"></div>
            <div className="col-md-4">

            {role === 'admin' && (
              <button type="button" className="btn btn-primary col-md-12" data-bs-toggle="modal" data-bs-target="#disablebackdrop">
                Add Users
              </button>
                 )}



            </div>
          </div>

          <div className="modal fade" id="disablebackdrop" tabIndex="-1" data-bs-backdrop="false">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">ADD USERS</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="row mb-3">
                          <div className="col-sm-12">
                            <br/>
                            <div className="form-floating mb-3">
                              <input type="text" className="form-control" name="firstname" placeholder="First Name" value={newUser.firstname} onChange={handleInputChange} />
                              <label htmlFor="floatingInput">First Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input type="text" className="form-control" name="lastname" placeholder="Last Name" value={newUser.lastname} onChange={handleInputChange} />
                              <label htmlFor="floatingInput">Last Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input type="text" className="form-control" name="phone" placeholder="Phone" value={newUser.phone} onChange={handleInputChange} />
                              <label htmlFor="floatingInput">Phone</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input type="email" className="form-control" name="email" placeholder="name@example.com" value={newUser.email} onChange={handleInputChange} />
                              <label htmlFor="floatingInput">Email address</label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                  <button type="submit"  onClick={handleAddUser} className={`btn btn-primary d-block   ${loading ? 'loading' : ''}`} disabled={loading}>
                              {loading ? 'loading....' : 'save'}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
<br/>

{users.length > 0 ? (
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body table-responsive">
                  <h5 className="card-title">List of Users</h5>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <table className="table datatable">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>role</th>
                          <th>action</th>
                
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.id}>
                            <td>{`${user.firstname} ${user.lastname}`}</td>
                            <td>{user.email}</td>
                            <td>{`${user.role}`}</td>
                            <td>
                                <button className='btn btn-outline-primary' onClick={() => handleView(user.id)}>view</button>
                              </td>
                  
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
            ) : (
              <div class="row">
              <div class="col-lg-12">
          
                <div class="card" style={{padding:'0.5cm'}}>
                  <div class="card-body">
                    <h5 class="card-title" >
                      <center>
                      there is no citizen registered!
                      </center>
                      </h5>
                    <p></p>
                  </div>
                </div>
          
              </div>
          
            
            </div>
            )}

        <ToastContainer />
      </main>
    </>
  );
}

export default Home;
