import { useState } from "react";

export default function CaptchaGeocache({ onComplete }) {
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const handleSubmit = () => {
    if (code == "dQw4w9WgXcQ") {
      setSuccess(true);

      setTimeout(() => {
        onComplete();
      }, 5000); // 5 seconds

    } else {
      setFailure(true);

      setTimeout(() => {
        setCode("")
        setSuccess(false)
        setFailure(false)
      }, 2000); // 5 seconds
    }
  };

  const isDisabled = code === "";

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Plato</h2>

      {!(success || failure) ? (
        <>
          <div>
            <label className="block mb-2">
              Enter the code from the geocache?
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded p-2 w-24"
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`mt-4 px-4 py-2 rounded text-white ${
              isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
            }`}
          >
            Submit
          </button>
        </>
      ) : success ? (
        <div className="space-y-4 text-center">
          <p className="text-green-600 font-bold text-lg">Success!</p>
          <img
            src="geocaching.jpg"
            alt="Geocaching!"
            className="mx-auto w-64 h-auto"
          />
          <p className="text-white-600 font-bold text-lg">Continuing to the next captcha...</p>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-red-600 font-bold text-lg">Nope! Try again!</p>
        </div>
      ) }
    </div>
  );
}
