import { Navigate } from "react-router-dom";

function ProtectedDealerRoute({ children }) {
  const token = localStorage.getItem("dealerToken");

  if (!token) {
    return <Navigate to="/dealer/login" replace />;
  }

  return children;
}

export default ProtectedDealerRoute;
