import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { Loader2, Dumbbell } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { auth, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (auth) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      toast.success("Welcome back! 💪");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <title>LogIn</title>
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/gym-login.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-3xl bg-white/10 border border-white/20
      rounded-3xl px-12 py-14 shadow-[0_0_50px_rgba(0,0,0,0.7)]
      backdrop-blur-xl text-white animate-loginFade">

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-10 h-10 text-violet-400" />
          <div className="leading-tight">
            <h1 className="font-extrabold text-2xl tracking-tight">
              Fitness Tracker
            </h1>
            <p className="text-sm font-medium text-gray-200">
              Gain smart. Track daily.
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold tracking-wide mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-sm font-medium text-gray-200 mb-8">
          Log in to track your daily progress.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Email">
            <input
              type="email"
              name="email"
              className="input-auth"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Input>

          <Input label="Password">
            <input
              type="password"
              name="password"
              className="input-auth"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Input>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-[18px] text-gray-300 font-semibold mt-6">
          New user?{" "}
          <Link
            to="/register"
            className="text-violet-400 font-bold hover:text-violet-300 underline-offset-2 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}

function Input({ label, children }) {
  return (
    <label className="block space-y-1 text-sm font-bold text-gray-200">
      <span>{label}</span>
      {children}
    </label>
  );
}
