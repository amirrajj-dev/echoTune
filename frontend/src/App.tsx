import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/authCallBack/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react";
import MainLayout from "./layouts/MainLayout";
import { useTheme } from "./store/theme.store";
import { useEffect } from "react";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/MainAlbum/AlbumPage";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import { Toaster } from "sonner";
import NotFound from "./pages/notfound/NotFound";
import FavouritesPage from "./pages/favourites/FavouritesPage";
import { useAuthStore } from "./store/auth.store";
import PlayListsPage from "./pages/playlists/PlayListsPage";
import PlaylistPage from "./pages/playlist/PlayList";

const App = () => {
  const { theme, initializeTheme } = useTheme();
  const {isSignedIn} = useAuth()
  const {isAdmin} = useAuthStore()
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  return (
    <div
      className={`font-mono transition-all min-h-screen ${
        theme === "dark"
          ? "bg-base-300"
          : theme === "night"
          ? "bg-base-300"
          : "bg-gradient-to-br from-primary to-secondary"
      }`}
    >
      <Routes>
        <Route path="/auth-callback" element={<AuthCallbackPage/>} />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpFallbackRedirectUrl={"/auth-callback"}
            />
          }
        />
      <Route path="/admin-dashboard" element={isSignedIn && isAdmin ? <AdminDashboard/> : <NotFound/>} />
      <Route path="/playlists" element={isSignedIn ? <PlayListsPage/> : <NotFound/>} />
      <Route path="/playlists/:id" element={isSignedIn ? <PlaylistPage/> : <NotFound/>} />
      <Route path="/favourites" element={isSignedIn ? <FavouritesPage/> : <NotFound/>} />
      <Route path="*" element={<NotFound/>} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
