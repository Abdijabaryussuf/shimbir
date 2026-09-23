```tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);

  function handleLogin() {
    if (
      username.trim().toLowerCase() === "shimbir" &&
      password === "shimbir123"
    ) {
      setError("");
      setLoggedIn(true);
    } else {
      setError("Incorrect username or password.");
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
    setShowQR(false);
  }

  /*
   * =====================================================
   * LOGIN SCREEN
   * =====================================================
   */

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
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLogin();
              }
            }}
            autoComplete="current-password"
          />

          <button
            className="loginMainButton"
            onClick={handleLogin}
          >
            Let's Go! 🚀
          </button>

          {error && (
            <div className="loginError">
              ⚠️ {error}
            </div>
          )}

          <div className="loginDivider">
            <span>or</span>
          </div>

          <button
            className="qrButton"
            onClick={() => setShowQR(true)}
          >
            📷 Scan QR Code
          </button>

          {showQR && (
            <div className="qrScanArea">

              <div className="qrPlaceholder">
                📷
              </div>

              <h3>Scan Shimbir QR Code</h3>

              <p>
                QR sign-in will be connected to Shimbir
                accounts.
              </p>

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
            <strong>Demo Login</strong>

            <p>
              Username: <b>shimbir</b>
            </p>

            <p>
              Password: <b>shimbir123</b>
            </p>
          </div>

        </div>

      </main>
    );
  }

  /*
   * =====================================================
   * STUDENT DASHBOARD
   * =====================================================
   */

  return (
    <main className="studentScreen">

      <header className="appHeader">

        <div className="appBrand">
          <span>🐦</span>
          <strong>SHIMBIR</strong>
        </div>

        <button
          className="logoutButton"
          onClick={handleLogout}
        >
          Log out
        </button>

      </header>

      <section className="studentContent">

        <div className="studentBadge">
          🎒 Student
        </div>

        <div className="welcomeSection">

          <div>
            <h1>
              Hi, Salma! 👋
            </h1>

            <p>
              Ready to learn, master, and fly higher?
            </p>
          </div>

          <div className="welcomeBird">
            🦅
          </div>

        </div>

        <section className="journeyCard">

          <h2>
            Your Shimbir Journey
          </h2>

          <img
            src="/birds.svg"
            alt="Bird progression"
            className="journeyBirds"
          />

          <div className="journeyLabels">

            <span>
              🐦 Kestrel
            </span>

            <span>
              🦅 Hawk
            </span>

            <span>
              🦅 Eagle
            </span>

            <span>
              🦅 Gyrfalcon
            </span>

            <span>
              ⚡ Peregrine
            </span>

          </div>

        </section>

        <h2 className="sectionTitle">
          🎮 Math Playground
        </h2>

        <div className="gameGrid">

          <div className="gameCard">

            <div className="gameIcon">
              🚂
            </div>

            <h3>
              Train Builder
            </h3>

            <p>
              Build trains and practice counting,
              addition, and subtraction.
            </p>

            <button>
              PLAY 🚂
            </button>

          </div>

          <div className="gameCard">

            <div className="gameIcon">
              🔟
            </div>

            <h3>
              Build the Number
            </h3>

            <p>
              Use tens and ones to build numbers.
            </p>

            <button>
              PLAY 🔟
            </button>

          </div>

          <div className="gameCard">

            <div className="gameIcon">
              🐦
            </div>

            <h3>
              Bird Count
            </h3>

            <p>
              Count the birds and find the answer.
            </p>

            <button>
              PLAY 🐦
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
```
