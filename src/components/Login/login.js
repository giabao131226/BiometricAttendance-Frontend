
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ Mã sinh viên và Mật khẩu.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const mockUser = {
                fullName: "Hoàng Vũ",
                studentId: username,
                role: "student",
                classCode: "66CNTT2"
            };

            localStorage.setItem("user", JSON.stringify(mockUser));
            setLoading(false);
            navigate("/dashboard");
        }, 800);
    };

    return (
        <div className="auth-split-container">
            <div className="auth-image-side">
                <div className="auth-image-caption">
                    <h1>Hệ Thống Quản Lý Điểm Danh Sinh Viên</h1>
                    <p>Quản lý và theo dõi quá trình điểm danh sinh viên một cách nhanh chóng, hiệu quả.</p>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-card-modern">
                    <div className="auth-logo">
                        <h2>ĐĂNG NHẬP</h2>
                        <p>Chào mừng bạn quay trở lại!</p>
                    </div>

                    {error && (
                        <div className="alert-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Mã Sinh Viên / Tài khoản</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập mã sinh viên..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-velzon"
                            disabled={loading}
                        >
                            {loading ? "Đang xác thực..." : "Đăng Nhập"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
