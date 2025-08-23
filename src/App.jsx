import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import CaptchaManager from "./components/CaptchaManager";

import Hello from "./captchas/Hello";
import Plato from "./captchas/Plato";
import CaptchaWin95Popups from "./captchas/CaptchaWin95Popups";
import CaptchaHoloEULA from "./captchas/CaptchaHoloEULA";
import CaptchaCallKupari from "./captchas/CaptchaCallKupari";
import CaptchaMinimalSlow from "./captchas/CaptchaMinimalSlow";
import Existential from "./captchas/Existential";
import Win95 from "./captchas/Win95";
import CaptchaHuman from "./captchas/CaptchaHuman";
import CaptchaGeocache from "./captchas/CaptchaGeocache";

function CaptchaList() {
  const captchas = [
    { path: "/captcha/plato", label: "Plato" },
    { path: "/captcha/win95popups", label: "Win95 Popups" },
    { path: "/captcha/eula", label: "Holo EULA" },
    { path: "/captcha/kupari", label: "Call Kupari" },
    { path: "/captcha/slow", label: "Minimal Slow" },
    { path: "/captcha/existential", label: "Existential" },
    { path: "/captcha/win95", label: "Win95" },
    { path: "/captcha/human", label: "Human" },
    { path: "/captcha/geocache", label: "Geocache" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Choose a Captcha</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {captchas.map((c) => (
          <Link key={c.path} to={c.path}>
            <button className="w-40 h-16 text-lg font-semibold rounded-2xl shadow-md bg-blue-500 hover:bg-blue-600 text-white transition">
              {c.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  //const navigate = useNavigate();

  const returnToList = () => {
    window.location.href = "/captcha";
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<CaptchaManager />} />
          <Route path="/vouch" element={<CaptchaHuman />} />
          <Route path="/captcha" element={<CaptchaList />} />
          <Route path="/captcha/plato" element={<Plato onComplete={returnToList} />} />
          <Route path="/captcha/win95popups" element={<CaptchaWin95Popups onComplete={returnToList} />} />
          <Route path="/captcha/eula" element={<CaptchaHoloEULA onComplete={returnToList} />} />
          <Route path="/captcha/kupari" element={<CaptchaCallKupari onComplete={returnToList} />} />
          <Route path="/captcha/slow" element={<CaptchaMinimalSlow onComplete={returnToList} />} />
          <Route path="/captcha/existential" element={<Existential onComplete={returnToList} />} />
          <Route path="/captcha/win95" element={<Win95 onComplete={returnToList} />} />
          <Route path="/captcha/human" element={<CaptchaHuman onComplete={returnToList} />} />
          <Route path="/captcha/geocache" element={<CaptchaGeocache onComplete={returnToList} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;