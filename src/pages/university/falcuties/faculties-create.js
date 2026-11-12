
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import "../../../styles/faculties/faculty-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function FacultyCreate() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        faculty_code: "",
        faculty_name: "",
        description: "",
        status: true
    });

    const validate = () => {
        const newErrors = {};

        const facultyCode = formData.faculty_code.trim();
        const facultyName = formData.faculty_name.trim();

        if (!facultyCode) {
            newErrors.faculty_code = "Vui lòng nhập mã khoa!";
        } else if (facultyCode.length > 20) {
            newErrors.faculty_code = "Mã khoa không được vượt quá 20 ký tự!";
        } else if (/\s/.test(facultyCode)) {
            newErrors.faculty_code = "Mã khoa không được chứa khoảng trắng!";
        }

        if (!facultyName) {
            newErrors.faculty_name = "Vui lòng nhập tên khoa!";
        } else if (facultyName.length > 150) {
            newErrors.faculty_name = "Tên khoa không được vượt quá 150 ký tự!";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validate()) {
            SwalAlert({
                status: "warning",
                title: "Dữ liệu không hợp lệ!",
                message: "Vui lòng kiểm tra lại các thông tin đã nhập.",
                time: 3000
            });
            return;
        }

        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            const response = await fetch(`${apiUrl}/university/faculty/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    faculty_code: formData.faculty_code.trim(),
                    faculty_name: formData.faculty_name.trim(),
                    description: formData.description.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    title: data.detail?.title || "Tạo khoa thất bại!",
                    message: data.detail?.message || "Không thể tạo khoa. Vui lòng thử lại."
                };
            }

            if (data.success) {
                SwalAlert({
                    status: "success",
                    title: data.title,
                    message: data.message,
                    time: 3000
                });

                setFormData({
                    faculty_code: "",
                    faculty_name: "",
                    description: "",
                    status: true
                });

                setErrors({});
            } else {
                SwalAlert({
                    status: "error",
                    title: data.title || "Tạo khoa thất bại!",
                    message: data.message || "Không thể tạo khoa. Vui lòng thử lại.",
                    time: 3000
                });
            }
        } catch (ex) {
            SwalAlert({
                status: "error",
                title: ex.title || "Có lỗi xảy ra!",
                message: ex.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
                time: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, apiUrl, isSubmitting]);

    return (
        <div className="faculty-create">
            <div className="faculty-create-header">
                <div>
                    <div className="faculty-create-breadcrumb">
                        <span onClick={() => navigate("/university/faculties")}>
                            Quản lý khoa
                        </span>
                        <span>/</span>
                        <span>Thêm khoa</span>
                    </div>
                    <h2>Thêm khoa mới</h2>
                    <p>Nhập thông tin để tạo một khoa mới trong hệ thống.</p>
                </div>

                <button
                    type="button"
                    className="faculty-create-back"
                    onClick={() => navigate("/university/faculties")}
                >
                    <ArrowLeft size={17} />
                    Quay lại
                </button>
            </div>

            <form className="faculty-create-form" onSubmit={handleSubmit}>
                <div className="faculty-create-card">
                    <div className="faculty-create-card-header">
                        <div className="faculty-create-icon">
                            <Building2 size={21} />
                        </div>
                        <div>
                            <h3>Thông tin khoa</h3>
                            <p>Các thông tin cơ bản của khoa</p>
                        </div>
                    </div>

                    <div className="faculty-create-card-body">
                        <div className="faculty-create-row">
                            <div className="faculty-create-field">
                                <label htmlFor="faculty_code">
                                    Mã khoa <span>*</span>
                                </label>

                                <input
                                    id="faculty_code"
                                    name="faculty_code"
                                    type="text"
                                    placeholder="Ví dụ: CNTT"
                                    maxLength={20}
                                    value={formData.faculty_code}
                                    onChange={handleChange}
                                    className={errors.faculty_code ? "is-invalid" : ""}
                                />

                                {errors.faculty_code ? (
                                    <small className="text-danger">
                                        {errors.faculty_code}
                                    </small>
                                ) : (
                                    <small>Mã khoa không được vượt quá 20 ký tự.</small>
                                )}
                            </div>

                            <div className="faculty-create-field">
                                <label htmlFor="faculty_name">
                                    Tên khoa <span>*</span>
                                </label>

                                <input
                                    id="faculty_name"
                                    name="faculty_name"
                                    type="text"
                                    placeholder="Ví dụ: Khoa Công nghệ thông tin"
                                    maxLength={150}
                                    value={formData.faculty_name}
                                    onChange={handleChange}
                                    className={errors.faculty_name ? "is-invalid" : ""}
                                />

                                {errors.faculty_name ? (
                                    <small className="text-danger">
                                        {errors.faculty_name}
                                    </small>
                                ) : (
                                    <small>Tên khoa không được vượt quá 150 ký tự.</small>
                                )}
                            </div>
                        </div>

                        <div className="faculty-create-field">
                            <label htmlFor="description">Mô tả</label>

                            <textarea
                                id="description"
                                name="description"
                                placeholder="Nhập mô tả về khoa..."
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                            />

                            <small>
                                Thông tin giới thiệu về chức năng và lĩnh vực đào tạo của khoa.
                            </small>
                        </div>

                        <div className="faculty-create-status">
                            <div>
                                <strong>Trạng thái hoạt động</strong>
                                <p>Cho phép khoa được sử dụng trong hệ thống.</p>
                            </div>

                            <label className="faculty-create-switch">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                <span className="faculty-create-slider"></span>
                            </label>
                        </div>

                        <div className="faculty-create-status-label">
                            <span className={formData.status ? "active" : "inactive"}>
                                {formData.status ? "Đang hoạt động" : "Ngừng hoạt động"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="faculty-create-actions">
                    <button
                        type="button"
                        className="faculty-create-cancel"
                        onClick={() => navigate("/university/faculties")}
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        className="faculty-create-submit"
                        disabled={isSubmitting}
                    >
                        <Save size={17} />
                        {isSubmitting ? "Đang tạo..." : "Tạo khoa"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FacultyCreate;
