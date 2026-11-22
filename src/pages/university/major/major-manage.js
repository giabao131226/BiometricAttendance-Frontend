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
  Save,
} from "lucide-react";
import "../../../styles/major/major-manage.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SwalAlert from "../../../components/SwalAlert/swal-alert";
import Pagination from "../../../components/Pagination/pagination";

const emptymajor = {
  major_code: "",
  major_name: "",
  description: "",
  status: "active",
};

export default function MajorManagement() {
  const [majors, setMajors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingmajor, setEditingmajor] = useState(null);
  const [formData, setFormData] = useState(emptymajor);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [overview, setOverview] = useState({});
  const [keyword, setKeyword] = useState("");

  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingmajor) {
      setMajors((prev) =>
        prev.map((item) =>
          item.id === editingmajor.id ? { ...item, ...formData } : item,
        ),
      );
    } else {
      const newmajor = {
        id: Date.now(),
        ...formData,
      };

      setMajors((prev) => [...prev, newmajor]);
    }

    setShowModal(false);
    setFormData(emptymajor);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có chắc chắn muốn xóa ngành này không? Thao tác này có thể ảnh hưởng đến các dữ liệu liên quan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#f06548",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      fetch(`${apiUrl}/university/major/delete/${id}`, {
        method: "PATCH",
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.detail?.message || "Không thể xóa ngành.");
          }

          return data;
        })
        .then((data) => {
          if (data.success) {
            SwalAlert({
              status: "success",
              title: data.title,
              message: data.message,
              time: 3000,
            });

            setReload((prev) => !prev);
          }
        })
        .catch((ex) => {
          SwalAlert({
            status: "error",
            title: "Có lỗi xảy ra",
            message: ex.message,
            time: 3000,
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
      `${apiUrl}/university/major?page=${currentPage}&status=${statusFilter}&keyword=${search}`,
      {
        method: "GET",
        credentials: "include",
      },
    )
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy dữ liệu ngành.",
          );
        }

        return data;
      })
      .then((data) => {
        if (data.success) {
          setMajors(data.majors);
          setCurrentPage(data.currentPage ?? data.page);
          setTotalPage(data.totalPage);
          setOverview(data.overview);
        }
      })
      .catch((ex) => {
        SwalAlert({
          status: "error",
          title: "Có lỗi xảy ra",
          message: ex.message,
          time: 3000,
        });
      });
  }, [apiUrl, reload, currentPage, statusFilter, search]);

  return (
    <div className="major-management">
      <div className="major-page-header">
        <div>
          <h2>Quản lý ngành</h2>
          <p>Quản lý danh sách các ngành trực thuộc trường</p>
        </div>

        <Link to={"create"}>
          <button className="major-btn-primary">
            <Plus size={18} />
            Thêm ngành
          </button>
        </Link>
      </div>

      <div className="major-statistics">
        <div className="major-stat-card">
          <div className="major-stat-icon purple">
            <Building2 size={22} />
          </div>
          <div>
            <p>Tổng số ngành</p>
            <h3>{overview.total}</h3>
          </div>
        </div>

        <div className="major-stat-card">
          <div className="major-stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Đang hoạt động</p>
            <h3>{overview.cntActive}</h3>
          </div>
        </div>

        <div className="major-stat-card">
          <div className="major-stat-icon red">
            <XCircle size={22} />
          </div>
          <div>
            <p>Ngừng hoạt động</p>
            <h3>{overview.cntInActive}</h3>
          </div>
        </div>
      </div>

      <div className="major-content">
        <div className="major-toolbar">
          <div className="major-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm mã ngành, tên ngành..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={statusFilter} onChange={handleStatusChange}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="major-table-header">
          <h3>Danh sách ngành</h3>
          <span>{majors.length} ngành</span>
        </div>

        <div className="major-table-wrapper">
          <table className="major-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã ngành</th>
                <th>Tên ngành</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {majors.map((major, index) => (
                <tr key={major.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>

                  <td>
                    <span className="major-code">{major.major_code}</span>
                  </td>

                  <td className="major-name">{major.major_name}</td>

                  <td className="major-description">{major.description}</td>

                  <td>
                    <span className={`major-status ${major.status}`}>
                      {major.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </td>

                  <td>
                    <div className="major-actions">
                      <button
                        className="major-action-edit"
                        title="Chỉnh sửa"
                        onClick={() => navigate(`edit/${major.id}`)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="major-action-delete"
                        title="Xóa"
                        onClick={() => handleDelete(major.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {majors.length === 0 && (
                <tr>
                  <td colSpan="6" className="major-empty">
                    Không tìm thấy ngành phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="major-modal-overlay">
          <div className="major-modal">
            <div className="major-modal-header">
              <div>
                <h3>{editingmajor ? "Cập nhật ngành" : "Thêm ngành mới"}</h3>
                <p>Nhập thông tin ngành</p>
              </div>

              <button
                className="major-modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="major-form-group">
                <label>Mã ngành</label>
                <input
                  type="text"
                  name="major_code"
                  value={formData.major_code}
                  onChange={handleChange}
                  placeholder="Ví dụ: CNTT"
                  required
                />
              </div>

              <div className="major-form-group">
                <label>Tên ngành</label>
                <input
                  type="text"
                  name="major_name"
                  value={formData.major_name}
                  onChange={handleChange}
                  placeholder="Nhập tên ngành"
                  required
                />
              </div>

              <div className="major-form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả về ngành..."
                  rows="4"
                />
              </div>

              <div className="major-form-status">
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

              <div className="major-modal-footer">
                <button
                  type="button"
                  className="major-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="major-btn-primary">
                  <Save size={17} />
                  {editingmajor ? "Cập nhật" : "Lưu ngành"}
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