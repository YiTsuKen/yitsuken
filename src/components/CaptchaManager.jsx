import { useState } from "react";

import Hello from "../captchas/Hello";
import Plato from "../captchas/Plato";
import CaptchaWin95Popups from "../captchas/CaptchaWin95Popups";
import CaptchaHoloEULA from "../captchas/CaptchaHoloEULA";
import CaptchaCallKupari from "../captchas/CaptchaCallKupari";
import CaptchaMinimalSlow from "../captchas/CaptchaMinimalSlow";
import Existential from "../captchas/Existential";
import Win95 from "../captchas/Win95";
import CaptchaHuman from "../captchas/CaptchaHuman";
import CaptchaGeocache from "../captchas/CaptchaGeocache";

const captchas = [
  CaptchaMinimalSlow,
  CaptchaHoloEULA,
  CaptchaHuman,
  CaptchaCallKupari,
  CaptchaWin95Popups,
  Existential,
  CaptchaGeocache,
  Plato,
  Win95,
];

export default function CaptchaManager() {
  const [index, setIndex] = useState(0);

  const NextCaptcha = captchas[index];

  const handleComplete = () => {
    setIndex((prev) => (prev + 1) % captchas.length);
  };

  return (
    <div>
      <h1>Stupid Captcha Site</h1>

      <NextCaptcha onComplete={handleComplete} />

      <footer className="mt-auto p-4 text-center">
        <a
          href="/captcha"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Captcha selection
        </a>
      </footer>
    </div>
  );
}