

import { useEffect, useState, useCallback } from "react";
import AnalyticsFilters from "./AnalyticsFilters";
import AnalyticsTable from "./AnalyticsTable";
import "../Acadamic_analytics/acadamicanalytics.css";
import api from "../../../api/api";

export default function AcademicAnalytics() {
  const [filters, setFilters] = useState({
    regulation: "",
    branch: "",
    semester: ""
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "/admin/getAcademicAnalyticsTable",
        { params: filters }
      );
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h2>📊 Academic Analytics</h2>

        {/* Filters Card */}
        <div className="analytics-filters-card">
          <AnalyticsFilters
            filters={filters}
            setFilters={setFilters}
            onApply={fetchAnalytics}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="analytics-loading">Loading analytics...</p>
        ) : (
          <div className="table-wrapper">
            <AnalyticsTable data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
