// frontend/src/components/AuthShell.jsx
export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10">
        
        <div className="flex-1 hidden md:block">
          <div className="text-2xl font-semibold mb-2">
            Track your gains with discipline.
          </div>
          <div className="text-sm text-slate-400 mb-4">
            Meals + workouts + weekly check-ins = guaranteed progress.
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
