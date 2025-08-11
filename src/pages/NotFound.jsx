import React from "react";

function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[rgb(248,211,213)] relative">
      <div className="absolute inset-0 bg-[url('/src/assets/404.png')] bg-no-repeat bg-center bg-contain" />
      <div className="absolute inset-0 bg-white/0" />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-12 py-3 rounded-3xl bg-white border border-slate-300 text-slate-800 shadow-sm hover:bg-white/90 hover:border-slate-400 transition absolute bottom-30 font-bold"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
