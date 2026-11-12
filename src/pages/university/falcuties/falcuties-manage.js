
import { useEffect, useState } from "react";
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
import {Link} from "react-router-dom"

const initialFaculties = [
    {
        id: 1,
        faculty_code: "CNTT",
        faculty_name: "Khoa Công nghệ thông tin",
        description: "Đào tạo ngành CNTT, Khoa học máy tính và Kỹ thuật phần mềm",
        status: true
    },
    {
        id: 2,
        faculty_code: "KHMT",
        faculty_name: "Khoa Khoa học máy tính",
        description: "Đào tạo Trí tuệ nhân tạo và Xử lý dữ liệu",
        status: true
    },
    {
        id: 3,
        faculty_code: "KT",
        faculty_name: "Khoa Kinh tế",
        description: "Đào tạo Quản trị kinh doanh, Tài chính ngân hàng và Kế toán",
        status: true
    },
    {
        id: 4,
        faculty_code: "DT",
        faculty_name: "Khoa Điện - Điện tử",
        description: "Đào tạo Kỹ thuật Điện, Tự động hóa và Viễn thông",
        status: true
    },
    {
        id: 5,
        faculty_code: "CK",
        faculty_name: "Khoa Cơ khí",
        description: "Đào tạo Kỹ thuật cơ khí và Chế tạo máy",
        status: false
    }
];

const emptyFaculty = {
    faculty_code: "",
    faculty_name: "",
    description: "",
    status: true
};

export default function FacultyManagement() {
    const [faculties, setFaculties] = useState(initialFaculties);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [formData, setFormData] = useState(emptyFaculty);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;


    const filteredFaculties = faculties?.filter(faculty => {
        const keyword = search.toLowerCase();

        const matchSearch =
            faculty.faculty_code.toLowerCase().includes(keyword) ||
            faculty.faculty_name.toLowerCase().includes(keyword);

        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && faculty.status) ||
            (statusFilter === "inactive" && !faculty.status);

        return matchSearch && matchStatus;
    });

    const activeCount = faculties?.filter(item => item.status).length;
    const inactiveCount = faculties?.length - activeCount;

    const handleOpenCreate = () => {
        setEditingFaculty(null);
        setFormData(emptyFaculty);
        setShowModal(true);
    };

    const handleOpenEdit = (faculty) => {
        setEditingFaculty(faculty);
        setFormData({
            faculty_code: faculty.faculty_code,
            faculty_name: faculty.faculty_name,
            description: faculty.description,
            status: faculty.status
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
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

    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này?")) {
            return;
        }

        setFaculties(prev => prev.filter(item => item.id !== id));
    };

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/university/faculty/`, {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message);
            return data;
        }).then(data => {
            console.log(data);
            if (data.success) setFaculties(data.faculties || initialFaculties);
        }).catch(ex => {
            console.log(ex);
        })
    }, [])

    return (
        <div className="faculty-management">
            <div className="faculty-page-header">
                <div>
                    <h2>Quản lý khoa</h2>
                    <p>Quản lý danh sách các khoa trực thuộc trường</p>
                </div>

                <Link to={"create"}>
                    <button
                        className="faculty-btn-primary"
                    >
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
                        <h3>{faculties.length}</h3>
                    </div>
                </div>

                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon green">
                        <CheckCircle size={22} />
                    </div>
                    <div>
                        <p>Đang hoạt động</p>
                        <h3>{activeCount}</h3>
                    </div>
                </div>

                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon red">
                        <XCircle size={22} />
                    </div>
                    <div>
                        <p>Ngừng hoạt động</p>
                        <h3>{inactiveCount}</h3>
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
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                    </select>
                </div>

                <div className="faculty-table-header">
                    <h3>Danh sách khoa</h3>
                    <span>{filteredFaculties.length} khoa</span>
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
                            {filteredFaculties.map((faculty, index) => (
                                <tr key={faculty.id}>
                                    <td>{index + 1}</td>
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
                                        <span className={`faculty-status ${faculty.status ? "active" : "inactive"}`}>
                                            {faculty.status ? "Hoạt động" : "Ngừng hoạt động"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="faculty-actions">
                                            <button
                                                className="faculty-action-edit"
                                                title="Chỉnh sửa"
                                                onClick={() => handleOpenEdit(faculty)}
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

                            {filteredFaculties.length === 0 && (
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
                                    {editingFaculty ? "Cập nhật khoa" : "Thêm khoa mới"}
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
                                        checked={formData.status}
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
        </div>
    );
}
