import { useState } from "react";

export default function Plato({ onComplete }) {
  const [legs, setLegs] = useState("");
  const [bodyCover, setBodyCover] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const handleSubmit = () => {
    if (Number(legs) === 2 && bodyCover === "skin") {
      setSuccess(true);

      setTimeout(() => {
        onComplete();
      }, 3000); // 5 seconds

    } else {
      setFailure(true);

      setTimeout(() => {
        setLegs("")
        setBodyCover("")
        setSuccess(false)
        setFailure(false)
      }, 2000); // 5 seconds
    }
  };

  const isDisabled = legs === "" || bodyCover === "";

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Plato</h2>

      {!(success || failure) ? (
        <>
          {/* Numeric input */}
          <div>
            <label className="block mb-2">
              How many legs do you have?
            </label>
            <input
              type="number"
              min="0"
              value={legs}
              onChange={(e) => setLegs(e.target.value)}
              className="border rounded p-2 w-24"
            />
          </div>

          {/* Radio buttons */}
          <div>
            <p className="mb-2">What covers your body:</p>
            <label className="block">
              <input
                type="radio"
                name="body-cover"
                value="skin"
                checked={bodyCover === "skin"}
                onChange={(e) => setBodyCover(e.target.value)}
              />{" "}
              Skin
            </label>
            <label className="block">
              <input
                type="radio"
                name="body-cover"
                value="fur"
                checked={bodyCover === "fur"}
                onChange={(e) => setBodyCover(e.target.value)}
              />{" "}
              Fur
            </label>
            <label className="block">
              <input
                type="radio"
                name="body-cover"
                value="feathers"
                checked={bodyCover === "feathers"}
                onChange={(e) => setBodyCover(e.target.value)}
              />{" "}
              Feathers
            </label>
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
            src="/behold.png"
            alt="Behold, a human!"
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
