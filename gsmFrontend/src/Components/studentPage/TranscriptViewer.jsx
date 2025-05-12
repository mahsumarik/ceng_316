import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TranscriptViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url } = location.state || {};

  if (!url) {
    return <div>Transcript bulunamadı.</div>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#222" }}>
      <button
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "10px 20px",
          background: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: "1rem",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        Kapat
      </button>
      <iframe
        src={url}
        title="Transcript PDF"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default TranscriptViewer; 