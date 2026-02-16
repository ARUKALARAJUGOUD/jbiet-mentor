import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../student/Dashboard.css";
import { Outlet } from "react-router-dom";
// for icons 
import { FaUser, FaChartBar, FaCalendarAlt, FaBook, FaClock } from "react-icons/fa";
import JbietLogo from "../../../src/images/jbiet.png"
export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  //for the attendance 
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [overallAttendance, setOverallAttendance] = useState(null);

  // const [academic, setAcademic] = useState(null);
  const [academic, setAcademic] = useState({
    // student:"",
    semesters: [],
    cgpa: 0,
    overall: {
      totalCredits: 0,
      creditsSecured: 0
    }
  });

  //constant backlogs data 
  // BACKLOGS STATE
  const [backlogsData, setBacklogsData] = useState(null);
  const [loadingBacklogs, setLoadingBacklogs] = useState(true);


  const location = useLocation();
  const isDashboardHome = location.pathname === "/student/dashboard";

  //student details 
  useEffect(() => {
    console.log("student dashboard fetching ...")
    if (!auth?.accessToken) return;
    api.get("/auth/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);

  // fetching the acadamic summary 
  useEffect(() => {
    if (!data?.rollNo) return;

    api
      .get(`/students/academics/${data.rollNo}/summary`)
      .then(res => {
        setAcademic(res.data);
      })
      .catch(err => console.error(err));
  }, [data?.rollNo]);


  // console.log(academic)
  //fetching the backlogs data 
  useEffect(() => {
    if (!data?.rollNo) return;

    api
      .get(`/students/academics/${data.rollNo}/backlogs`)
      .then(res => {
        setBacklogsData(res.data);
        setLoadingBacklogs(false);
      })
      .catch(err => {
        console.error("Backlogs fetch failed", err);
        setLoadingBacklogs(false);
      });
  }, [data?.rollNo]);


  //for the attendence fetching api
  useEffect(() => {
    if (!data?.rollNo) return;

    api
      .get(`/students/${data.rollNo}/attendance/current`)
      .then(res => {
        setAttendance(res.data.attendance);
        setOverallAttendance(res.data.overall);
        setAttendanceLoading(false);
      })
      .catch(err => {
        console.error("Attendance fetch failed", err);
        setAttendanceLoading(false);
      });
  }, [data?.rollNo]);

  // to fetch current Subjects 

  useEffect(() => {
    if (!data?.rollNo) return;

    api
      .get(`/students/${data.rollNo}/subjects`)
      .then(res => {
        setSubjects(res.data.subjects);
        setLoadingSubjects(false);
      })
      .catch(err => {
        console.error("Subjects fetch failed", err);
        setLoadingSubjects(false);
      });
  }, [data?.rollNo]);



  const logout = async () => {
    await api.post("/auth/logout");

    navigate("/login");
  };

  // const logout = () => {
  //   setAuth(null);
  //   navigate("/login", { replace: true });
  // };

  
  console.log(auth)
  console.log(data)
  if (!data) return <p>Loading dashboard...</p>;


  // console.log(subjects)
  return (
    <>
      <div className="student-dashboard page-wrapper">

        <header className="student-header">

          {/* LEFT – COLLEGE LOGO */}
          <div className="student-nav-left">
            <div className="log-wrapper">

              <img
                src={JbietLogo}
                alt="College Logo"
                className="college-logo"
              />
            </div>
          </div>

          {/* CENTER – COLLEGE NAME */}
          <div className="student-nav-center">
            <h2>JB INSTITUTE OF ENGINEERING AND TECHNOLOGY <span>(UGC AUTONOMOUS)</span>  </h2>
            <span>Accredited  by NAAC , Approved by AICTE & Permanently Affiliated to JNTUH </span> <br />
            <span>Student Academic Portal</span>
          </div>

          {/* RIGHT – STUDENT INFO */}
          <div className="student-nav-right">
            <span className="roll-no">{data.rollNo}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>

        </header>


        <main className="main-content">

          <nav className="student-menu">
            <Link to="/student/dashboard/profile">
              <FaUser /> <span>Profile</span>
            </Link>

            <Link to="/student/dashboard/results">
              <FaChartBar /> <span>Results</span>
            </Link>

            <Link to="/student/dashboard/attendance">
              <FaCalendarAlt /> <span>Attendance</span>
            </Link>

            <Link to="/student/dashboard/marks">
              <FaBook /> <span>Marks</span>
            </Link>

            <Link to="/student/dashboard/day-attendance">
              <FaClock /> <span>Day-wise</span>
            </Link>
          </nav>
          <main className="student-content">
            <Outlet />
            {isDashboardHome && (
              <>
                {/* ===== QUICK STATS ===== */}
                <section className="stats-grid">
                  <div className="stat-card">
                    <h4>CGPA</h4>
                    <p>{academic?.cgpa ?? "0.00"}</p>
                  </div>



                  <div className="stat-card">
                    <h4> {data.semester} Sem Attendance</h4>
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color:
                          overallAttendance?.percentage < 75
                            ? "#d32f2f"
                            : "#2e7d32"
                      }}
                    >
                      {overallAttendance?.percentage || "0.00"}%
                    </p>

                    <span style={{ fontSize: "13px", color: "#555" }}>
                      {overallAttendance?.attendedClasses || 0} /
                      {overallAttendance?.totalClasses || 0} Classes
                    </span>
                  </div>

                  {/* <div className="stat-card">
                          <h4>Credits Earned</h4>
                          <p>118 / 160</p>
                        </div> */}


                  <div className="stat-card">
                    <h4>Credits Earned</h4>
                    <p>
                      {+(academic.overall.creditsSecured) + "/" + (academic.overall.totalCredits)}
                    </p>
                  </div>

                  <div className="stat-card warning">
                    <h4>Backlogs</h4>
                    <p>{backlogsData?.overall?.totalBacklogs ?? 0}</p>
                  </div>


                </section>

                {/* ===== MAIN GRID ===== */}
                <section className="dashboard-grid">
                  {/* BACKLOGS SEMESTER WISE  */}
                  <div className="card backlogs-card">
                    <h3>📚 Backlogs (Semester Wise)</h3>

                    {loadingBacklogs ? (
                      <p>Loading backlogs...</p>
                    ) : !backlogsData ||
                      Object.keys(backlogsData.backlogs).length === 0 ? (
                      <p className="empty-msg">No backlogs 🎉</p>
                    ) : (
                      <div className="table-wrapper">
                        <table className="academic-table">
                          <thead>
                            <tr>
                              <th>Semester</th>
                              <th>Subject Code</th>
                              <th>Subject Name</th>
                              <th>Credits</th>
                              <th>Internal</th>
                              <th>External</th>
                            </tr>
                          </thead>

                          <tbody>
                            {Object.keys(backlogsData.backlogs).map(semester =>
                              backlogsData.backlogs[semester].map((sub, index) => (
                                <tr key={`${semester}-${index}`}>
                                  <td>{semester}</td>
                                  <td>{sub.subjectCode}</td>
                                  <td>{sub.subjectName}</td>
                                  <td>{sub.credits}</td>
                                  <td>{sub.internalMarks}</td>
                                  <td>{sub.externalMarks}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {backlogsData && (
                      <div className="backlog-summary">
                        <span>Total Backlogs: {backlogsData.overall.totalBacklogs}</span>
                        <span>Backlog Credits: {backlogsData.overall.backlogCredits}</span>
                      </div>
                    )}
                  </div>

                  {/*ALL SEMESTER WISE  ACADAMIC PERFORMANCE  */}
                  <div className="card semester-card">
                    <h3>📈 Semester Performance</h3>

                    <div className="table-wrapper">
                      <table className="academic-table">
                        <thead>
                          <tr>
                            <th>Semester</th>
                            <th>SGPA</th>
                            <th>CGPA</th>
                            <th>Total Credits</th>
                            <th>Credits Secured</th>
                          </tr>
                        </thead>

                        <tbody>
                          {academic?.semesters?.map((sem) => (
                            <tr
                              key={sem.semester}
                              className={sem.hasBacklogs ? "row-backlog" : ""}
                            >
                              <td>{sem.semester}</td>
                              <td>{sem.sgpa}</td>
                              <td>{sem.cgpa}</td>
                              <td>{sem.totalCredits}</td>
                              <td>{sem.creditsSecured}</td>
                            </tr>
                          ))}

                          {/* Overall row */}
                          <tr className="row-total">
                            <td>Total</td>
                            <td>-</td>
                            <td>{academic.cgpa}</td>
                            <td>{academic.overall.totalCredits}</td>
                            <td>{academic.overall.creditsSecured}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* CURRENT SEMESTER ATTENDANCE */}
                  <div className="card">
                    <h3>Current Semester Attendance</h3>

                    {attendanceLoading ? (
                      <p>Loading attendance...</p>
                    ) : attendance.length === 0 ? (
                      <p>No attendance data found</p>
                    ) : (
                      <div className="table-wrapper">
                        <table className="attendance-table">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Subject Code</th>
                              <th>Subject Name</th>
                              <th>Total Classes</th>
                              <th>Attended</th>
                              <th>Attendance %</th>
                            </tr>
                          </thead>

                          <tbody>
                            {attendance.map((item, index) => (
                              <tr key={item.subjectCode}>
                                <td>{index + 1}</td>
                                <td>{item.subjectCode}</td>
                                <td>{item.subjectName}</td>
                                <td>{item.totalClasses}</td>
                                <td>{item.attendedClasses}</td>
                                <td
                                  style={{
                                    color: item.percentage < 75 ? "#dc2626" : "#16a34a",
                                    fontWeight: "600"
                                  }}
                                >
                                  {item.percentage}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* CURRENT SUBJECTS */}
                  <div className="card">
                    <h3>Current Semester Subjects</h3>

                    {loadingSubjects ? (
                      <p>Loading subjects...</p>
                    ) : subjects.length === 0 ? (
                      <p>No subjects found</p>
                    ) : (
                      <div className="table-wrapper">
                        <table className="subjects-table">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Subject Code</th>
                              <th>Subject Name</th>
                              <th>Credits</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjects.map((sub, index) => (
                              <tr key={sub._id}>
                                <td>{index + 1}</td>
                                <td>{sub.subjectCode}</td>
                                <td>{sub.subjectName}</td>
                                <td>{sub.credits}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                
                </section>

              </>
            )}
          </main>
        </main>




        {/* footer  */}
        <footer className="student-footer">

          <div className="footer-left">
            <h4>JB Institute of Engineering and Technology</h4>
            <p>(UGC Autonomous)</p>
          </div>

          <div className="footer-center">
            <p>Accredited by NAAC | Approved by AICTE | Affiliated to JNTUH</p>
            <p>© {new Date().getFullYear()} JB Institute. All Rights Reserved.</p>
          </div>

          <div className="footer-right">
            <strong>


              <p>Student Academic Portal</p>
            </strong>
            {/* <p>Developed for ERP System</p> */}
          </div>

        </footer>

      </div>
    </>
  );
}

