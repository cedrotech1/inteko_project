// import './App.css';
import React, { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,useParams} from 'react-router-dom';
// import LoadingSpinner from '../../components/loading'; 

import 'react-toastify/dist/ReactToastify.css'
function Sidebar() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [formData, setFormData] = useState({
    code: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/users/code/${email}`, {
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        await navigate(`../resetPassword/${email}`);

      
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

               

                <form onSubmit={handleSubmit}   class="row g-3 needs-validation" novalidate>

                  <div class="col-12">
                    {/* <label for="yourUsername" class="form-label">code</label> */}
                    <br/>
                    <div class="input-group has-validation">
                      <span class="input-group-text" id="inputGroupPrepend">code</span>
                      <input type="number" name="code" class="form-control" id="yourUsername" onChange={handleChange} required/>
                      <div class="invalid-feedback">Please enter your username.</div>
                    </div>
                  </div>

               
                  <div class="col-12">
               
                  </div>
                  <div class="col-12">
                  <button  type="submit" className={`btn btn-primary d-block w-100 ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'loading....': 'check code'}</button>
                  </div>
                
                </form>

              </div>
            </div>

          
          </div>
        </div>
      </div>

    </section>
    <ToastContainer />



  </div>
  );
}

export default Sidebar;
