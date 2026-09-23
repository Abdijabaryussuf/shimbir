export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f7fb",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "90%",
        maxWidth: "700px",
        textAlign: "center",
        background: "white",
        padding: "50px 30px",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontSize: "70px" }}>🐦</div>

        <h1 style={{
          fontSize: "52px",
          margin: "10px 0",
          color: "#172033"
        }}>
          Shimbir
        </h1>

        <p style={{
          fontSize: "22px",
          color: "#596579"
        }}>
          Learn. Master. Fly higher.
        </p>

        <div style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginTop: "35px",
          flexWrap: "wrap"
        }}>
          <button style={{
            padding: "15px 30px",
            borderRadius: "12px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}>
            Student
          </button>

          <button style={{
            padding: "15px 30px",
            borderRadius: "12px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}>
            Teacher
          </button>
        </div>

        <p style={{
          marginTop: "30px",
          color: "#777"
        }}>
          Mathematics learning for young learners
        </p>
      </div>
    </main>
  );
}
