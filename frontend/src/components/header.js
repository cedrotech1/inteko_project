import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Image from './images.png';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const commonItems = [
  { label: "Settings", icon: "bi-gear", link: "../profile" },
  { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
];

const menuItems = {
  admin: [
    { label: "Dashboard", icon: "bi-bar-chart", link: "/statistics" },
    { label: "Add Leaders Users", icon: "bi-person-plus", link: "../addusers" },
    { label: "List of Leaders", icon: "bi-person-lines-fill", link: "../users" },
    { label: "List of citizens", icon: "bi-person-lines-fill", link: "../citizens" },
    { label: "Manage Post Types", icon: "bi-tags", link: "../post_type" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
    { label: "Fines", icon: "bi-file", link: "../fines" },
  ],
  province_leader: [
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../post" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
  ],
  district_leader: [
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../post" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
  ],
  sector_leader: [
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../post" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
  ],
  cell_leader: [
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../post" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
  ],
  village_leader: [
    { label: "Add Post", icon: "bi-pencil-square", link: "../addpost" },
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../post" },
    { label: "Report", icon: "bi-tags", link: "../report" },
    { label: "View Village Citizens", icon: "bi-person-badge", link: "../users" },
  ],
  citizen: [
    { label: "View Posts", icon: "bi-file-earmark-text", link: "../citizenpost" },
    { label: "Penalties (Fines)", icon: "bi-exclamation-circle", link: "../penarite" },
    { label: "Notifications", icon: "bi-bell", link: "../notifications" },
  ],
};

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setRole(userData.role);
      } catch (error) {
        console.error('Error parsing user object:', error);
      }
    }
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="/" className="logo d-flex align-items-center">
            <span className="d-none d-lg-block">Inteko y'baturage</span>
           
          </a>
          <i className="bi bi-list toggle-sidebar-btn" onClick={() => setShowMenu(!showMenu)}></i>
          
        </div>

        {/* Profile Section */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-1">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="../profile">
                {user ? (
                  <>
                    <img
                      src={user.image || Image}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ height: '1.2cm', width: '1.2cm' }}
                    />
                    <span className="ps-2 d-md-inline d-none">{user.firstname}</span>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar Menu */}
      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <a href="/">Inteko y'baturage</a>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-nav">
          <div style={{backgroundColor:'darkblue',color:'white',textAlign:'center',padding:'0.2cm'}}>
         <b>{role}</b>
      </div>
            <li className="nav-item">
              <a className="nav-link collapsed" href="/">
                <i className="bi bi-grid"></i>
                <span>Dashboard</span>
              </a>
            </li>
            {role && menuItems[role]?.map((menu, index) => (
              <li className="nav-item" key={index}>
                <a className="nav-link collapsed" href={menu.link}>
                  <i className={menu.icon}></i>
                  <span>{menu.label}</span>
                </a>
              </li>
            ))}

{commonItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <a className="nav-link collapsed" href={item.link}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
