import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function NotFound({ user }) {
  const [isBack, setIsBack] = useState(false);

  if (isBack) {
    if (!user.role) {
      return <Navigate to="/login" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/auction" replace />;
    } else if (user.role === "owner") {
      return <Navigate to="/owner" replace />;
    }
  }

  return <button onClick={() => setIsBack(!isBack)}>Kembali</button>;
}

export default NotFound;
