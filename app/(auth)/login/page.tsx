"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.ok) {
      setError("Invalid credentials. Access to the mainframe denied.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden font-sans">
      {/* Background Depth Layers */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#007AFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-[22px] bg-slate-900 border border-white/10 shadow-2xl mb-4 sm:mb-6 relative group transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-[#007AFF]/15 blur-2xl group-hover:bg-[#007AFF]/30 transition-all rounded-full" />
            <Cpu className="text-[#007AFF] relative z-10" size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1 sm:mb-2">
            Nexus AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            System Authentication
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
          {/* Internal Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#007AFF]/50 to-transparent" />

          {error && (
            <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-red-500/5 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] ml-1">
                Email Terminal
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#007AFF] transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@nexus.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/5 transition-all placeholder:text-slate-700 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1 gap-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">
                  Security Key
                </label>
                <Link
                  href="#"
                  className="text-[9px] sm:text-[10px] font-bold text-[#007AFF] hover:text-white transition-colors"
                >
                  Recover Access
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#007AFF] transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-2xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 focus:outline-none focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/5 transition-all placeholder:text-slate-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center gap-2 sm:gap-3 bg-[#007AFF] hover:bg-[#0062cc] disabled:bg-slate-800 text-white font-bold py-3 sm:py-4.5 rounded-2xl transition-all shadow-xl shadow-[#007AFF]/10 active:scale-[0.98] text-sm sm:text-base"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white/80" size={22} />
              ) : (
                <>
                  <span className="tracking-wide">Initialize Login</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-6 sm:mt-10 text-slate-500 text-xs sm:text-sm">
          Don&apos;t have any account?{" "}
          <Link
            href="/register"
            className="text-white font-semibold hover:text-[#007AFF] transition-colors underline-offset-8 hover:underline"
          >
            Register for access
          </Link>
        </p>
      </div>
    </div>
  );
}
