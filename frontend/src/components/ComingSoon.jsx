import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = ({ title, message }) => {
  return (
    <div className="coming-soon">
      <h1>{title}</h1>
      <p>
        {message || "This page is on its way. Please check back soon."}
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default ComingSoon;