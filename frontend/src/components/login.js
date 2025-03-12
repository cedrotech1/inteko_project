// import './App.css';
import React, { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
// import LoadingSpinner from '../../components/loading'; 

import 'react-toastify/dist/ReactToastify.css'
function Sidebar() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        toast.success(res.message);

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        const role = res.user.role;
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (role === 'admin') {
          await navigate('../statistics');
        } 
        
        else if (role === 'province_leader') {
          await navigate('../profile');
        } 
        
        else if (role === 'district_leader') {
          await navigate('../profile');
        } 
        
        else if (role === 'sector_leader') {
          await navigate('../profile');
        } 
        
        else if (role === 'cell_leader') {
          await navigate('../profile');
        } 
        
        else if (role === 'village_leader') {
          await navigate('../profile');
        } 
        
        else if (role === 'citizen') {
          await navigate('../profile');
        }
        
       
     
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating account', error);
      toast.error('Failed to create account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div class="container">

    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

       

            <div class="card mb-3">

              <div class="card-body">

                <div class="pt-4 pb-2">
                  <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                  
                </div>

                <form onSubmit={handleSubmit}   class="row g-3 needs-validation" novalidate>

                  <div class="col-12">
                    <label for="yourUsername" class="form-label">Email</label>
                    <div class="input-group has-validation">
                      <span class="input-group-text" id="inputGroupPrepend">@</span>
                      <input type="email" name="email" class="form-control" id="yourUsername" onChange={handleChange} required/>
                      <div class="invalid-feedback">Please enter your username.</div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="yourPassword" class="form-label">Password</label>
                    <input type="password" name="password" class="form-control" id="yourPassword"  onChange={handleChange} required/>
                    <div class="invalid-feedback">Please enter your password!</div>
                  </div>

                  <div class="col-12">
                    <a href='./reset'> <label class="form-check-label"  for="rememberMe">reset password</label></a>
                  </div>
                
                  <div class="col-12">
                 
                    <button  type="submit" className={`btn btn-primary d-block w-100 ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'loading....': 'login'}</button>
                  </div>
                  <div class="col-12">
                    <a href='./signup'> <label class="form-check-label"  for="rememberMe">Signup</label></a>
                  </div>
                
                </form>
              

              </div> 
            </div>
            <a  href='/'>
                                            <i class="bi bi-box-arrow-in-right"></i> Back to User pages
                                        </a>

          
          </div>
        </div>
      </div>

    </section>
    <ToastContainer />



  </div>
  );
}

export default Sidebar;
