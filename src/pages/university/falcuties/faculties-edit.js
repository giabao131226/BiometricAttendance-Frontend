
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import "../../../styles/faculties/faculty-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function FacultyEdit() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const params = useParams();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        faculty_code: "",
        faculty_name: "",
        description: "",
        status: "active"
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
            [name]: type === "checkbox"
                ? (checked ? "active" : "inactive")
                : value
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

            const response = await fetch(`${apiUrl}/university/faculty/edit/${params.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    faculty_code: formData.faculty_code.trim(),
                    faculty_name: formData.faculty_name.trim(),
                    description: formData.description.trim(),
                    status: formData.status
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    title: data.detail?.title || "Cập nhật khoa thất bại!",
                    message: data.detail?.message || "Không thể cập nhật thông tin khoa. Vui lòng thử lại."
                };
            }

            if (data.success) {
                SwalAlert({
                    status: "success",
                    title: data.title || "Cập nhật khoa thành công!",
                    message: data.message || "Thông tin khoa đã được cập nhật thành công.",
                    time: 3000
                });

                setErrors({});

                setTimeout(() => {
                    navigate("/university/faculties");
                }, 1000);
            } else {
                SwalAlert({
                    status: "error",
                    title: data.title || "Cập nhật khoa thất bại!",
                    message: data.message || "Không thể cập nhật thông tin khoa. Vui lòng thử lại.",
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
    }, [formData, apiUrl, isSubmitting, params.id, navigate]);

    useEffect(() => {
        fetch(`${apiUrl}/university/faculty/detail/${params.id}`, {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail?.message || "Không thể lấy thông tin khoa.");
            }

            return data;
        }).then(data => {
            setFormData({
                ...data.detail,
                status: data.detail.status === "inactive" ? "inactive" : "active"
            });
        }).catch(ex => {
            SwalAlert({
                status: "error",
                title: "Có lỗi xảy ra",
                message: ex.message,
                time: 3000
            });
        });
    }, [apiUrl, params.id]);

    return (
        <div className="faculty-create">
            <div className="faculty-create-header">
                <div>
                    <div className="faculty-create-breadcrumb">
                        <span onClick={() => navigate("/university/faculties")}>
                            Quản lý khoa
                        </span>
                        <span>/</span>
                        <span>Chỉnh sửa khoa</span>
                    </div>

                    <h2>Chỉnh sửa thông tin khoa</h2>
                    <p>Cập nhật thông tin và trạng thái hoạt động của khoa trong hệ thống.</p>
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
                            <p>Chỉnh sửa các thông tin cơ bản của khoa</p>
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
                                value={formData.description || ""}
                                onChange={handleChange}
                            />

                            <small>
                                Cập nhật thông tin giới thiệu về chức năng và lĩnh vực đào tạo của khoa.
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
                                    checked={formData.status === "active"}
                                    onChange={handleChange}
                                />
                                <span className="faculty-create-slider"></span>
                            </label>
                        </div>

                        <div className="faculty-create-status-label">
                            <span className={formData.status}>
                                {formData.status === "active"
                                    ? "Đang hoạt động"
                                    : "Ngừng hoạt động"}
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
                        {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FacultyEdit;
