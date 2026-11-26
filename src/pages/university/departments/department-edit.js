
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import "../../../styles/departments/department-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function DepartmentEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        department_code: "",
        department_name: "",
        description: "",
        faculty_id: "",
        head_of_department: "",
        email: "",
        phone: "",
        status: "active"
    });

    const fetchFaculties = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/university/faculty`, {
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                setFaculties(result.faculties || result.data || result);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khoa:", error);
        }
    }, [apiUrl]);

    const fetchDepartment = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/university/department/detail/${id}`, {
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                SwalAlert({
                    icon: "error",
                    title: "Thất bại",
                    text: result.detail?.message || "Không thể lấy thông tin bộ môn"
                });
                return;
            }

            const department = result.detail || result;

            setFormData({
                department_code: department.department_code || "",
                department_name: department.department_name || "",
                description: department.description || "",
                faculty_id: department.faculty_id || "",
                head_of_department: department.head_of_department || "",
                email: department.email || "",
                phone: department.phone || "",
                status: department.status || "active"
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin bộ môn:", error);

            SwalAlert({
                icon: "error",
                title: "Thất bại",
                text: "Không thể kết nối đến máy chủ"
            });
        } finally {
            setLoadingData(false);
        }
    }, [apiUrl, id]);

    useEffect(() => {
        fetchFaculties();
        fetchDepartment();
    }, [fetchFaculties, fetchDepartment]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked ? "active" : "inactive"
                : value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.department_code.trim()) {
            newErrors.department_code = "Vui lòng nhập mã bộ môn";
        } else if (formData.department_code.length > 20) {
            newErrors.department_code = "Mã bộ môn không được vượt quá 20 ký tự";
        } else if (/\s/.test(formData.department_code)) {
            newErrors.department_code = "Mã bộ môn không được chứa khoảng trắng";
        }

        if (!formData.department_name.trim()) {
            newErrors.department_name = "Vui lòng nhập tên bộ môn";
        } else if (formData.department_name.length > 150) {
            newErrors.department_name = "Tên bộ môn không được vượt quá 150 ký tự";
        }

        if (!formData.faculty_id) {
            newErrors.faculty_id = "Vui lòng chọn khoa trực thuộc";
        }

        if (formData.head_of_department.length > 150) {
            newErrors.head_of_department = "Tên trưởng bộ môn không được vượt quá 150 ký tự";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = "Email không hợp lệ";
            } else if (formData.email.length > 150) {
                newErrors.email = "Email không được vượt quá 150 ký tự";
            }
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else {
            const phoneRegex = /^[0-9]{10,15}$/;

            if (!phoneRegex.test(formData.phone.trim())) {
                newErrors.phone = "Số điện thoại phải có từ 10 đến 15 chữ số";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/university/department/edit/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    department_code: formData.department_code.trim(),
                    department_name: formData.department_name.trim(),
                    description: formData.description.trim(),
                    faculty_id: Number(formData.faculty_id),
                    head_of_department: formData.head_of_department.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    status: formData.status
                })
            });

            const result = await response.json();

            if (!response.ok) {
                SwalAlert({
                    icon: "error",
                    title: "Thất bại",
                    text: result.detail?.message || "Không thể cập nhật bộ môn"
                });
                return;
            }

            SwalAlert({
                status: result.success,
                title: result.title,
                message: result.message,
                time: 3000
            });

            navigate("/university/departments");
        } catch (error) {
            console.error("Lỗi khi cập nhật bộ môn:", error);

            SwalAlert({
                icon: "error",
                title: "Cập nhật bộ môn không thành công!",
                text: "Đã xảy ra lỗi khi kết nối đến máy chủ"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="department-create">
                <p>Đang tải thông tin bộ môn...</p>
            </div>
        );
    }

    return (
        <div className="department-create">
            <div className="department-create-header">
                <div>
                    <h2>Chỉnh sửa bộ môn</h2>
                    <div className="department-create-breadcrumb">
                        <span>Quản lý bộ môn</span>
                        <span>/</span>
                        <span>Chỉnh sửa bộ môn</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="department-create-back"
                    onClick={() => navigate("/university/departments")}
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="department-create-card">
                    <div className="department-create-card-header">
                        <div className="department-create-icon">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3>Thông tin bộ môn</h3>
                            <p>Cập nhật thông tin chi tiết của bộ môn</p>
                        </div>
                    </div>

                    <div className="department-create-card-body">
                        <div className="department-create-row">
                            <div className="department-create-field">
                                <label htmlFor="department_code">
                                    Mã bộ môn <span>*</span>
                                </label>
                                <input
                                    id="department_code"
                                    name="department_code"
                                    type="text"
                                    placeholder="Ví dụ: BM001"
                                    maxLength={20}
                                    value={formData.department_code}
                                    onChange={handleChange}
                                />
                                {errors.department_code && (
                                    <small className="department-create-error">
                                        {errors.department_code}
                                    </small>
                                )}
                            </div>

                            <div className="department-create-field">
                                <label htmlFor="department_name">
                                    Tên bộ môn <span>*</span>
                                </label>
                                <input
                                    id="department_name"
                                    name="department_name"
                                    type="text"
                                    placeholder="Nhập tên bộ môn"
                                    maxLength={150}
                                    value={formData.department_name}
                                    onChange={handleChange}
                                />
                                {errors.department_name && (
                                    <small className="department-create-error">
                                        {errors.department_name}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="department-create-row">
                            <div className="department-create-field">
                                <label htmlFor="faculty_id">
                                    Khoa trực thuộc <span>*</span>
                                </label>
                                <select
                                    id="faculty_id"
                                    name="faculty_id"
                                    value={formData.faculty_id}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Chọn khoa --</option>
                                    {faculties.map(faculty => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.faculty_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.faculty_id && (
                                    <small className="department-create-error">
                                        {errors.faculty_id}
                                    </small>
                                )}
                            </div>

                            <div className="department-create-field">
                                <label htmlFor="head_of_department">
                                    Trưởng bộ môn
                                </label>
                                <input
                                    id="head_of_department"
                                    name="head_of_department"
                                    type="text"
                                    placeholder="Nhập tên trưởng bộ môn"
                                    maxLength={150}
                                    value={formData.head_of_department}
                                    onChange={handleChange}
                                />
                                {errors.head_of_department && (
                                    <small className="department-create-error">
                                        {errors.head_of_department}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="department-create-row">
                            <div className="department-create-field">
                                <label htmlFor="email">
                                    Email <span>*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Nhập email bộ môn"
                                    maxLength={150}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <small className="department-create-error">
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                            <div className="department-create-field">
                                <label htmlFor="phone">
                                    Số điện thoại <span>*</span>
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Nhập số điện thoại"
                                    maxLength={15}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && (
                                    <small className="department-create-error">
                                        {errors.phone}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="department-create-field">
                            <label htmlFor="description">Mô tả</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Nhập mô tả về bộ môn..."
                                rows={5}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="department-create-status">
                            <div>
                                <label>Trạng thái hoạt động</label>
                                <p>Bật để bộ môn ở trạng thái hoạt động</p>
                            </div>

                            <label className="department-create-switch">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status === "active"}
                                    onChange={handleChange}
                                />
                                <span className="department-create-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="department-create-actions">
                    <button
                        type="button"
                        className="department-create-cancel"
                        onClick={() => navigate("/university/departments")}
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        className="department-create-submit"
                        disabled={loading}
                    >
                        <Save size={18} />
                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DepartmentEdit;
