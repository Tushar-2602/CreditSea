import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // import NavLink
import "./UploadPage.css"; // import the CSS file

export default function UploadXml({ uploadUrl = "http://localhost:5000/api/uploadData" }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isXmlFile = (f) => {
    if (!f) return false;
    const ext = f.name.split(".").pop()?.toLowerCase();
    return ext === "xml";
  };

  function handleFileChange(e) {
    setError("");
    setInfo("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!isXmlFile(f)) {
      setError("Please select a valid XML file (.xml).");
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large (max 5 MB).");
      setFile(null);
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!file) {
      setError("Please choose an XML file first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.status === 400) {
        setError(data.message || "Server returned an error (400).");
      } else if (res.status === 201) {
        setInfo(data.message || "✅ Upload successful!");
        setFile(null);
        e.target.reset();
      } else {
        setError(`Unexpected server response: ${res.status}`);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-container">
      <div className="top-nav">
        <NavLink to="/getData" className="nav-link">
          See Saved Info
        </NavLink>
      </div>

      <h2>Upload XML File</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="xmlFile" className="file-label">
          Choose XML file
        </label>
        <input
          id="xmlFile"
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          disabled={loading}
        />

        {file && (
          <p className="file-info">
            Selected: <b>{file.name}</b> ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}

        {error && <div className="alert error">{error}</div>}
        {info && <div className="alert success">{info}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
