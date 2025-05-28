import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/authCallBack/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layouts/MainLayout";
import { useTheme } from "./store/theme.store";
import { useEffect } from "react";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/MainAlbum/AlbumPage";

const App = () => {
  const { theme, initializeTheme } = useTheme();
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  return (
    <div
      className={`font-mono transition-all p-1 min-h-screen ${
        theme === "dark"
          ? "bg-base-300"
          : theme === "night"
          ? "bg-base-300"
          : "bg-gradient-to-br from-primary to-secondary"
      }`}
    >
      <Routes>
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpFallbackRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
