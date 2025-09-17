import React from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Marking Scheme System</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Automatically grade OMR answer sheets with accuracy and speed. Upload your answer key and sheets, 
          and let the system handle the rest.
        </p>
        <button onClick={() => {navigate('/upload')}} className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-medium transition">
          Start Here
        </button>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-12 text-slate-800">
          How to Use the System
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl shadow-lg bg-white p-6 text-center">
            <div className="text-indigo-600 text-4xl font-bold mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2">Upload Answer Key</h3>
            <p className="text-slate-600">
              Select the number of questions and enter the correct answers into the system first.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl shadow-lg bg-white p-6 text-center">
            <div className="text-indigo-600 text-4xl font-bold mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2">Upload OMR Sheets</h3>
            <p className="text-slate-600">
              Scan your answer sheets (preferably using CamScanner) and upload them for evaluation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl shadow-lg bg-white p-6 text-center">
            <div className="text-indigo-600 text-4xl font-bold mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2">Get Your Results</h3>
            <p className="text-slate-600">
              Receive your graded marks instantly along with detailed feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-100 py-10 px-6 text-center mt-auto">
        <h3 className="text-xl font-semibold mb-2 text-slate-800">Need Help?</h3>
        <p className="text-slate-600 mb-4">If you have any concerns or issues, feel free to reach out:</p>
        <a
          href="mailto:support@example.com"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <Mail className="w-5 h-5" /> support@example.com
        </a>
      </section>
    </div>
  );
}
