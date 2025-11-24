import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { Dumbbell, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { auth, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    heightCm: "",
    currentWeightKg: ""
  });

  if (auth) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        currentWeightKg: form.currentWeightKg
          ? Number(form.currentWeightKg)
          : undefined,
      };

      const res = await api.post("/auth/register", payload);
      login(res.data);
      toast.success("Welcome to the journey! 🏋️‍♂️");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <title>Register</title>
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/gym-login.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-3xl bg-white/10 border border-white/20
      rounded-3xl px-12 py-14 shadow-[0_0_50px_rgba(0,0,0,0.7)]
      backdrop-blur-xl text-white animate-loginFade">

        {/* Branding */}
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-10 h-10 text-violet-400" />
          <div className="leading-tight">
            <h1 className="font-extrabold text-3xl tracking-tight">Fitness Tracker</h1>
            <p className="text-sm font-large text-gray-200">Gain smart. Track daily.</p>
          </div>
        </div>

        <h2 className="text-4xl font-extrabold tracking-wide mb-2">
          Create Account 💪
        </h2>
        <p className="text-sm font-medium text-gray-200 mb-8">
          Let’s start your clean bulking journey!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Name">
            <input
              name="name"
              className="input-auth"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Input>

          <Input label="Email">
            <input
              name="email"
              type="email"
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

          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (cm)">
              <input
                name="heightCm"
                type="number"
                className="input-auth"
                placeholder="170"
                value={form.heightCm}
                onChange={handleChange}
              />
            </Input>

            <Input label="Current Weight (kg)">
              <input
                name="currentWeightKg"
                type="number"
                className="input-auth"
                placeholder="53"
                value={form.currentWeightKg}
                onChange={handleChange}
              />
            </Input>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-auth"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
          </button>
        </form>

        <p className="text-[16px] text-gray-300 font-semibold mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-400 font-bold underline-offset-2 hover:underline"
          >
            Log in
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
