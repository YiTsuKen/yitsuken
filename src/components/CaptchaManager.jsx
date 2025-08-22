import { useState } from "react";

import Hello from "../captchas/Hello";
import Plato from "../captchas/Plato";
import CaptchaWin95Popups from "../captchas/CaptchaWin95Popups";
import CaptchaHoloEULA from "../captchas/CaptchaHoloEULA";
import CaptchaCallKupari from "../captchas/CaptchaCallKupari";
import CaptchaMinimalSlow from "../captchas/CaptchaMinimalSlow";
import Existential from "../captchas/Existential";

import Win95 from "../captchas/Win95";

const captchas = [
  CaptchaMinimalSlow,
  CaptchaCallKupari,
  CaptchaHoloEULA,
  CaptchaWin95Popups,
  Existential,
  Plato,
  Win95,
  Hello,
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
    </div>
  );
}