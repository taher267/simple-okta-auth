import React from "react";
import "./App.css";
import {
  SecureRoute,
  Security,
  LoginCallback,
  useOktaAuth,
} from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { oktaConfig } from "./lib/oktaAuth";
import { Route, Routes, useNavigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Nav from "./Nav";

export default function App() {
  const oktaAuth = new OktaAuth(oktaConfig);
  const navigate = useNavigate();
  const CALLBACK_PATH = "/login/callback";
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={CALLBACK_PATH} element={<LoginCallback />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="locked" element={<Locked />} />
        </Route>
        <Route path="/login" element={<SignupLogin />} />
      </Routes>
    </Security>
  );
}

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  // const login = () => oktaAuth.signInWithRedirect({ originalUri: "/profile" });
  if (!authState) return <>Loading Authentication...</>;
  else if (!authState.isAuthenticated) {
    return (
      <div>
        Home Page
        {/* <button onClick={login}>Login</button> */}
      </div>
    );
  } else {
    return (
      <div>
        You authenticated bitch!{" "}
        {/* <button onClick={() => oktaAuth?.signOut({ revokeAccessToken: false })}>
          Logout
        </button> */}
      </div>
    );
  }
};

const Profile = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const logout = async () => {
    return oktaAuth.signOut("/");
  };
  React.useEffect(() => {
    const unsubscribe = oktaAuth
      .getUser()
      .then((u) => setUserInfo(u))
      .catch((e) => console.log(e));
    // if (!authState || !authState.isAuthenticated) setUserInfo(null);
    // else
    //   (async () => {
    //     const info = await oktaAuth.getUser();
    //     console.log(info);
    //     setUserInfo(info);
    //   })();
    return () => unsubscribe;
  }, []); //authState, oktaAuth

  const callBackend = async () => {
    const res = await fetch(`http://localhost:8008/api/protected`, {
      headers: {
        Authorization: `Bearer ${authState.accessToken.accessToken}`,
      },
    });
    if (!res.ok) return Promise.reject();
    const data = await res.json();
    console.log(data);
    // setMessages(data)
  };

  // if (!authState || !authState.isAuthenticated) {
  //   return <Navigate to="/" replace />
  // }
  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(userInfo).map((claim) => (
        <div style={{ border: "1px solid #080080" }} key={claim[0]}>
          <span style={{ minWidth: "150px", display: "inline-block" }}>
            {claim[0]}
          </span>
          - {typeof claim[1] !== "object" ? claim[1] : ""}
          {typeof claim[1] === "object" && (
            <div>
              {Object.entries(claim[1]).map((ent) => (
                <div
                  style={{ border: "1px solid rgb(196 5 233)" }}
                  key={ent[0]}
                >
                  {ent[1]}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div>
        <button onClick={callBackend}>Call api</button>
        {/* {console.log(messages)} */}
      </div>

      <div>
        {" "}
        <button onClick={() => oktaAuth.signOut({ revokeAccessToken: false })}>
          Logout
        </button>
      </div>
    </div>
  );
};

const Locked = () => {
  return <div>Locked</div>;
};

const SignupLogin = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const login = () => oktaAuth.signInWithRedirect({ originalUri: "/profile" });
  return (
    <div>
      <button onClick={login}>Okta Login</button>
    </div>
  );
};
