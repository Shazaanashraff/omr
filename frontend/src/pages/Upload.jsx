import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function AnswerKeyManager() {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [numOptions, setNumOptions] = useState("");
  const [answers, setAnswers] = useState({});
  const [savedKeys, setSavedKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);


  useEffect(() => {
    fetchSavedKeys();
  }, []);

  const fetchSavedKeys = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/omr/answers");
      setSavedKeys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerChange = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex + 1]: option,
    }));
  };

  const handleSaveKey = async () => {
    if (!quizName) return alert("Please enter a quiz name!");
    const payload = {
      name: quizName,
      numQuestions: Number(numQuestions),
      numOptions: Number(numOptions),
      answers,
    };
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/omr/answers", payload);
      alert("Answer key saved!");
      setQuizName("");
      setNumQuestions("");
      setNumOptions("");
      setAnswers({});
      setStep(1);
      fetchSavedKeys();
    } catch (err) {
      console.error(err);
      alert("Failed to save answer key.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };


  const handleSubmitSheet = async () => {
    if (!file) return alert("Please upload OMR sheet image!");
    if (!selectedKey) return alert("No answer key selected!");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("answers", JSON.stringify(selectedKey.answers));
    formData.append("quizName", selectedKey.name);
  
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/omr/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Response:", res.data);
      alert("Sheet processed! See below for results.");
  
      setSubmittedResult(res.data); // Store the result
      setFile(null);
      setSelectedKey(null);
    } catch (err) {
      console.error(err);
      alert("Failed to process sheet.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-indigo-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Manage Answer Keys
        </h1>

        {/* --- Create New Answer Key --- */}
        {step <= 4 && (
          <>
            {step === 1 && (
              <div className="text-center space-y-4">
                <label className="block mb-2 font-medium text-slate-700">
                  Quiz Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Math Quiz 1"
                  className="border rounded-lg px-4 py-2 w-72 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                />
                <button
                  onClick={() => quizName && setStep(2)}
                  className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="text-center space-y-4">
                <label className="block mb-2 font-medium text-slate-700">
                  Number of Questions:
                </label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-60 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  min={1}
                />
                <button
                  onClick={() => numQuestions && setStep(3)}
                  className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="text-center space-y-4">
                <label className="block mb-2 font-medium text-slate-700">
                  Number of Options:
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  value={numOptions}
                  onChange={(e) => setNumOptions(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-60 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                  min={2}
                />
                <button
                  onClick={() => numOptions && setStep(4)}
                  className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
                >
                  Next
                </button>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">
                  Select Correct Answers
                </h2>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {[...Array(Number(numQuestions))].map((_, qIndex) => (
                    <div
                      key={qIndex}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <span className="font-medium text-slate-700">
                        Q{qIndex + 1}
                      </span>
                      <div className="flex gap-4">
                        {[...Array(Number(numOptions))].map((_, optIndex) => {
                          const optionLetter = String.fromCharCode(65 + optIndex);
                          return (
                            <label
                              key={optIndex}
                              className="flex items-center gap-1 cursor-pointer text-slate-600"
                            >
                              <input
                                type="radio"
                                name={`q-${qIndex}`}
                                value={optionLetter}
                                checked={answers[qIndex + 1] === optionLetter}
                                onChange={() =>
                                  handleAnswerChange(qIndex, optionLetter)
                                }
                              />
                              {optionLetter}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={handleSaveKey}
                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Answer Key"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- Show Saved Keys --- */}
        {savedKeys.length > 0 && (
          <div className="mt-10">
            {submittedResult && (
  <div className="mt-10 bg-indigo-50 p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
      Quiz Result: {submittedResult.quizName || selectedKey?.name}
    </h2>

    <div className="text-center mb-4">
      <p className="text-lg font-medium">
        Total Questions: {submittedResult.totalQuestions}
      </p>
      <p className="text-lg font-medium">
        Correct: {submittedResult.correctCount} | Score: {submittedResult.scorePercentage}%
      </p>
    </div>

    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={[
              { name: "Correct", value: submittedResult.correctCount },
              { name: "Wrong", value: submittedResult.totalQuestions - submittedResult.correctCount },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            <Cell key="correct" fill="#22c55e" />
            <Cell key="wrong" fill="#ef4444" />
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-6 max-h-64 overflow-y-auto border p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Detailed Results</h3>
      {Object.entries(submittedResult.detailedResult).map(([q, res]) => (
        <div key={q} className={`p-1 ${res.isCorrect ? "bg-green-100" : "bg-red-100"} rounded mb-1`}>
          <strong>{q}:</strong> Correct: {res.correctAnswer}, Your Answer: {res.predictedAnswer || "Not detected"}
        </div>
      ))}
    </div>
  </div>
)}
            <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">
              Saved Answer Keys
            </h2>
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto border p-4 rounded-lg">
              {savedKeys.map((key) => (
                <li key={key._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span
                      className="font-medium cursor-pointer text-indigo-600 hover:underline"
                      onClick={() => setSelectedKey(key)}
                    >
                      {key.name}
                    </span>
                    {selectedKey?._id === key._id && (
                      <button
                        onClick={() => setSelectedKey(null)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      >
                        Close
                      </button>
                    )}
                  </div>

                  {/* Show full answers + upload button */}
                  {selectedKey?._id === key._id && (
                    <div className="mt-3 border-t pt-3 space-y-2 max-h-64 overflow-y-auto">
                      {Object.entries(selectedKey.answers).map(([q, ans]) => (
                        <div key={q}>
                          <strong>{q}:</strong> {ans}
                        </div>
                      ))}

                      <div className="mt-4">
                        <label className="block mb-2 font-medium text-slate-700">
                          Upload OMR Sheet:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="border rounded-lg px-4 py-2 w-full"
                        />
                        <button
                          onClick={handleSubmitSheet}
                          className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Submit Sheet"}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
