```tsx
"use client";

import { useState } from "react";

type Role = "student" | "teacher" | "parent" | "admin";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);

  function login() {
    if (
      username.trim().toLowerCase() === "shimbir" &&
      password === "shimbir123"
    ) {
      setError("");
      setLoggedIn(true);
      setRole("student");
    } else {
      setError("Please check your username and password.");
    }
  }

  function logout() {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  }

  if (!loggedIn) {
    return (
      <main className="loginScreen">
        <div className="loginContainer">

          <h1>Shimbir Learning Labs</h1>

          <p className="loginSubtitle">
            Learn. Master. Fly higher.
          </p>

          <img
            src="/birds.svg"
            alt="Shimbir bird journey"
            className="loginBirds"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            autoComplete="current-password"
          />

          <button
            className="loginMainButton"
            onClick={login}
          >
            Let's Fly! 🚀
          </button>

          {error && (
            <div className="loginError">
              {error}
            </div>
          )}

          <div className="loginDivider" />

          <div className="loginActions">

            <button
              className="qrButton"
              onClick={() => setShowQR(true)}
            >
              📷 Scan QR Code
            </button>

          </div>

          {showQR && (
            <div className="qrArea">

              <div className="qrPlaceholder">
                <div className="qrIcon">📷</div>

                <h3>Scan your Shimbir QR code</h3>

                <p>
                  QR sign-in will connect directly to your
                  Shimbir account.
                </p>
              </div>

              <button
                className="cancelQR"
                onClick={() => setShowQR(false)}
              >
                Cancel
              </button>

            </div>
          )}

          <div className="privacyLink">
            Privacy Policy
          </div>

          <div className="demoLogin">
            <strong>Demo Account</strong>
            <div>Username: <b>shimbir</b></div>
            <div>Password: <b>shimbir123</b></div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="studentScreen">

      <header className="appHeader">

        <div className="appBrand">
          🐦 <strong>SHIMBIR</strong>
        </div>

        <button
          className="logoutButton"
          onClick={logout}
        >
          Log out
        </button>

      </header>

      <section className="studentContent">

        <div className="studentBadge">
          🎒 Student
        </div>

        <h1>
          Hi, Salma! 👋
        </h1>

        <p className="studentIntro">
          Ready to learn, master, and fly higher?
        </p>

        <section className="journeyCard">

          <h2>Your Shimbir Journey</h2>

          <img
            src="/birds.svg"
            alt="Bird progression"
            className="journeyBirds"
          />

          <div className="journeyLabels">
            <span>🐦 Kestrel</span>
            <span>🦅 Hawk</span>
            <span>🦅 Eagle</span>
            <span>🦅 Gyrfalcon</span>
            <span>⚡ Peregrine</span>
          </div>

        </section>

        <h2 className="sectionTitle">
          🎮 Math Playground
        </h2>

        <div className="gameGrid">

          <div className="gameCard">
            <div className="gameIcon">🚂</div>
            <h3>Train Builder</h3>
            <p>
              Build trains and practice counting,
              addition, and subtraction.
            </p>
            <button>PLAY 🚂</button>
          </div>

          <div className="gameCard">
            <div className="gameIcon">🔟</div>
            <h3>Build the Number</h3>
            <p>
              Use tens and ones to build numbers.
            </p>
            <button>PLAY 🔟</button>
          </div>

          <div className="gameCard">
            <div className="gameIcon">🐦</div>
            <h3>Bird Count</h3>
            <p>
              Count the birds and find the answer.
            </p>
            <button>PLAY 🐦</button>
          </div>

        </div>

      </section>

    </main>
  );
}
```
