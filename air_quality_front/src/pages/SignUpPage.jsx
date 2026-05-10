import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
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
          Create Account
        </h2>

        <label className="text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="
            w-full mt-1 mb-4 px-4 py-3 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]
          "
        />

        <label className="text-sm font-medium">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create password"
          type="password"
          className="
            w-full mt-1 mb-2 px-4 py-3 border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-[#5B5BD6]
          "
        />

        <p className="text-xs text-gray-500 mb-4">
          Password must be at least 8 characters long
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="
            w-full py-3 rounded-full
            bg-[#5B5BD6] text-white font-medium
            hover:bg-[#4A4ABF] transition
            disabled:opacity-60
          "
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#5B5BD6] cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-8 text-center">
        For assistance, please contact our support team at{" "}
        <span className="underline">support@airquality.ai</span>
      </p>
    </div>
  );
}
