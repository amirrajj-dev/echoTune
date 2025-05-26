import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/authCallBack/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const App = () => {
  return (
    <div className="font-mono transition-all h-screen p-4 bg-gradient-to-br from-primary to-secondary">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpFallbackRedirectUrl={'/auth-callback'} />} />
      </Routes>
    </div>
  );
};

export default App;
