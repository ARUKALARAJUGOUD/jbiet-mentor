export default function AnalyticsFilters({ filters, setFilters, onApply }) {
  const branches = [
    "AI&DS",
    "AI&ML",
    "CE",
    "CSE",
    "CSE(AI&ML)",
    "CSE(DS)",
    "ECE",
    "ECM",
    "EEE",
    "IT",
    "ME",
  ];
  const regulations = ["R18", "R20", "R22", "R23", "R24", "R25"];

  return (
    <div className="analytics-filters">
      <select
        value={filters.regulation}
        onChange={(e) =>
          setFilters({
            ...filters,
            regulation: e.target.value,
          })
        }
      >
        <option value="">Regulation</option>
        {regulations.map((reg, index) => (
          <option key={index} value={reg}>
            {reg}
          </option>
        ))}
      </select>

      <select
        value={filters.branch}
        onChange={(e) =>
          setFilters({
            ...filters,
            branch: e.target.value,
          })
        }
      >
        <option value="">Branch</option>

        {branches.map((branch, index) => (
          <option key={index} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      <select
        value={filters.semester}
        onChange={(e) =>
          setFilters({
            ...filters,
            semester: e.target.value,
          })
        }
      >
        <option value="">Semester</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}
      </select>

      <button onClick={onApply} className="apply-btn">
        Apply
      </button>
    </div>
  );
}
