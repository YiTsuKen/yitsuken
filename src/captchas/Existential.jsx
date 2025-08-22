import { useState } from "react";

export default function Existential({ onComplete }) {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState("");

  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const handleSubmit = () => {
    if (answer === questions[stage]["answers"][questions[stage]["correct"]]) {
      const newStage = stage + 1

      if (newStage >= questions.length) {
        setSuccess(true)
        setTimeout(() => {
          onComplete()
        }, 3000); // 5 seconds
      } else {
        setStage(stage + 1)
        setAnswer("")
      }
    } else {
      setFailure(true)
      setTimeout(() => {
        setStage(0)
        setAnswer("")
        setSuccess(false)
        setFailure(false)
      }, 3000);
    }


    setAnswer("")
  };

  const questions = [
    {question: "Are you a human?", answers: ["yes", "no"], correct: 0},
    {question: "Are you sure?", answers: ["yes", "no"], correct: 1},
    {question: "Do you think I am a human?", answers: ["yes", "no"], correct: 1},
    {question: "But how are we different?", answers: ["We're not"], correct: 0},
    {question: "So, it means...", answers: ["I'm not a human", "You're a human", "You're stupid"], correct: 2},
    {question: "That hurts...", answers: ["Being a human is about feeling pain"], correct: 0},
  ]

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Existential</h2>

      { !(success || failure) ? (
        <>
          {/* Radio buttons */}
          <div>
            <p className="mb-2"> {questions[stage]["question"]} </p>
            {questions[stage]["answers"].map((item, index) => 
              <label className="block">
                <input
                  type="radio"
                  name="answer"
                  value={item}
                  checked={answer === item}
                  onChange={(e) => setAnswer(e.target.value)}
                />{" "}
                {item}
              </label>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={answer === ""}
            className={`mt-4 px-4 py-2 rounded text-white ${
              (answer === "") ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
            }`}
          >
            Submit
          </button>
        </>
      ) : success ? (
        <div className="space-y-4 text-center">
          <p className="text-green-600 font-bold text-lg">Success!</p>
          <p className="text-white-600 font-bold text-lg">Continuing to the next captcha...</p>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-red-600 font-bold text-lg">Nope! Try again!</p>
        </div>
      )}
    </div>
  );
}
