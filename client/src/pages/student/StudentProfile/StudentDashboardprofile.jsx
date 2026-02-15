import React, { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useEffect } from 'react'
import { useState } from 'react'
import api from '../../../api/api'
import "../../../css/StudentDashboard/StudentDashboardProfile.css"
const StudentDashboardprofile = () => {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!auth?.accessToken) return;

    api.get("/auth/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [auth?.accessToken]);

  if (!data) {
    return <p>Loading profile...</p>;
  }
  return (
    <div className="card profile-card">
      <h3 className="profile-title">Student Profile</h3>

      <div className="profile-grid">
        <div className="profile-item">
          <span className="label">Name</span>
          <span className="value">{data.name}</span>
        </div>

        <div className="profile-item">
          <span className="label">Roll No</span>
          <span className="value">{data.rollNo}</span>
        </div>

        <div className="profile-item">
          <span className="label">Regulation</span>
          <span className="value">{data.regulation}</span>
        </div>

        <div className="profile-item">
          <span className="label">Branch</span>
          <span className="value">{data.branch}</span>
        </div>

        <div className="profile-item">
          <span className="label">Semester</span>
          <span className="value">{data.semester}</span>
        </div>

        <div className="profile-item">
          <span className="label">Year</span>
          <span className="value">{data.year}</span>
        </div>
      </div>
    </div>
  );

};

export default StudentDashboardprofile;