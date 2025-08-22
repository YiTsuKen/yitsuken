import { useState } from "react";

import Hello from "../captchas/Hello";
// import Captcha2 from "../captchas/Captcha2";
// import Captcha3 from "../captchas/Captcha3";

const captchas = [
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