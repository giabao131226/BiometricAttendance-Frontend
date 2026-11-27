
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "../../../styles/subjects/subject-manage.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SwalAlert from "../../../components/SwalAlert/swal-alert";
import Pagination from "../../../components/Pagination/pagination";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [overview, setOverview] = useState({});
  const [departments, setDepartments] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có chắc chắn muốn xóa môn học này không? Thao tác này có thể ảnh hưởng đến các dữ liệu liên quan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#f06548",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      fetch(`${apiUrl}/university/subjects/delete/${id}`, {
        method: "PATCH",
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.detail?.message || "Không thể xóa môn học.");
          }

          return data;
        })
        .then((data) => {
          if (data.success) {
            SwalAlert({
              status: data.success,
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
      `${apiUrl}/university/subjects?page=${currentPage}&status=${statusFilter}&department_id=${departmentFilter}&keyword=${encodeURIComponent(search)}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy dữ liệu môn học."
          );
        }

        return data;
      })
      .then((data) => {
        if (data.success) {
          setSubjects(data.subjects);
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
  }, [apiUrl, reload, currentPage, statusFilter, departmentFilter, search]);

  useEffect(() => {
    fetch(`${apiUrl}/university/department`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy dữ liệu bộ môn."
          );
        }

        return data;
      })
      .then((data) => {
        if (data.success) {
          setDepartments(data.departments);
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
  }, [apiUrl]);
  return (
    <div className="subject-management">
      <div className="subject-page-header">
        <div>
          <h2>Quản lý môn học</h2>
          <p>Quản lý danh sách các môn học của trường</p>
        </div>

        <Link to={"create"}>
          <button className="subject-btn-primary">
            <Plus size={18} />
            Thêm môn học
          </button>
        </Link>
      </div>

      <div className="subject-statistics">
        <div className="subject-stat-card">
          <div className="subject-stat-icon purple">
            <BookOpen size={22} />
          </div>
          <div>
            <p>Tổng số môn học</p>
            <h3>{overview.total}</h3>
          </div>
        </div>

        <div className="subject-stat-card">
          <div className="subject-stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Đang hoạt động</p>
            <h3>{overview.cntActive}</h3>
          </div>
        </div>

        <div className="subject-stat-card">
          <div className="subject-stat-icon red">
            <XCircle size={22} />
          </div>
          <div>
            <p>Ngừng hoạt động</p>
            <h3>{overview.cntInActive}</h3>
          </div>
        </div>
      </div>

      <div className="subject-content">
        <div className="subject-toolbar">
          <div className="subject-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm mã môn học, tên môn học..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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

          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả bộ môn</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="subject-table-header">
          <h3>Danh sách môn học</h3>
          <span>{subjects.length} môn học</span>
        </div>

        <div className="subject-table-wrapper">
          <table className="subject-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã môn học</th>
                <th>Tên môn học</th>
                <th>Bộ môn</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>

                  <td>
                    <span className="subject-code">
                      {subject.subject_code}
                    </span>
                  </td>

                  <td className="subject-name">
                    {subject.subject_name}
                  </td>

                  <td className="subject-department">
                    {subject.department_name}
                  </td>

                  <td className="subject-description">
                    {subject.description}
                  </td>

                  <td>
                    <span className={`subject-status ${subject.status}`}>
                      {subject.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </td>

                  <td>
                    <div className="subject-actions">
                      <button
                        className="subject-action-edit"
                        title="Chỉnh sửa"
                        onClick={() => navigate(`edit/${subject.id}`)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="subject-action-delete"
                        title="Xóa"
                        onClick={() => handleDelete(subject.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {subjects.length === 0 && (
                <tr>
                  <td colSpan="7" className="subject-empty">
                    Không tìm thấy môn học phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
