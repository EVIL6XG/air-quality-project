import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      login(data.token);
      navigate("/dashboard");
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex flex-col
        items-center
        justify-center
        bg-gradient-to-br
        from-[#E6F3F9] via-[#F6F8FF] to-[#E9EDFF]
      "
    >
      <img
        src="/purple.png"
        alt="logo"
        className="w-24 mb-6 drop-shadow-md"
      />

      <div
        className="
          bg-white
          w-[380px]
          p-10
          rounded-[28px]
          shadow-[0_25px_60px_rgba(0,0,0,0.08)]
        "
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back!
        </h2>

        <label className="text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mt-1 mb-4 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]"
        />

        <label className="text-sm font-medium">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          type="password"
          className="w-full mt-1 mb-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]"
        />

        <div className="text-right text-sm text-[#5B5BD6] mb-4 cursor-pointer">
          Forgot password?
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-full
            bg-[#4F5DBA]
            text-white
            font-medium
            hover:bg-[#434fa6]
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Signing in..." : "Continue"}
        </button>

        <p className="text-sm text-center mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#5B5BD6] cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        For assistance, please contact our support team at{" "}
        <span className="underline cursor-pointer">
          support@airquality.ai
        </span>
      </p>
    </div>
  );
}
