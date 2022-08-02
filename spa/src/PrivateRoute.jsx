import { Navigate, Outlet } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

export default function PrivateRoute({ children }) {
  const { authState, oktaAuth } = useOktaAuth();
  // const test = oktaAuth?._pending;
  // .then((d) => console.log(d));
  // console.log(test);

  if (authState?.isAuthenticated) {
    return <Outlet />;
  } else if (authState?.isAuthenticated === false) {
    return <Navigate to="/" />;
  } else return <>Checking Authentication</>;
}
