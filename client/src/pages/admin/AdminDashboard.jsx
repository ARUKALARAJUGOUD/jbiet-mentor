import { useEffect, useState } from "react";
import "../../css/Admin/admin.css";
import api from "../../api/api";
import AcademicAnalytics from "./Acadamic_analytics/AcademicAnalytics";
import SubjectDateWiseAttendance from "./Attendance/SubjectDateWiseAttendance"; 
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";
import { HiOutlineChartBar } from "react-icons/hi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/admin/getAdminDashboardAnalytics");
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3 style={{ padding: "20px" }}>Loading Dashboard...</h3>;
  }

  return (
    <div>
      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-icon">
            <FaUserGraduate />
          </div>
          <div>
            <h3>Students</h3>
            <p>{`${stats.totalStudents} Enrolled`}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h3>Faculty</h3>
            <p>{`${stats.totalFaculty} Active`}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <FaBookOpen />
          </div>
          <div>
            <h3>Subjects</h3>
            <p>{`${stats.totalSubjects} Offered`}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">
            <HiOutlineChartBar />
          </div>
          <div>
            <h3>Pass Rate</h3>
            <p>{`${stats.passPercentage}%`}</p>
          </div>
        </div>
      </div>

      <AcademicAnalytics />
      <SubjectDateWiseAttendance />
    </div>
  );
}
