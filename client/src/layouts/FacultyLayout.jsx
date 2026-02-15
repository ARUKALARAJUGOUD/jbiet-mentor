import { Outlet, Link } from "react-router-dom";
import { useContext, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaChartBar,
  FaCalculator, FaSignOutAlt
} from "react-icons/fa";

import { HiMenu } from "react-icons/hi";

import JbietLogo from "../../src/images/jbiet.png"

export default function AdminLayout() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { auth, setAuth } = useContext(AuthContext)
  // used for logout 
  const navigate = useNavigate();

  // fauclty details 
  const [data, setData] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // faculty detials 

  // admin details 
  useEffect(() => {
    if (!auth?.accessToken) return;

    api.get("/auth/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);

  console.log(data)

  // logout 
  const logout = async () => {
    await api.post("/auth/logout");
    setAuth(null); // important

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">


      {/* faculty header  */}
      <header className="student-header faculty-header">

        {/* LEFT – COLLEGE LOGO */}
        <div className="student-nav-left">
          <img
            src={JbietLogo}
            alt="College Logo"
            className="college-logo"
          />
        </div>

        {/* CENTER – COLLEGE NAME */}
        <div className="student-nav-center">
          <h2>JB INSTITUTE OF ENGINEERING AND TECHNOLOGY <span>(UGC AUTONOMOUS)</span>  </h2>
          <span>Accredited  by NAAC , Approved by AICTE & Permanently Affiliated to JNTUH </span> <br />
          <span>Student Academic Portal</span>
        </div>

        {/* RIGHT – STUDENT INFO */}
        <div className="student-nav-right">
          <span className="roll-no">{data?.facultyId}</span>
          <button onClick={logout} className="logout-btn">
            <FaSignOutAlt />
            Logout
          </button>        </div>

      </header>

      {/* ===== HEADER / NAVBAR ===== */}
      <header className="admin-header-nav">

        <div className="admin-title">
          <h2>Welcome, {data?.name}</h2>
        </div>

        <button
          className="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <HiMenu />
        </button>

        <nav className={`admin-nav ${mobileOpen ? "open" : ""}`}>

          {/* STUDENTS */}
          <div className="nav-item" onClick={() => toggleDropdown("students")}>
            <span className={`nav-label ${activeMenu === "students" ? "active" : ""}`}>
              <FaUserGraduate className="nav-icon" />
              Students
              <span className="arrow">▾</span>
            </span>
            <div className={`dropdown ${activeMenu === "students" ? "show" : ""}`}>
              <Link to="/faculty/students">View Students</Link>
              <Link to="/faculty/create-student">Add Student</Link>
            </div>
          </div>

          {/* SUBJECTS */}
          <div className="nav-item" onClick={() => toggleDropdown("subjects")}>
            <span className={`nav-label ${activeMenu === "subjects" ? "active" : ""}`}>
              <FaBookOpen className="nav-icon" />
              Subjects
              <span className="arrow">▾</span>
            </span>
            <div className={`dropdown ${activeMenu === "subjects" ? "show" : ""}`}>
              <Link to="/faculty/subjects">Manage Subjects</Link>
              <Link to="/faculty/create-subject">Add Subject</Link>
            </div>
          </div>

          {/* ADD MARKS */}
          <Link className="nav-link" to="/faculty/marks">
            <FaCalculator className="nav-icon" />
            Add Marks
          </Link>

          {/* ATTENDANCE */}
          <div className="nav-item" onClick={() => toggleDropdown("attendance")}>
            <span className={`nav-label ${activeMenu === "attendance" ? "active" : ""}`}>
              <FaCalendarAlt className="nav-icon" />
              Attendance
              <span className="arrow">▾</span>
            </span>
            <div className={`dropdown ${activeMenu === "attendance" ? "show" : ""}`}>
              <Link to="/faculty/attendance">Mark Attendance</Link>
              <Link to="/faculty/attendance-report">Reports</Link>
            </div>
          </div>

          {/* REPORTS */}
          <div className="nav-item" onClick={() => toggleDropdown("reports")}>
            <span className={`nav-label ${activeMenu === "reports" ? "active" : ""}`}>
              <FaChartBar className="nav-icon" />
              Reports
              <span className="arrow">▾</span>
            </span>
            <div className={`dropdown ${activeMenu === "reports" ? "show" : ""}`}>
              <Link to="/faculty/pass-fail">Pass / Fail</Link>
              <Link to="/faculty/top-students">Top Performers</Link>
            </div>
          </div>

        </nav>
      </header>


      {/* ===== PAGE CONTENT ===== */}
      <div className="admin-content">
        <Outlet />
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="admin-footer">
        © 2026 jbiet College of Engineering and technology • Student Academic Portal
      </footer>

    </div>
  );
}
