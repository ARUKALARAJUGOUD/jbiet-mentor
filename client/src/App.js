import { BrowserRouter, Route, Routes } from "react-router-dom";
// Auth
import Login from "./pages/auth/Login";
// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
// Admin – Students
import AdminStudentProfile from "./pages/admin/Students/AdminStudentProfile";
import CreateStudent from "./pages/admin/Students/CreateStudent";
import EditStudent from "./pages/admin/Students/EditStudent";
import StudentList from "./pages/admin/Students/StudentList";
import TopperPage from "./pages/admin/Students/TopperPage";
// Admin – Faculty
import CreateFaculty from "./pages/admin/Faculty/CreateFaculty";
import FacultyList from "./pages/admin/Faculty/FacultyList";
// Subjects / Marks / Attendance
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout.jsx";
import AddAttendance from "./pages/admin/Attendance/AddAttendance";
import AttendanceTable from "./pages/admin/Attendance/AttendanceTable";
import AddSubject from "./pages/admin/Subjects/AddSubject";
import GetSubjects from "./pages/admin/Subjects/GetSubjects";
import SubjectResultAnalysis from "./pages/admin/Subjects/SubjectResultAnalysis";
import AddMarks from "./pages/admin/marks/AddMarks";
import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import StudentDayWiseAttendance from "./pages/student/StudentProfile/DayWiseAttendence/StudentDayWiseAttendance.jsx";
import StudentMarks from "./pages/student/StudentProfile/SemesterMarks.jsx";
import StudentAttendance from "./pages/student/StudentProfile/StudentAttendance.jsx";
import StudentDashboardprofile from "./pages/student/StudentProfile/StudentDashboardprofile.jsx";
import StudentResult from "./pages/student/StudentProfile/StudentResult.jsx";
export default function App() {
  const Navigate = useNavigate();
  return (
    <BrowserRouter>
      <Routes>
        {/* ========= PUBLIC ========= */}
        {/* <Route path="/login" element={<Login />} />  */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/* ========= STUDENT ========= */}
        <Route path="/student/dashboard" element={<StudentDashboard />}>
          <Route path="profile" element={<StudentDashboardprofile />} />
          <Route path="results" element={<StudentResult />} />
          <Route path="marks" element={<StudentMarks />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="day-attendance" element={<StudentDayWiseAttendance />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="create-student" element={<CreateStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="student/:id" element={<AdminStudentProfile />} />
          <Route path="faculty" element={<FacultyList />} />
          <Route path="create-faculty" element={<CreateFaculty />} />
          <Route path="subjects" element={<GetSubjects />} />
          <Route path="create-subject" element={<AddSubject />} />
          <Route path="marks" element={<AddMarks />} />
          <Route path="attendance" element={<AddAttendance />} />
          <Route path="attendance-report" element={<AttendanceTable />} />
          <Route path="pass-fail" element={<SubjectResultAnalysis />} />
          <Route path="top-students" element={<TopperPage />} />
        </Route>
        ========= FACULTY (SAME AS ADMIN) =========
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="create-student" element={<CreateStudent />} />
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="student/:id" element={<AdminStudentProfile />} />
          <Route path="subjects" element={<GetSubjects />} />
          <Route path="create-subject" element={<AddSubject />} />
          <Route path="marks" element={<AddMarks />} />
          <Route path="attendance" element={<AddAttendance />} />
          <Route path="attendance-report" element={<AttendanceTable />} />
          <Route path="pass-fail" element={<SubjectResultAnalysis />} />
          <Route path="top-students" element={<TopperPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
