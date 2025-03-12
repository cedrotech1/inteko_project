import React, { useState, useEffect } from "react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "citizen",
    gender: "Male",
  });

  const [message, setMessage] = useState("");
  let token = localStorage.getItem('token');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/addUser`, {
        method: "POST",
        headers: {
          "accept": "*/*",
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("User added successfully!");
      } else {
        setMessage(data.message || "Failed to add user.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container memberx mt-5">
      <h2 className="text-center mb-4">Add User</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input type="text" name="firstname" className="form-control" placeholder="First Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="lastname" className="form-control" placeholder="Last Name" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" name="phone" className="form-control" placeholder="Phone" onChange={handleChange} required />
        </div>
       


        <div className="col-md-6">
        <label>
          Select Gender:
          <select required className="form-control" onChange={handleChange}>
            <option value="" disabled>-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        </div>

 

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">Add User</button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
