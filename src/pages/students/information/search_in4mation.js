import { useEffect, useState } from "react";

const API_BASE_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export default function SearchIn4mation() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASE_URL}/students/search?q=${encodeURIComponent(trimmed)}`,
          { credentials: "include" },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Không thể tra cứu sinh viên.");
        }
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms để đỡ gọi API liên tục khi gõ

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nhập mã sinh viên, họ tên hoặc lớp..."
      />

      {loading && <p>Đang tìm kiếm...</p>}
      {error && <p>{error}</p>}

      <ul>
        {results.map((sv) => (
          <li key={sv.id}>
            <strong>{sv.student_code}</strong> - {sv.full_name} (
            {sv.class_code || "Chưa có lớp"})
          </li>
        ))}
      </ul>
    </div>
  );
}
