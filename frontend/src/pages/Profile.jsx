import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <p className="coming-soon">Loading profile...</p>;
  }

  return (
    <div className="auth-container profile">
      <h2>Welcome, {user.name}!</h2>
      <p className="profile-meta">Email: {user.email}</p>
      <button type="button" className="btn btn-secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;