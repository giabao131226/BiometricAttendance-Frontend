
import { useCallback, useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Building2,
    CheckCircle,
    XCircle,
    X,
    Save
} from "lucide-react";
import "./falcuties-management.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SwalAlert from "../../../components/SwalAlert/swal-alert";
import Pagination from "../../../components/Pagination/pagination";

const emptyFaculty = {
    faculty_code: "",
    faculty_name: "",
    description: "",
    status: "active"
};

export default function FacultyManagement() {
    const [faculties, setFaculties] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [formData, setFormData] = useState(emptyFaculty);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [reload, setReload] = useState(false);
    const [overview,setOverview] = useState({});

    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? (checked ? "active" : "inactive")
                : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingFaculty) {
            setFaculties(prev =>
                prev.map(item =>
                    item.id === editingFaculty.id
                        ? { ...item, ...formData }
                        : item
                )
            );
        } else {
            const newFaculty = {
                id: Date.now(),
                ...formData
            };

            setFaculties(prev => [...prev, newFaculty]);
        }

        setShowModal(false);
        setFormData(emptyFaculty);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Bạn có chắc chắn?",
            text: "Bạn có chắc chắn muốn xóa khoa này không? Thao tác này có thể ảnh hưởng đến các dữ liệu liên quan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xác nhận xóa",
            cancelButtonText: "Hủy bỏ",
            confirmButtonColor: "#f06548",
            cancelButtonColor: "#6c757d",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            fetch(`${apiUrl}/university/faculty/delete/${id}`, {
                method: "PATCH",
                credentials: "include"
            }).then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.detail?.message || "Không thể xóa khoa."
                    );
                }

                return data;
            }).then(data => {
                if (data.success) {
                    SwalAlert({
                        status: "success",
                        title: data.title,
                        message: data.message,
                        time: 3000
                    });

                    setReload(prev => !prev);
                }
            }).catch(ex => {
                SwalAlert({
                    status: "error",
                    title: "Có lỗi xảy ra",
                    message: ex.message,
                    time: 3000
                });
            });
        }
    };

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetch(
            `${apiUrl}/university/faculty?page=${currentPage}&status=${statusFilter}`,
            {
                method: "GET",
                credentials: "include"
            }
        ).then(async res => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.detail?.message || "Không thể lấy dữ liệu khoa."
                );
            }

            return data;
        }).then(data => {
            if (data.success) {
                setFaculties(data.faculties);
                setCurrentPage(data.currentPage ?? data.page);
                setTotalPage(data.totalPage);
                setOverview(data.overview);
            }
        }).catch(ex => {
            SwalAlert({
                status: "error",
                title: "Có lỗi xảy ra",
                message: ex.message,
                time: 3000
            });
        });
    }, [apiUrl, reload, currentPage, statusFilter]);

    return (
        <div className="faculty-management">
            <div className="faculty-page-header">
                <div>
                    <h2>Quản lý khoa</h2>
                    <p>Quản lý danh sách các khoa trực thuộc trường</p>
                </div>

                <Link to={"create"}>
                    <button className="faculty-btn-primary">
                        <Plus size={18} />
                        Thêm khoa
                    </button>
                </Link>
            </div>

            <div className="faculty-statistics">
                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon purple">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <p>Tổng số khoa</p>
                        <h3>{overview.total}</h3>
                    </div>
                </div>

                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon green">
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <p>Đang hoạt động</p>
                        <h3>{overview.cntActive}</h3>
                    </div>
                </div>

                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon red">
                        <XCircle size={22} />
                    </div>
                    <div>
                        <p>Ngừng hoạt động</p>
                        <h3>{overview.cntInActive}</h3>
                    </div>
                </div>
            </div>

            <div className="faculty-content">
                <div className="faculty-toolbar">
                    <div className="faculty-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã khoa, tên khoa..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>
                </div>

                <div className="faculty-table-header">
                    <h3>Danh sách khoa</h3>
                    <span>{faculties.length} khoa</span>
                </div>

                <div className="faculty-table-wrapper">
                    <table className="faculty-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã khoa</th>
                                <th>Tên khoa</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {faculties.map((faculty, index) => (
                                <tr key={faculty.id}>
                                    <td>
                                        {(currentPage - 1) * 10 + index + 1}
                                    </td>

                                    <td>
                                        <span className="faculty-code">
                                            {faculty.faculty_code}
                                        </span>
                                    </td>

                                    <td className="faculty-name">
                                        {faculty.faculty_name}
                                    </td>

                                    <td className="faculty-description">
                                        {faculty.description}
                                    </td>

                                    <td>
                                        <span className={`faculty-status ${faculty.status}`}>
                                            {faculty.status === "active"
                                                ? "Hoạt động"
                                                : "Ngừng hoạt động"}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="faculty-actions">
                                            <button
                                                className="faculty-action-edit"
                                                title="Chỉnh sửa"
                                                onClick={() => navigate(`edit/${faculty.id}`)}
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                className="faculty-action-delete"
                                                title="Xóa"
                                                onClick={() => handleDelete(faculty.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {faculties.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="faculty-empty">
                                        Không tìm thấy khoa phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="faculty-modal-overlay">
                    <div className="faculty-modal">
                        <div className="faculty-modal-header">
                            <div>
                                <h3>
                                    {editingFaculty
                                        ? "Cập nhật khoa"
                                        : "Thêm khoa mới"}
                                </h3>
                                <p>Nhập thông tin khoa</p>
                            </div>

                            <button
                                className="faculty-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="faculty-form-group">
                                <label>Mã khoa</label>
                                <input
                                    type="text"
                                    name="faculty_code"
                                    value={formData.faculty_code}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: CNTT"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Tên khoa</label>
                                <input
                                    type="text"
                                    name="faculty_name"
                                    value={formData.faculty_name}
                                    onChange={handleChange}
                                    placeholder="Nhập tên khoa"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mô tả về khoa..."
                                    rows="4"
                                />
                            </div>

                            <div className="faculty-form-status">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={formData.status === "active"}
                                        onChange={handleChange}
                                    />
                                    Đang hoạt động
                                </label>
                            </div>

                            <div className="faculty-modal-footer">
                                <button
                                    type="button"
                                    className="faculty-btn-cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="faculty-btn-primary"
                                >
                                    <Save size={17} />
                                    {editingFaculty ? "Cập nhật" : "Lưu khoa"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={onPageChange}
            />
        </div>
    );
}
