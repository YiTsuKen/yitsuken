import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from 'qrcode';

export default function CaptchaHuman({ onComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const canvasRef = useRef(null);

  // for control panel
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id"); // grabs user_id from query

  const [vouchCode, setVouchCode] = useState(userId);
  const [vouching, setVouching] = useState(false);
  const [vouchResult, setVouchResult] = useState(null);

  

  useEffect(() => {
    fetch("./api/getChallenge", {
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
        handleCheck();
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, `https://yitsuken.deno.dev/vouch?user_id=${data.challenge}`, { width: 200 }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [data]);

  const handleCheck = () => {
    setVerifying(true);
    setResult(null);

    fetch("./api/checkChallenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to verify challenge");
        return response.json();
      })
      .then((res) => {
        setResult(res.success);
      })
      .catch((err) => {
        setResult(`⚠️ Error: ${err.message}`);
      })
      .finally(() => setVerifying(false));
  };

  const handleVouch = () => {
    if (!vouchCode.trim()) return;
    setVouching(true);
    setVouchResult(null);

    fetch("./api/proveChallenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge: vouchCode }),
      credentials: "include"
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to vouch challenge");
        return response.json();
      })
      .then((res) => {
        console.log(res)
        if (res.success) {
          setVouchResult("✅ Successfully vouched!");
          setVouchCode("");
        } else {
          setVouchResult("❌ Failed to vouch challenge.");
        }
      })
      .catch((err) => {
        setVouchResult(`⚠️ Error: ${err.message}`);
      })
      .finally(() => setVouching(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 space-y-4">
      <p className="text-black-600 font-bold text-xl">Human interaction</p>
      <p className="text-black-300">
        Talk with a verified human to prove you're a human
      </p>

      <canvas ref={canvasRef} />

      <p className="text-black-300">Challenge code: {data.challenge}</p>

      <button
        onClick={handleCheck}
        disabled={verifying}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
      >
        {verifying ? "Checking..." : "Check"}
      </button>

      <p className="mt-2 font-medium">
        {result === true
          ? "✅ Verification successful!"
          : result === false
          ? "❌ Not yet verified."
          : typeof result === "string"
          ? result
          : ""}
      </p>

      {result === true && onComplete && <button
        onClick={onComplete}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
      >
        Proceed
      </button>}

      {result === true && (
        <div className="space-y-4 border-t pt-4 mt-4">
          <p className="text-black-600 font-bold text-lg">Control panel</p>
          <p className="text-black-300">Here you can verify others</p>

          <div className="flex space-x-2">
            <input
              type="text"
              value={vouchCode}
              onChange={(e) => setVouchCode(e.target.value)}
              placeholder="Enter challenge code"
              className="px-3 py-2 border rounded-lg flex-1"
            />
            <button
              onClick={handleVouch}
              disabled={vouching}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 disabled:opacity-50"
            >
              {vouching ? "Vouching..." : "Vouch"}
            </button>
          </div>

          {vouchResult && <p className="mt-2 font-medium">{vouchResult}</p>}
        </div>
      )}
    </div>
  );
}