import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import AcademicLoader from "../../components/Loader/AcademicLoader";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Auth/login.css";
export default function Login() {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); // 🔥 important

    if (loading) return; // prevent double click

    setError("");

    const userId = form.userId.trim();
    const password = form.password.trim();

    if (!userId || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const start = Date.now();

      const res = await api.post("/auth/login", {
        userId: userId.toUpperCase(),
        password,
      });

      const elapsed = Date.now() - start;
      const minTime = 3500;

      if (elapsed < minTime) {
        await new Promise((resolve) => setTimeout(resolve, minTime - elapsed));
      }

      setAuth(res.data);
      localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <AcademicLoader />}
      <div className="login-page">
        <div className="login-glass">
          {/* Header Section */}
          <div className="login-header">
            <div className="college-info">
              <h1>JB Institute of Engineering & Technology</h1>
              <p className="subtitle">Student & Faculty Login</p>
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={submit}>
            <div className="input-group">
              <input
                type="text"
                required
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />
              <label>Roll No / Faculty ID</label>
            </div>

            <div className="input-group password">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <label>Password</label>
              <span onClick={() => setShowPassword(!showPassword)}>
                {/* {showPassword ? "🙈" : "👁"} */}
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </span>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <p className="footer-text">
            Secure Academic Portal • College ERP System
          </p>
        </div>
      </div>
    </>
  );
}
