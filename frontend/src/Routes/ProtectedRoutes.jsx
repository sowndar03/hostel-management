import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkUserRole } from "../utils/helper";

const ProtectedRoutes = ({ role }) => {
  let hasAccess = false;

  if (Array.isArray(role)) {
    hasAccess = role.some((r) => checkUserRole(r));
  } else {
    hasAccess = checkUserRole(role);
  }

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoutes;
