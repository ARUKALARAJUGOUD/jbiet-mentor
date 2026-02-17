import { useEffect, useState } from "react";
import api from "../../../api/api";
import "../../../css/faculty/Facultylist.css"

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/admin/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error("Error fetching faculty", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/faculty/${id}`);
      // Remove faculty from UI after delete
      setFaculty(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error("Error deleting faculty", err);
      alert("Failed to delete faculty");
    }
  };

  if (loading) return <p>Loading faculty...</p>;

  return (
    <div className="faculty-page">
      <h2 className="faculty-title">Faculty List</h2>

      {faculty.length === 0 ? (
        <p>No faculty found</p>
      ) : (
        <div className="table-wrapper">
          <table className="faculty-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {faculty.map((f, index) => (
                <tr key={f._id}>
                  <td>{index + 1}</td>
                  <td>{f.facultyId}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.phone}</td>
                  <td>{f.department}</td>
                  <td>{f.designation}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(f._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );


}

