
import React, { useState } from "react";

const DayWiseAttendanceTable = ({ attendance = {}, student }) => {
  const [expandedDate, setExpandedDate] = useState(null);

  if (!attendance || Object.keys(attendance).length === 0) {
    return <p>No attendance records found.</p>;
  }

  const getStats = (classes = []) => {
    const total = classes.length;
    const present = classes.filter(c => c.status === "PRESENT").length;

    return {
      total,
      present,
      percentage: total
        ? ((present / total) * 100).toFixed(2)
        : "0.00"
    };
  };

  const toggleDate = (date) => {
    setExpandedDate(prev => (prev === date ? null : date));
  };

  // return (
  //   <table className="attendance-table">
  //     <thead>
  //       <tr>
  //         <th>S.No</th>
  //         <th>Date</th>
  //         <th>Total Classes</th>
  //         <th>Attended</th>
  //         <th>%</th>
  //         <th>Actions</th>
  //       </tr>
  //     </thead>

  //     <tbody>
  //       {Object.entries(attendance)
  //         .sort(([a], [b]) => new Date(b) - new Date(a))
  //         .map(([date, classes], dayIndex) => {
  //           const stats = getStats(classes);
  //           const isOpen = expandedDate === date;

  //           return (
  //             <React.Fragment key={date}>
  //               {/* 🔹 MAIN DAY ROW */}
  //               <tr>
  //                 <td>{dayIndex + 1}</td>
  //                 <td>{date}</td>
  //                 <td>{stats.total}</td>
  //                 <td>{stats.present}</td>
  //                 <td 
  //                  className={
  //   stats.percentage <= 50 || stats.present === 0
  //     ? "danger-row"
  //     : ""
  // }
  //                 >{stats.percentage}%</td>
                  
  //                 <td>
  //                   <button
  //                     className="view-btn"
  //                     onClick={() => toggleDate(date)}
  //                   >
  //                     {isOpen ? "view less" : "view more"}
  //                   </button>
  //                 </td>
  //               </tr>

  //               {/* 🔹 EXPANDED SUBJECT TABLE */}
  //               {isOpen && (
  //                 <tr className="expanded-row">
  //                   <td colSpan="6">
  //                     <table className="inner-table">
  //                       <thead>
  //                         <tr>
  //                           <th>S.No</th>
  //                           <th>Subject Code</th>
  //                           <th>Subject Name</th>
  //                           <th>From Time</th>
  //                           <th>To Time</th>
  //                           <th>Status</th>
  //                         </tr>
  //                       </thead>
  //                       <tbody>
  //                         {classes.map((cls, index) => (
  //                           <tr 
  //                           key={index}
  //                           className={cls.status === "ABSENT" ? "subject-absent-row" : ""}
  //                           >
  //                             <td>{index + 1}</td>
  //                             <td>{cls.subjectCode}</td>
  //                             <td>{cls.subjectName}</td>
  //                             <td>{cls.fromTime}</td>
  //                             <td>{cls.toTime}</td>
  //                             <td
  //                               className={
  //                                 cls.status === "PRESENT"
  //                                   ? "present"
  //                                   : "absent"
  //                               }
  //                             >
  //                               {cls.status}
  //                             </td>
  //                           </tr>
  //                         ))}
  //                       </tbody>
  //                     </table>
  //                   </td>
  //                 </tr>
  //               )}
  //             </React.Fragment>
  //           );
  //         })}
  //     </tbody>
  //   </table>
  // );


  return (
  <div className="table-wrapper">
    <table className="attendance-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Date</th>
          <th>Total Classes</th>
          <th>Attended</th>
          <th>%</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(attendance)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .map(([date, classes], dayIndex) => {
            const stats = getStats(classes);
            const isOpen = expandedDate === date;

            return (
              <React.Fragment key={date}>
                <tr>
                  <td>{dayIndex + 1}</td>
                  <td>{date}</td>
                  <td>{stats.total}</td>
                  <td>{stats.present}</td>
                  <td
                    className={
                      stats.percentage <= 50 || stats.present === 0
                        ? "danger-row"
                        : ""
                    }
                  >
                    {stats.percentage}%
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => toggleDate(date)}
                    >
                      {isOpen ? "view less" : "view more"}
                    </button>
                  </td>
                </tr>

                {isOpen && (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="table-wrapper">
                        <table className="inner-table">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Subject Code</th>
                              <th>Subject Name</th>
                              <th>From Time</th>
                              <th>To Time</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classes.map((cls, index) => (
                              <tr
                                key={index}
                                className={
                                  cls.status === "ABSENT"
                                    ? "subject-absent-row"
                                    : ""
                                }
                              >
                                <td>{index + 1}</td>
                                <td>{cls.subjectCode}</td>
                                <td>{cls.subjectName}</td>
                                <td>{cls.fromTime}</td>
                                <td>{cls.toTime}</td>
                                <td
                                  className={
                                    cls.status === "PRESENT"
                                      ? "present"
                                      : "absent"
                                  }
                                >
                                  {cls.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  </div>
);



};

export default DayWiseAttendanceTable;
