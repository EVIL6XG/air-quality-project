import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-xl font-bold text-[#5B5BD6]">
          Air Q Almaty 
        </h1>

        <Link
          to="/login"
          className="px-4 py-2 rounded-xl border border-[#5B5BD6] text-[#5B5BD6] hover:bg-[#F0F1FF]"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        
        {/*  ОБЛАКО */}
        <Link to="/dashboard" className="mb-8">
  <img
    src="/purple.png"
    alt="Air Quality Cloud"
    className="w-44 md:w-52 mx-auto cursor-pointer animate-cloud-spin hover:scale-110 transition-transform duration-300"
  />
</Link>


        <h2 className="text-4xl font-bold mb-4">
          Air Quality Analytics Platform
        </h2>

        <p className="text-gray-600 max-w-xl mb-8">
          Monitor, analyze and visualize air quality across urban districts
          using interactive maps and data-driven insights.
        </p>

        <Link
          to="/login"
          className="px-6 py-3 bg-[#5B5BD6] text-white rounded-xl hover:bg-[#4a4abf]"
        >
          Get started
        </Link>
      </main>
    </div>
  );
}
 