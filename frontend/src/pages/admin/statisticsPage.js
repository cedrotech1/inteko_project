import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Statistics from './statistics';
import PostStatistics from './postStatistics';

function Home() {

  
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Users Page</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active">statistics</li>
            </ol>
          </nav>
        </div>
        <Statistics/>
        <PostStatistics/>
     
      </main>
    </>
  );
}

export default Home;
