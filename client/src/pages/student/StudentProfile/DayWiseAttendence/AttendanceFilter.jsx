import React, { useState } from "react";

const AttendanceFilter = ({ onApply }) => {
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    // Priority: Date Range > Single Date > All
    if (startDate && endDate) {
      onApply({ startDate, endDate });
    } else if (date) {
      onApply({ date });
    } else {
      onApply({}); // All
    }
  };

  const handleReset = () => {
    setDate("");
    setStartDate("");
    setEndDate("");
    onApply({});
  };

  return (
    <div className="attendance-filter">
      <div>
        <label>Particular Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate} placeholder="start Date"
          onChange={e => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate} placeholder="End Date"
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <div className="filter-actions">
        <button onClick={handleApply}>Apply</button>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default AttendanceFilter;
