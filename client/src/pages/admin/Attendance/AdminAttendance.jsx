// import { useState } from "react";
// import api from "../../../api/api";
// import "./attendance.css";

// export default function Attendance() {
//   const [data, setData] = useState({
//     rollNo:"",
//     date:"",
//     status:"Present"
//   });

//   const submit = async () => {
//     await api.post("/admin/attendance", data, { withCredentials:true });
//     alert("Attendance saved");
//   };

//   return (
//     <div className="attendance-page">
//       <h2>Mark Attendance</h2>

//       <div className="attendance-card">
//         <input placeholder="Roll No" onChange={e=>setData({...data,rollNo:e.target.value})}/>
//         <input type="date" onChange={e=>setData({...data,date:e.target.value})}/>
//         <select onChange={e=>setData({...data,status:e.target.value})}>
//           <option>Present</option>
//           <option>Absent</option>
//         </select>
//         <button onClick={submit}>Submit</button>
//       </div>
//     </div>
//   );
// }
