import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [file, setFile] = useState(null);
  const [englishText, setEnglishText] = useState("");
  const [hindiText, setHindiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFile(selectedFile || null);
    setEnglishText("");
    setHindiText("");
    setError("");
  };

  const translatePage = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setEnglishText("");
    setHindiText("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/ocr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setEnglishText(data.english_text || "No English text detected.");
      setHindiText(data.hindi_text || "No Hindi translation available.");
    } catch (err) {
      console.error("Translation error:", err);

      setError(
        "Could not connect to the translation server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setEnglishText("");
    setHindiText("");
    setError("");

    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="app">
      <header>
        <h1>📚 English → Hindi Book Translator</h1>

        <p className="subtitle">
          Upload an English book page and translate it into Hindi using OCR.
        </p>
      </header>

      <main>
        {/* Upload Section */}
        <section className="upload-box">
          <h2>📤 Upload Book Page</h2>

          <label htmlFor="file-input" className="file-label">
            Choose an English image
          </label>

          <input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
          />

          {file && (
            <div className="filename">
              <span>Selected:</span>{" "}
              <strong>{file.name}</strong>
            </div>
          )}

          <div className="button-group">
            <button
              className="translate-button"
              onClick={translatePage}
              disabled={!file || loading}
            >
              {loading ? "⏳ Translating..." : "🚀 Translate to Hindi"}
            </button>

            {(file || englishText || hindiText || error) && (
              <button
                className="clear-button"
                onClick={clearAll}
                disabled={loading}
              >
                🗑️ Clear
              </button>
            )}
          </div>

          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>Reading image and translating text...</p>
            </div>
          )}

          {error && <p className="error">{error}</p>}
        </section>

        {/* Results */}
        <section className="results">
          <div className="result-box english-box">
            <h2>🇬🇧 English Text</h2>

            {englishText ? (
              <pre>{englishText}</pre>
            ) : (
              <p className="placeholder">
                Extracted English text will appear here.
              </p>
            )}
          </div>

          <div className="result-box hindi-box">
            <h2>🇮🇳 Hindi Translation</h2>

            {hindiText ? (
              <pre>{hindiText}</pre>
            ) : (
              <p className="placeholder">
                Hindi translation will appear here.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>English → Hindi Translator • OCR Powered</p>
      </footer>
    </div>
  );
}

export default App;
