```tsx
"use client";

import { useState } from "react";

type Role = "student" | "teacher" | "parent" | "admin";

const roles = [
  {
    id: "student" as Role,
    name: "Student",
    icon: "🎒",
    description: "Learn, practice, and play",
  },
  {
    id: "teacher" as Role,
    name: "Teacher",
    icon: "📚",
    description: "Teach and track your class",
  },
  {
    id: "parent" as Role,
    name: "Parent",
    icon: "🏠",
    description: "Follow your child's journey",
  },
  {
    id: "admin" as Role,
    name: "Admin",
    icon: "⚙️",
    description: "Manage Shimbir",
  },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {
    if (
      username.trim().toLowerCase() === "shimbir" &&
      password === "shimbir123"
    ) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Incorrect username or password.");
    }
  }

  function logout() {
    setLoggedIn(false);
    setRole(null);
    setUsername("");
    setPassword("");
    setError("");
  }

  /*
   * STEP 1
   * LOGIN
   */

  if (!loggedIn) {
    return (
      <main className="loginPage">
        <div className="loginBackgroundBird birdOne">
          🐦
        </div>

        <div className="loginBackgroundBird birdTwo">
          🦅
        </div>

        <section className="loginCard">

          <div className="loginLogo">
            🐦
          </div>

          <h1>SHIMBIR</h1>

          <p className="loginTagline">
            Learn. Master. Fly higher.
          </p>

          <div className="loginWelcome">
            <h2>Welcome back! 👋</h2>

            <p>
              Sign in to your Shimbir account.
            </p>
          </div>

          <div className="formGroup">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
            />

          </div>

          <div className="formGroup">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  login();
                }
              }}
            />

          </div>

          {error && (
            <div className="loginError">
              ⚠️ {error}
            </div>
          )}

          <button
            className="loginButton"
            onClick={login}
          >
            LOG IN 🚀
          </button>

          <button
            className="qrButton"
            onClick={() =>
              alert(
                "QR code login will be connected to Shimbir accounts."
              )
            }
          >
            ▣ Sign in with QR code
          </button>

          <div className="loginDivider">
            <span>One Shimbir account</span>
          </div>

          <div className="roles">
            <span>🎒 Student</span>
            <span>📚 Teacher</span>
            <span>🏠 Parent</span>
            <span>⚙️ Admin</span>
          </div>

          <div className="demoAccounts">
            <strong>Demo login</strong>

            <p>
              Username: <b>shimbir</b>
            </p>

            <p>
              Password: <b>shimbir123</b>
            </p>
          </div>

        </section>
      </main>
    );
  }

  /*
   * STEP 2
   * CHOOSE ROLE
   *
   * This is temporary.
   * The database will determine this automatically later.
   */

  if (!role) {
    return (
      <main className="rolePage">

        <section className="roleCard">

          <div className="smallLogo">
            🐦
          </div>

          <h1>Who are you?</h1>

          <p>
            Choose a role to preview the Shimbir dashboard.
          </p>

          <div className="roleGrid">

            {roles.map((item) => (
              <button
                key={item.id}
                className="roleChoice"
                onClick={() => setRole(item.id)}
              >

                <div className="roleIcon">
                  {item.icon}
                </div>

                <strong>
                  {item.name}
                </strong>

                <span>
                  {item.description}
                </span>

              </button>
            ))}

          </div>

          <button
            className="logoutFromRole"
            onClick={logout}
          >
            ← Log out
          </button>

        </section>

      </main>
    );
  }

  /*
   * STUDENT
   */

  if (role === "student") {
    return (
      <main className="app">

        <header className="topbar">

          <div className="brand">
            <span className="brandBird">
              🐦
            </span>

            <span className="brandName">
              SHIMBIR
            </span>
          </div>

          <div className="studentTop">

            <div className="topStars">
              ⭐ 12
            </div>

            <button
              className="logoutButton"
              onClick={logout}
            >
              Log out
            </button>

          </div>

        </header>

        <section className="main">

          <div className="accountBadge">
            🎒 Student Account
          </div>

          <div className="welcome">

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

          <section className="journey">

            <h2>
              Your Shimbir Journey
            </h2>

            <div className="flightPath">

              <div className="birdLevel active">

                <div className="birdEmoji">
                  🐦
                </div>

                <strong>
                  Kestrel
                </strong>

              </div>

              <div className="line done" />

              <div className="birdLevel">

                <div className="birdEmoji">
                  🦅
                </div>

                <strong>
                  Hawk
                </strong>

              </div>

              <div className="line" />

              <div className="birdLevel">

                <div className="birdEmoji">
                  🦅
                </div>

                <strong>
                  Eagle
                </strong>

              </div>

              <div className="line" />

              <div className="birdLevel">

                <div className="birdEmoji">
                  🦅
                </div>

                <strong>
                  Gyrfalcon
                </strong>

              </div>

              <div className="line" />

              <div className="birdLevel">

                <div className="birdEmoji">
                  ⚡
                </div>

                <strong>
                  Peregrine
                </strong>

              </div>

            </div>

          </section>

          <h2 className="sectionTitle">
            🎮 Math Playground
          </h2>

          <div className="games">

            <div className="gameCard">

              <div className="gameIcon">
                🚂
              </div>

              <h3>
                Train Builder
              </h3>

              <p>
                Practice counting and addition.
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
                Explore tens and ones.
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
                Count birds and find the answer.
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

  /*
   * TEACHER / PARENT / ADMIN
   */

  const dashboardData = {
    teacher: {
      title: "Teacher Dashboard",
      icon: "📚",
      greeting: "Welcome, Teacher! 👋",
      cards: [
        ["👩‍🎓", "My Students", "View student learning and mastery."],
        ["📝", "Assignments", "Create and manage assignments."],
        ["🎬", "Lessons", "Upload and organize lessons."],
        ["📊", "Progress", "Monitor classroom progress."],
      ],
    },

    parent: {
      title: "Parent Dashboard",
      icon: "🏠",
      greeting: "Welcome, Parent! 👋",
      cards: [
        ["👧", "My Children", "View your child's journey."],
        ["📊", "Progress", "See math learning progress."],
        ["⭐", "Achievements", "View stars and milestones."],
        ["💬", "Messages", "Connect with the teacher."],
      ],
    },

    admin: {
      title: "Admin Dashboard",
      icon: "⚙️",
      greeting: "Welcome, Administrator! 👋",
      cards: [
        ["👥", "Users", "Manage Shimbir accounts."],
        ["🏫", "Schools", "Manage schools and classes."],
        ["📊", "Reports", "View learning reports."],
        ["⚙️", "Settings", "Configure Shimbir."],
      ],
    },
  };

  const dashboard =
    dashboardData[role];

  return (
    <main className="roleDashboard">

      <header className="topbar">

        <div className="brand">

          <span className="brandBird">
            🐦
          </span>

          <span className="brandName">
            SHIMBIR
          </span>

        </div>

        <button
          className="logoutButton"
          onClick={logout}
        >
          Log out
        </button>

      </header>

      <section className="dashboardContent">

        <div className="accountBadge">
          {dashboard.icon} {dashboard.title}
        </div>

        <h1>
          {dashboard.greeting}
        </h1>

        <p className="dashboardIntro">
          You are currently signed in as a{" "}
          <strong>
            {dashboard.title.replace(
              " Dashboard",
              ""
            )}
          </strong>
          .
        </p>

        <div className="dashboardGrid">

          {dashboard.cards.map(
            ([icon, title, description]) => (

              <div
                className="dashboardCard"
                key={title}
              >

                <span>
                  {icon}
                </span>

                <h2>
                  {title}
                </h2>

                <p>
                  {description}
                </p>

                <button>
                  OPEN
                </button>

              </div>

            )
          )}

        </div>

      </section>

    </main>
  );
}
```
