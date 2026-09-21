import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./components/Auth/Register";
import OtpVerification from "./components/OtpVerification";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import RoomImageInput from "./pages/RoomImageInput";
import DesignNext from "./pages/DesignNext";
import Furniture from "./pages/Furniture";
import MyDesigns from "./pages/MyDesigns";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <div className="app-container">
      <Toast />

      <Routes>
        {/* Home Page - authenticated landing; protected after login */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* OTP Verification */}
        <Route
          path="/otp-verify"
          element={<OtpVerification />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Design My Room workflow — step 1: room image input */}
        <Route
          path="/design"
          element={<RoomImageInput />}
        />

        {/* Design My Room workflow — step 2 (stub): style & generate */}
        <Route
          path="/design/next"
          element={<DesignNext />}
        />

        {/* Furniture catalog (future) */}
        <Route
          path="/furniture"
          element={<Furniture />}
        />

        {/* My Designs (future, private) */}
        <Route
          path="/designs"
          element={
            <ProtectedRoute>
              <MyDesigns />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Any unknown URL → Home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;