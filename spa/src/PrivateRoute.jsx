import { Navigate, Outlet } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

export default function PrivateRoute({ children }) {
  const { authState, oktaAuth } = useOktaAuth();
  if (authState?.isAuthenticated) {
    return <Outlet />;
  } else if (authState?.isAuthenticated === false) {
    return <Navigate to="/" />;
  } else return <>Checking Authentication</>;
}
