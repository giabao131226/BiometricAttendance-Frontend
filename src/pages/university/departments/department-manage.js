
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "../../../styles/departments/department-manage.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SwalAlert from "../../../components/SwalAlert/swal-alert";
import Pagination from "../../../components/Pagination/pagination";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [overview, setOverview] = useState({});

  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const onPageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleFacultyChange = (e) => {
    setFacultyFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có chắc chắn muốn xóa bộ môn này không? Thao tác này có thể ảnh hưởng đến dữ liệu liên quan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận xóa",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#f06548",
      cancelButtonColor: "#6c757d",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      fetch(`${apiUrl}/university/department/delete/${id}`, {
        method: "PATCH",
        credentials: "include",
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.detail?.message || "Không thể xóa bộ môn."
            );
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

  useEffect(() => {
    fetch(
      `${apiUrl}/university/department?page=${currentPage}&status=${statusFilter}&keyword=${encodeURIComponent(search)}&faculty_id=${facultyFilter}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
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
          setDepartments(data.departments || []);
          setCurrentPage(data.currentPage ?? data.page ?? 1);
          setTotalPage(data.totalPage || 1);
          setOverview(data.overview || {});
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
  }, [
    apiUrl,
    reload,
    currentPage,
    statusFilter,
    search,
    facultyFilter,
  ]);

  useEffect(() => {
    fetch(`${apiUrl}/university/faculty`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy danh sách khoa."
          );
        }

        return data;
      })
      .then((data) => {
        setFaculties(data.faculties || []);
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
    <div className="department-management">
      <div className="department-page-header">
        <div>
          <h2>Quản lý bộ môn</h2>
          <p>Quản lý danh sách các bộ môn trực thuộc các khoa</p>
        </div>

        <Link to="create">
          <button className="department-btn-primary">
            <Plus size={18} />
            Thêm bộ môn
          </button>
        </Link>
      </div>

      <div className="department-statistics">
        <div className="department-stat-card">
          <div className="department-stat-icon purple">
            <Building2 size={22} />
          </div>
          <div>
            <p>Tổng số bộ môn</p>
            <h3>{overview.total ?? 0}</h3>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <p>Đang hoạt động</p>
            <h3>{overview.cntActive ?? 0}</h3>
          </div>
        </div>

        <div className="department-stat-card">
          <div className="department-stat-icon red">
            <XCircle size={22} />
          </div>
          <div>
            <p>Ngừng hoạt động</p>
            <h3>{overview.cntInActive ?? 0}</h3>
          </div>
        </div>
      </div>

      <div className="department-content">
        <div className="department-toolbar">
          <div className="department-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm mã bộ môn, tên bộ môn..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select value={facultyFilter} onChange={handleFacultyChange}>
            <option value="all">Tất cả khoa</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.faculty_name}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={handleStatusChange}>
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="department-table-header">
          <h3>Danh sách bộ môn</h3>
          <span>{departments.length} bộ môn</span>
        </div>

        <div className="department-table-wrapper">
          <table className="department-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã bộ môn</th>
                <th>Tên bộ môn</th>
                <th>Khoa</th>
                <th>Trưởng bộ môn</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((department, index) => (
                <tr key={department.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>

                  <td>
                    <span className="department-code">
                      {department.department_code}
                    </span>
                  </td>

                  <td className="department-name">
                    {department.department_name}
                  </td>

                  <td className="department-faculty">
                    {department.faculty_name}
                  </td>

                  <td>
                    {department.head_of_department || "Chưa cập nhật"}
                  </td>

                  <td>{department.email || "—"}</td>

                  <td>
                    <span
                      className={`department-status ${department.status}`}
                    >
                      {department.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </td>

                  <td>
                    <div className="department-actions">
                      <button
                        className="department-action-edit"
                        title="Chỉnh sửa"
                        onClick={() =>
                          navigate(`edit/${department.id}`)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="department-action-delete"
                        title="Xóa"
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {departments.length === 0 && (
                <tr>
                  <td colSpan="8" className="department-empty">
                    Không tìm thấy bộ môn phù hợp
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
