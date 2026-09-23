"use client";

import { useState } from "react";

type Game = "train" | "blocks" | "birds" | null;

export default function Home() {
  const [game, setGame] = useState<Game>(null);
  const [stars, setStars] = useState(12);
  const [celebration, setCelebration] = useState(false);

  const [redCars, setRedCars] = useState(2);
  const [blueCars, setBlueCars] = useState(3);

  const [blockTens, setBlockTens] = useState(2);
  const [blockOnes, setBlockOnes] = useState(4);

  const [birdAnswer, setBirdAnswer] = useState<number | null>(null);
  const [birdCount] = useState(6);

  function celebrate() {
    setStars((value) => value + 5);
    setCelebration(true);

    setTimeout(() => {
      setCelebration(false);
    }, 3500);
  }

  function checkTrain() {
    if (redCars + blueCars === 8) {
      celebrate();
    } else {
      alert("Great try! Count the train cars again. 🚂");
    }
  }

  function checkBlocks() {
    if (blockTens * 10 + blockOnes === 24) {
      celebrate();
    } else {
      alert("Look carefully at the tens and ones. Try again! 🔟");
    }
  }

  function checkBirds(answer: number) {
    setBirdAnswer(answer);

    if (answer === birdCount) {
      celebrate();
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brandBird">🐦</span>
          <span className="brandName">SHIMBIR</span>
        </div>

        <div className="topStars">⭐ {stars}</div>
      </header>

      <main className="main">
        <section className="welcome">
          <div>
            <h1>Hi, Salma! 👋</h1>
            <p>Ready to learn, master, and fly higher?</p>
          </div>

          <div style={{ fontSize: "55px" }}>🦅</div>
        </section>

        <section className="flightPath">
          <div className="flightTitle">YOUR SHIMBIR JOURNEY</div>

          <div className="birds">
            <div className="birdLevel">
              <span className="birdEmoji">🐦</span>
              <span className="birdLabel">Kestrel</span>
            </div>

            <div className="line done" />

            <div className="birdLevel">
              <span className="birdEmoji">🦅</span>
              <span className="birdLabel">Hawk</span>
            </div>

            <div className="line done" />

            <div className="birdLevel">
              <span className="birdEmoji">🦅</span>
              <span className="birdLabel">Eagle</span>
            </div>

            <div className="line" />

            <div className="birdLevel">
              <span className="birdEmoji">🦅</span>
              <span className="birdLabel">Gyrfalcon</span>
            </div>

            <div className="line" />

            <div className="birdLevel">
              <span className="birdEmoji">⚡</span>
              <span className="birdLabel">Peregrine</span>
            </div>
          </div>
        </section>

        <h2 className="sectionTitle">🎮 Math Playground</h2>

        <section className="games">
          <article className="gameCard">
            <div className="gameIcon">🚂</div>
            <h3>Train Builder</h3>
            <p>
              Practice counting and addition by building a train with colorful
              cars.
            </p>

            <button
              className="playButton"
              onClick={() => setGame("train")}
            >
              PLAY 🚂
            </button>
          </article>

          <article className="gameCard">
            <div className="gameIcon">🔟</div>
            <h3>Build the Number</h3>
            <p>
              Use tens and ones to build numbers and discover place value.
            </p>

            <button
              className="playButton"
              onClick={() => setGame("blocks")}
            >
              PLAY 🔟
            </button>
          </article>

          <article className="gameCard">
            <div className="gameIcon">🐦</div>
            <h3>Bird Count</h3>
            <p>
              Count the birds and choose the number that matches.
            </p>

            <button
              className="playButton"
              onClick={() => setGame("birds")}
            >
              PLAY 🐦
            </button>
          </article>
        </section>

        {game === "train" && (
          <section className="gameArea">
            <div className="gameHeader">
              <h2>🚂 Train Builder</h2>

              <button
                className="closeButton"
                onClick={() => setGame(null)}
              >
                ← Back
              </button>
            </div>

            <div className="question">
              The train has 5 cars.
              <br />
              Add 3 more cars.
            </div>

            <div className="train">
              <div className="trainEngine">🚂</div>

              {Array.from({ length: redCars }).map((_, index) => (
                <div className="trainCar redCar" key={`r-${index}`}>
                  🚗
                </div>
              ))}

              {Array.from({ length: blueCars }).map((_, index) => (
                <div className="trainCar blueCar" key={`b-${index}`}>
                  🚙
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: "24px", fontWeight: 900 }}>
              Cars: {redCars + blueCars}
            </div>

            <div className="controls" style={{ marginTop: "25px" }}>
              <button
                className="controlButton redControl"
                onClick={() => setRedCars(Math.max(0, redCars - 1))}
              >
                🔴 −
              </button>

              <button
                className="controlButton redControl"
                onClick={() => setRedCars(redCars + 1)}
              >
                🔴 +
              </button>

              <button
                className="controlButton blueControl"
                onClick={() => setBlueCars(Math.max(0, blueCars - 1))}
              >
                🔵 −
              </button>

              <button
                className="controlButton blueControl"
                onClick={() => setBlueCars(blueCars + 1)}
              >
                🔵 +
              </button>
            </div>

            <button
              className="checkButton"
              style={{ marginTop: "25px" }}
              onClick={checkTrain}
            >
              CHECK MY ANSWER
            </button>
          </section>
        )}

        {game === "blocks" && (
          <section className="gameArea">
            <div className="gameHeader">
              <h2>🔟 Build the Number</h2>

              <button
                className="closeButton"
                onClick={() => setGame(null)}
              >
                ← Back
              </button>
            </div>

            <div className="question">
              Build the number <strong>24</strong>.
            </div>

            <div className="baseTen">
              <div>
                <div className="tensGroup">
                  {Array.from({ length: blockTens }).map((_, index) => (
                    <div className="tenBlock" key={index} />
                  ))}
                </div>

                <div className="blockCount">
                  Tens: {blockTens}
                </div>
              </div>

              <div>
                <div className="onesGroup">
                  {Array.from({ length: blockOnes }).map((_, index) => (
                    <div className="oneBlock" key={index} />
                  ))}
                </div>

                <div className="blockCount">
                  Ones: {blockOnes}
                </div>
              </div>
            </div>

            <div className="controls" style={{ marginTop: "25px" }}>
              <button
                className="controlButton blueControl"
                onClick={() => setBlockTens(Math.max(0, blockTens - 1))}
              >
                − Ten
              </button>

              <button
                className="controlButton blueControl"
                onClick={() => setBlockTens(blockTens + 1)}
              >
                + Ten
              </button>

              <button
                className="controlButton"
                onClick={() => setBlockOnes(Math.max(0, blockOnes - 1))}
              >
                − One
              </button>

              <button
                className="controlButton"
                onClick={() => setBlockOnes(blockOnes + 1)}
              >
                + One
              </button>
            </div>

            <div className="blockCount">
              Your number: {blockTens * 10 + blockOnes}
            </div>

            <button
              className="checkButton"
              style={{ marginTop: "25px" }}
              onClick={checkBlocks}
            >
              CHECK MY NUMBER
            </button>
          </section>
        )}

        {game === "birds" && (
          <section className="gameArea">
            <div className="gameHeader">
              <h2>🐦 Bird Count</h2>

              <button
                className="closeButton"
                onClick={() => setGame(null)}
              >
                ← Back
              </button>
            </div>

            <div className="birdGame">
              <div className="question">
                How many birds do you see?
              </div>

              <div className="flyingBirds">
                {"🐦".repeat(birdCount)}
              </div>

              <div className="choiceGrid">
                {[4, 5, 6, 7].map((number) => (
                  <button
                    key={number}
                    className="choice"
                    onClick={() => checkBirds(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>

              {birdAnswer !== null && birdAnswer !== birdCount && (
                <div className="feedback">
                  Almost! Count them one more time. 🐦
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {celebration && (
        <div className="celebration">
          <div className="star">⭐</div>
          <div className="star">🌟</div>
          <div className="star">⭐</div>
          <div className="star">🌟</div>
          <div className="star">⭐</div>

          <div className="celebrationContent">
            <div className="bigStars">⭐⭐⭐⭐⭐</div>

            <h2>AMAZING, SALMA!</h2>

            <p>🎉 You mastered it! 🎉</p>

            <p>+5 stars ⭐</p>

            <button
              className="checkButton"
              onClick={() => setCelebration(false)}
            >
              KEEP FLYING 🐦
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
