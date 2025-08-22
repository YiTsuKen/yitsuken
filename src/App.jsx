import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CaptchaManager from "./components/CaptchaManager";
import CaptchaHuman from "./captchas/CaptchaHuman";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<CaptchaManager />} />
          <Route path="/vouch" element={<CaptchaHuman />} />
          <Route path="/abbb" element={<CaptchaHuman />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;