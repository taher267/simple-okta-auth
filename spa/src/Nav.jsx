import { NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { useEffect } from "react";
export default function Nav({ unAuthNav = 4 }) {
  const { authState, oktaAuth } = useOktaAuth();

  return (
    <ul
      style={{
        background: "#009dea",
        display: "grid",
        gridTemplate: `repeat(1, 50px) / repeat(${
          authState?.isAuthenticated ? unAuthNav : 3
        }, 90px)`,
        justifyContent: "space-around",
        alignItems: "center",
        // gridTemplate: "repeat(1, 1fr) / repeat(5, 1fr)",
      }}
    >
      <li>
        <NavLink to="/">LOGO</NavLink>
      </li>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      {authState?.isAuthenticated ? (
        <>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => oktaAuth.signOut({ revokeAccessToken: false })}
            >
              Logout
            </span>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </>
      )}
    </ul>
  );
}
