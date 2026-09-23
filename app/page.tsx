```tsx
"use client";

import { useState } from "react";

type Game = "train" | "blocks" | "birds" | null;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [game, setGame] = useState<Game>(null);
  const [stars, setStars] = useState(12);
  const [celebration, setCelebration] = useState(false);

  const [redCars, setRedCars] = useState(2);
  const [blueCars, setBlueCars] = useState(3);

  const [tens, setTens] = useState(2);
  const [ones, setOnes] = useState(4);

  const [birdAnswer, setBirdAnswer] = useState<number | null>(null);

  function handleLogin() {
    if (username.toLowerCase() === "salma" && password === "shimbir") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Please check your username and password.");
    }
  }

  function logout() {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setGame(null);
  }

  function celebrate() {
    setStars((s) => s + 5);
    setCelebration(true);

    setTimeout(() => {
      setCelebration(false);
    }, 3500);
  }

  function checkTrain() {
    if (redCars + blueCars === 8) {
      celebrate();
    }
  }

  function checkNumber() {
    if (tens * 10 + ones === 24) {
      celebrate();
    }
  }

  function checkBirds() {
    if (birdAnswer === 6) {
      celebrate();
    }
  }

  function resetGame() {
    setGame(null);
    setRedCars(2);
    setBlueCars(3);
    setTens(2);
    setOnes(4);
    setBirdAnswer(null);
  }

  /* ---------------- LOGIN ---------------- */

  if (!loggedIn) {
    return (
      <main className="loginPage">

        <div className="loginCard">

          <div className="loginLogo">
            🐦
          </div>

          <h1>SHIMBIR</h1>

          <p className="loginTagline">
            Learn. Master. Fly higher.
          </p>

          <div className="loginRole">
            STUDENT LOGIN
          </div>

          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          {loginError && (
            <div className="loginError">
              {loginError}
            </div>
          )}

          <button
            className="loginButton"
            onClick={handleLogin}
          >
            LOG IN 🚀
          </button>

          <button className="qrButton">
            ▣ Sign in with QR code
          </button>

          <div className="loginFooter">
            <button
              onClick={() =>
                alert("Teacher login will be added next.")
              }
            >
              Teacher Login
            </button>
          </div>

          <div className="demoHint">
            Demo student: <strong>salma</strong> /{" "}
            <strong>shimbir</strong>
          </div>

        </div>

      </main>
    );
  }

  /* ---------------- LOGGED-IN APP ---------------- */

  return (
    <main className="app">

      <header className="topbar">

        <div className="brand">
          <span className="brandBird">🐦</span>
          <span className="brandName">SHIMBIR</span>
        </div>

        <div className="studentTop">

          <div className="topStars">
            ⭐ {stars}
          </div>

          <button
            className="logoutButton"
            onClick={logout}
          >
            Log out
          </button>

        </div>

      </header>

      {!game && (
        <section className="main">

          <div className="welcome">

            <div>
              <h1>Hi, Salma! 👋</h1>
              <p>
                Ready to learn, play, and fly higher?
              </p>
            </div>

            <div className="welcomeBird">
              🦅
            </div>

          </div>

          <section className="journey">

            <h2>Your Flight Journey</h2>

            <div className="flightPath">

              <div className="birdLevel active">
                <div className="birdEmoji">🐦</div>
                <strong>Kestrel</strong>
                <small>Level 1</small>
              </div>

              <div className="line done" />

              <div className="birdLevel">
                <div className="birdEmoji">🦅</div>
                <strong>Hawk</strong>
                <small>Level 2</small>
              </div>

              <div className="line" />

              <div className="birdLevel">
                <div className="birdEmoji">🦅</div>
                <strong>Eagle</strong>
                <small>Level 3</small>
              </div>

              <div className="line" />

              <div className="birdLevel">
                <div className="birdEmoji">🦅</div>
                <strong>Gyrfalcon</strong>
                <small>Level 4</small>
              </div>

              <div className="line" />

              <div className="birdLevel">
                <div className="birdEmoji">⚡</div>
                <strong>Peregrine</strong>
                <small>Goal</small>
              </div>

            </div>

          </section>

          <section>

            <h2 className="sectionTitle">
              🎮 Math Playground
            </h2>

            <div className="games">

              <div className="gameCard">

                <div className="gameIcon">
                  🚂
                </div>

                <div>
                  <h3>Train Builder</h3>
                  <p>Addition & Counting</p>
                </div>

                <button onClick={() => setGame("train")}>
                  PLAY →
                </button>

              </div>

              <div className="gameCard">

                <div className="gameIcon">
                  🔟
                </div>

                <div>
                  <h3>Build the Number</h3>
                  <p>Place Value</p>
                </div>

                <button onClick={() => setGame("blocks")}>
                  PLAY →
                </button>

              </div>

              <div className="gameCard">

                <div className="gameIcon">
                  🐦
                </div>

                <div>
                  <h3>Bird Count</h3>
                  <p>Counting & Comparing</p>
                </div>

                <button onClick={() => setGame("birds")}>
                  PLAY →
                </button>

              </div>

            </div>

          </section>

        </section>
      )}

      {/* TRAIN GAME */}

      {game === "train" && (
        <section className="gameArea">

          <div className="gameHeader">

            <button
              className="closeButton"
              onClick={resetGame}
            >
              ← Back
            </button>

            <div>⭐ {stars}</div>

          </div>

          <div className="question">

            <span>🚂</span>

            <h1>
              The train has 5 cars.
            </h1>

            <p>
              Add 3 more cars!
            </p>

          </div>

          <div className="train">

            <div className="trainEngine">
              🚂
            </div>

            {Array.from({
              length: redCars + blueCars,
            }).map((_, i) => (

              <div
                key={i}
                className={`trainCar ${
                  i < redCars
                    ? "redCar"
                    : "blueCar"
                }`}
              >
                {i < redCars ? "🔴" : "🔵"}
              </div>

            ))}

          </div>

          <div className="answerBox">
            <strong>
              Total cars: {redCars + blueCars}
            </strong>
          </div>

          <div className="controls">

            <div>

              <h3>Red cars</h3>

              <button
                className="controlButton redControl"
                onClick={() =>
                  setRedCars(
                    (n) => Math.max(0, n - 1)
                  )
                }
              >
                −
              </button>

              <span>{redCars}</span>

              <button
                className="controlButton redControl"
                onClick={() =>
                  setRedCars((n) => n + 1)
                }
              >
                +
              </button>

            </div>

            <div>

              <h3>Blue cars</h3>

              <button
                className="controlButton blueControl"
                onClick={() =>
                  setBlueCars(
                    (n) => Math.max(0, n - 1)
                  )
                }
              >
                −
              </button>

              <span>{blueCars}</span>

              <button
                className="controlButton blueControl"
                onClick={() =>
                  setBlueCars((n) => n + 1)
                }
              >
                +
              </button>

            </div>

          </div>

          <button
            className="checkButton"
            onClick={checkTrain}
          >
            CHECK MY TRAIN 🚂
          </button>

        </section>
      )}

      {/* BUILD NUMBER GAME */}

      {game === "blocks" && (
        <section className="gameArea">

          <div className="gameHeader">

            <button
              className="closeButton"
              onClick={resetGame}
            >
              ← Back
            </button>

            <div>⭐ {stars}</div>

          </div>

          <div className="question">

            <span>🔟</span>

            <h1>
              Build the number 24
            </h1>

            <p>
              Use tens and ones.
            </p>

          </div>

          <div className="baseTen">

            <div className="tensGroup">

              <h3>Tens</h3>

              {Array.from({
                length: tens,
              }).map((_, i) => (

                <div
                  className="tenBlock"
                  key={i}
                >
                  10
                </div>

              ))}

            </div>

            <div className="onesGroup">

              <h3>Ones</h3>

              {Array.from({
                length: ones,
              }).map((_, i) => (

                <div
                  className="oneBlock"
                  key={i}
                >
                  1
                </div>

              ))}

            </div>

          </div>

          <div className="answerBox">

            <strong>
              {tens} tens + {ones} ones ={" "}
              {tens * 10 + ones}
            </strong>

          </div>

          <div className="controls">

            <div>

              <h3>Tens</h3>

              <button
                className="controlButton"
                onClick={() =>
                  setTens(
                    (n) => Math.max(0, n - 1)
                  )
                }
              >
                −
              </button>

              <span>{tens}</span>

              <button
                className="controlButton"
                onClick={() =>
                  setTens((n) => n + 1)
                }
              >
                +
              </button>

            </div>

            <div>

              <h3>Ones</h3>

              <button
                className="controlButton"
                onClick={() =>
                  setOnes(
                    (n) => Math.max(0, n - 1)
                  )
                }
              >
                −
              </button>

              <span>{ones}</span>

              <button
                className="controlButton"
                onClick={() =>
                  setOnes((n) => n + 1)
                }
              >
                +
              </button>

            </div>

          </div>

          <button
            className="checkButton"
            onClick={checkNumber}
          >
            CHECK MY NUMBER 🔢
          </button>

        </section>
      )}

      {/* BIRD COUNT GAME */}

      {game === "birds" && (
        <section className="gameArea birdGame">

          <div className="gameHeader">

            <button
              className="closeButton"
              onClick={resetGame}
            >
              ← Back
            </button>

            <div>⭐ {stars}</div>

          </div>

          <div className="question">

            <span>🐦</span>

            <h1>
              How many birds?
            </h1>

            <p>
              Count carefully!
            </p>

          </div>

          <div className="flyingBirds">

            {Array.from({
              length: 6,
            }).map((_, i) => (

              <span key={i}>
                🐦
              </span>

            ))}

          </div>

          <div className="choiceGrid">

            {[4, 5, 6, 7].map((number) => (

              <button
                key={number}
                className={`choice ${
                  birdAnswer === number
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setBirdAnswer(number)
                }
              >
                {number}
              </button>

            ))}

          </div>

          <button
            className="checkButton"
            onClick={checkBirds}
          >
            CHECK MY ANSWER 🐦
          </button>

        </section>
      )}

      {/* CELEBRATION */}

      {celebration && (
        <div className="celebration">

          <div className="celebrationContent">

            <div className="bigStars">
              ⭐ ⭐ ⭐
            </div>

            <h1>
              AMAZING! 🎉
            </h1>

            <p>
              You mastered it!
            </p>

            <div className="reward">
              +5 ⭐
            </div>

            <div className="star">
              ⭐
            </div>

          </div>

        </div>
      )}

    </main>
  );
}
```
