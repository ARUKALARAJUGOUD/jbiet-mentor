import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api";
import "../../../css/attendance/DayWiseAttendance.css"
export default function DayWiseAttendance({ studentId }) {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState("");


  useEffect(() => {
    api.get(`/student/attendance/${studentId}`)
      .then(res => setAttendance(res.data))
      .catch(console.error);
  }, [studentId]);



  const dayWiseSummary = useMemo(() => {
    const map = {};

    attendance.forEach(a => {
      const dateKey = new Date(a.date).toISOString().split("T")[0];

      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          total: 0,
          present: 0,
          records: []
        };
      }

      map[dateKey].total += 1;
      if (a.status === "PRESENT") map[dateKey].present += 1;
      map[dateKey].records.push(a);
    });

    let days = Object.values(map).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // 🔍 Filter by selected date
    if (searchDate) {
      days = days.filter(d => d.date === searchDate);
    }

    return days;
  }, [attendance, searchDate]);






  return (
    <div>
      <div className="daywise-header">

        <div className="daywise-filter">
          <label>
            Search by Date
            <input
              type="date"
              value={searchDate}
              onChange={e => {
                setSearchDate(e.target.value);
                setSelectedDate(null);
              }}
            />
          </label>

          {searchDate && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchDate("");
                setSelectedDate(null);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>





      {/* 🔹 Day summary table */}
      {/* <table border="1" width="100%">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date</th>
            <th>Total Classes</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attendance %</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dayWiseSummary.map((d, index) => {
            const absent = d.total - d.present;
            const percent =
              d.total === 0
                ? 0
                : ((d.present / d.total) * 100).toFixed(2);

            return (
              <tr key={d.date}>
                <td>{index + 1}</td>
                <td>{d.date}</td>
                <td>{d.total}</td>
                <td>{d.present}</td>
                <td>{absent}</td>
                <td>{percent}%</td>
                <td>
                  <button onClick={() => setSelectedDate(d)}>
                    View Periods
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>  */}


      
      {selectedDate && (
        <>
          <h3>Attendance on {selectedDate.date}</h3>

          <div className="table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {selectedDate.records.map(r => (
                  <tr key={r._id}>
                    <td>{r.subjectCode}</td>
                    <td>{r.subjectName}</td>
                    <td>{r.fromTime}</td>
                    <td>{r.toTime}</td>
                    <td
                      style={{
                        color: r.status === "PRESENT" ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}



      <div className="table-scroll">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {dayWiseSummary.map((d, index) => {
              const absent = d.total - d.present;
              const percent =
                d.total === 0
                  ? 0
                  : ((d.present / d.total) * 100).toFixed(2);

              return (
                <tr
                  key={d.date}
                  className={percent === "0.00" ? "zero-attendance" : ""}
                >
                  <td>{index + 1}</td>
                  <td>{d.date}</td>
                  <td>{d.total}</td>
                  <td>{d.present}</td>
                  <td>{absent}</td>
                  <td>{percent}%</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedDate(d)}
                    >
                      View Periods
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔹 Period / subject wise for a day */}
      {/* {selectedDate && (
        <>
          <h3>Attendance on {selectedDate.date}</h3>

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedDate.records.map(r => (
                <tr key={r._id}>
                  <td>{r.subjectCode}</td>
                  <td>{r.subjectName}</td>
                  <td>{r.fromTime}</td>
                  <td>{r.toTime}</td>
                  <td
                    style={{
                      color: r.status === "PRESENT" ? "green" : "red",
                      fontWeight: "bold"
                    }}
                  >
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}




    </div>
  );
}
