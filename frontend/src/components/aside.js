import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setRole(user.role);
      } catch (error) {
        console.error("Error parsing user object:", error);
      }
    }
  }, []);

  // Common menu items
  const commonItems = [
    { label: "Settings", icon: "bi-gear", link: "../profile" },
    { label: "Logout", icon: "bi-box-arrow-right", link: "../logout" },
  ];

  // Role-based menu items
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

  return (
    <aside id="sidebar" className="sidebar">
      <div style={{backgroundColor:'darkblue',color:'white',textAlign:'center',padding:'0.2cm'}}>
         <b>{role}</b>
      </div>
       
      
      <ul className="sidebar-nav" id="sidebar-nav">
    
        {/* Role-based Menu Items */}
        {role &&
          menuItems[role]?.map((item, index) => (
            <li className="nav-item" key={index}>
              <a className="nav-link collapsed" href={item.link}>
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </a>
            </li>
          ))}

        {/* Common Items */}
        {commonItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <a className="nav-link collapsed" href={item.link}>
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
