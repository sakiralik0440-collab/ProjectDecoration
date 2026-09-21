import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, token, logout, restoring } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const isLoggedIn = Boolean(token);

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          Project<span>Decoration</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      <nav className={`navbar-menu ${open ? "open" : ""}`} aria-label="Main navigation">
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <NavLink to="/designs" className={linkClass} onClick={() => setOpen(false)}>
                  My Designs
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {restoring ? (
            <span className="navbar-restoring" aria-hidden="true" />
          ) : isLoggedIn ? (
            <>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;