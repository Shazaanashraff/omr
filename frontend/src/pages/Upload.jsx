import React from "react";
import { useState } from "react";

export default function Upload() {
  const [step, setStep] = useState(1);
  const [numQuestions, setNumQuestions] = useState("");
  const [numOptions, setNumOptions] = useState("");
  const [answers, setAnswers] = useState({});

  // handle answer selection
  const handleAnswerChange = (qIndex, option) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex + 1]: option, // dictionary with 1-based index
    }));
  };

  // handle submit
  const handleSubmit = () => {
    const data = {
      numQuestions: Number(numQuestions),
      numOptions: Number(numOptions),
      answers,
    };
    console.log("Final Data:", data);
    alert("Answer key saved! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Upload Answer Key
        </h1>

        {/* Step 1: Number of Questions */}
        {step === 1 && (
          <div className="text-center space-y-4">
            <label className="block mb-2 font-medium text-slate-700">
              Enter Number of Questions:
            </label>
            <input
              type="number"
              placeholder="e.g. 40"
              className="border rounded-lg px-4 py-2 w-60 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min={1}
            />
            <div>
              <button
                onClick={() => numQuestions && setStep(2)}
                className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
              >
                Save & Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Number of Options */}
        {step === 2 && (
          <div className="text-center space-y-4">
            <label className="block mb-2 font-medium text-slate-700">
              Enter Number of Options (e.g., 4 for A-D):
            </label>
            <input
              type="number"
              placeholder="e.g. 4"
              className="border rounded-lg px-4 py-2 w-60 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
              value={numOptions}
              onChange={(e) => setNumOptions(e.target.value)}
              min={2}
            />
            <div>
              <button
                onClick={() => numOptions && setStep(3)}
                className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
              >
                Save & Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Answer Selection */}
        {step === 3 && numQuestions && numOptions && (
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-4 text-center">
              Select Correct Answers
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                      const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C...
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

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
              >
                Save Answer Key
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
