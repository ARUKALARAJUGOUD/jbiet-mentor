GET /students/getAllStudents → Used in: StudentList.jsx
POST /attendance/addAttendance → Used in: AttendancePage.jsx

APIS ARE USED IN THE STUDENT DASHBOARD OR STUDENT PAGE

 <!-- authRoutes  -->

POST /login -> Used in Login.jsx -> Path: client/src/pages/auth

POST /register -> Used in : CreateFaculty.jsx ->  Path : \client\src\pages\admin\Faculty\CreateFaculty.jsx 

POST /register Used in : CreateStudent.jsx -> Path : \client\src\pages\admin\Students\CreateStudent.jsx
GET /refresh -> Used in api.jsx

POST /logout -> Used in :StudentDashboard.jsx -> Path : client/src/pages/student
-> Used in: AdminLayout.jsx -> Path: client/src/layouts
->Used in: FacultyLAyout.jsx-> Path: client/src/layouts

GET /dashboard -> Used in: AdminLayout.jsx -> Path : client/src/layouts
-> Used in: FacultyLayout.jsx -> Path : client/src/layouts
-> Used in : StudentDashboard.jsx -> Path : client/src/pages/student
-> Used in : SemesterMarks.jsx -> Path : client/src/pages/student/StudentProfile
-> Used in : StudentAttendance.jsx -> Path : client/src/pages/student/StudentProfile
->Used in : StudentDashboardprofie.jsx -> Path : client/src/pages/student/StudentProfile
-> Used in : StudentDayWiseAttendance.jsx -> Path : client/src/pages/student/StudentProfile/DayWiseAttendance

POST /marks/add -> Used in : AddMarks.jsx -> Path : client/src/pages/admin/marks

GET /getMarks/student/semester-wise/:studentId/:semester -> Path:client\src\pages\admin\results\SemesterResults.jsx

 <!-- adminRoutes  -->

GET /students -> Used in : StudentList.jsx -> Path: \client\src\pages\admin\Students\StudentList.jsx

GET /faculty -> Used in : FacultyList.jsx -> Path : \client\src\pages\admin\Faculty\FacultyList.jsx

GET /student/:id -> Used in : AdminStudentProfile.jsx -> Path : \client\src\pages\admin\Students\AdminStudentProfile.jsx

GET /student/:id -> Used in : EditStudent.jsx -> Path : client\src\pages\admin\Students\EditStudent.jsx

PUT /student/:id -> Used in : EditStudent.jsx -> Path : client\src\pages\admin\Students\EditStudent.jsx

DELETE /student/:id -> Used in : FacultyList.jsx -> Path : client\src\pages\admin\Faculty\FacultyList.jsx

GET /getAdminDashboardAnalytics -> Used in : AdminDashboard.jsx -> Path : client\src\pages\admin\AdminDashboard.jsx

GET /getAcademicAnalyticsTable -> Used in : AcademicAnalytics.jsx -> Path : \client\src\pages\admin\Acadamic_analytics\AcademicAnalytics.jsx

<!-- Attendance Routes  -->

GET /admin/attendance/semester-summary -> Used in : AttendanceTable.jsx -> Path : \client\src\pages\admin\Attendance\AttendanceTable.jsx

GET /student/present-classes -> Used in :SubjectDateWiseAttendance.jsx -> Path : \client\src\pages\admin\Attendance\SubjectDateWiseAttendance.jsx

POST /student/attendance/add -> Used in : AddAttendance.jsx -> Path : \client\src\pages\admin\Attendance\AddAttendance.jsx

GET /student/attendance/:studentId -> Used in : DayWiseAttendance.jsx -> Path : client\src\pages\admin\Attendance\DayWiseAttendance.jsx

GET /student/attendance/:studentId -> Used in : SemesterAttendance.jsx -> Path : client\src\pages\admin\Attendance\SemesterAttendance.jsx

<!-- student routes  -->

GET /acadamics/:rollNo/summary -> Used in : StudentDashboard.jsx -> Path : client\src\pages\student\StudentDashboard.jsx

GET /acadamics/:rollNo/backlogs -> Used in : -> Path : client\src\pages\student\StudentDashboard.jsx

GET /:rollNo/attendance/current -> Used in : StudentDashboard.jsx -> Path : client\src\pages\student\StudentDashboard.jsx

GET /:rollNo/subjects -> Used in : StudentDashboard.jsx -> Path : \client\src\pages\student\StudentDashboard.jsx

GET /acadamics/:rollNo/semester/:semester -> Used in : SemesterMarks.jsx
-> Path : client\src\pages\student\StudentProfile\SemesterMarks.jsx

GET /getAttendancereport/:rollNo -> Used in : StudentAttendance.jsx -> Path : \client\src\pages\student\StudentProfile\StudentAttendance.jsx

GET /results/student_result/:rollNo/:semester -> Used in : StudentResult.jsx -> Path : client\src\pages\student\StudentProfile\StudentResult.jsx

GET /getDayWiseAttendance/:rollNo -> Used in : StudentDayWiseAttendance.jsx -> Path : client\src\pages\student\StudentProfile\DayWiseAttendence\StudentDayWiseAttendance.jsx


<!-- subjects routes  -->
GET /marks_subjects Used in :  AddAttendance.jsx -> Path : \client\src\pages\admin\Attendance\AddAttendance.jsx

GET /getSubjects Used in : SubjectDateWiseAttendance.jsx -> Path : \client\src\pages\admin\Attendance\SubjectDateWiseAttendance.jsx

POST /add Used in :  AddSubject.jsx -> Path : \client\src\pages\admin\Subjects\AddSubject.jsx

DELETE /delete-subject/:id Used in :GetSubjects.jsx  -> Path : \client\src\pages\admin\Subjects\GetSubjects.jsx

GET /results/subject-toppers Used in : SubjectResultAnalysis.jsx -> Path \client\src\pages\admin\Subjects\SubjectResultAnalysis.jsx

GET /results/Subject-analysis Used in : SubjectResultAnalysis.jsx  -> Path : \client\src\pages\admin\Subjects\SubjectResultAnalysis.jsx

<!-- topper routes -->

GET /semester Used in : TopperPage.jsx -> Path : \client\src\pages\admin\Students\TopperPage.jsx