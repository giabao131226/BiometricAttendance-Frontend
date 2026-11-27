
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import "../../../styles/subjects/subject-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function SubjectCreate() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    description: "",
    department_id: "",
    credit: 3,
    theory_hours: 0,
    practice_hours: 0,
    status: "active",
  });

  const validate = () => {
    const newErrors = {};

    const subjectCode = formData.subject_code.trim();
    const subjectName = formData.subject_name.trim();

    if (!subjectCode) {
      newErrors.subject_code = "Vui lòng nhập mã môn học!";
    } else if (subjectCode.length > 20) {
      newErrors.subject_code = "Mã môn học không được vượt quá 20 ký tự!";
    } else if (/\s/.test(subjectCode)) {
      newErrors.subject_code = "Mã môn học không được chứa khoảng trắng!";
    }

    if (!subjectName) {
      newErrors.subject_name = "Vui lòng nhập tên môn học!";
    } else if (subjectName.length > 150) {
      newErrors.subject_name = "Tên môn học không được vượt quá 150 ký tự!";
    }

    if (!formData.department_id) {
      newErrors.department_id = "Vui lòng chọn bộ môn!";
    }

    if (!Number.isInteger(Number(formData.credit)) || Number(formData.credit) <= 0) {
      newErrors.credit = "Số tín chỉ phải là số nguyên lớn hơn 0!";
    }

    if (!Number.isInteger(Number(formData.theory_hours)) || Number(formData.theory_hours) < 0) {
      newErrors.theory_hours = "Số tiết lý thuyết phải là số nguyên không âm!";
    }

    if (!Number.isInteger(Number(formData.practice_hours)) || Number(formData.practice_hours) < 0) {
      newErrors.practice_hours = "Số tiết thực hành phải là số nguyên không âm!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? "active"
            : "inactive"
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) {
        SwalAlert({
          status: "warning",
          title: "Dữ liệu không hợp lệ!",
          message: "Vui lòng kiểm tra lại các thông tin đã nhập.",
          time: 3000,
        });
        return;
      }

      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        const response = await fetch(`${apiUrl}/university/subjects/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            subject_code: formData.subject_code.trim(),
            subject_name: formData.subject_name.trim(),
            description: formData.description.trim(),
            department_id: Number(formData.department_id),
            credit: Number(formData.credit),
            theory_hours: Number(formData.theory_hours),
            practice_hours: Number(formData.practice_hours),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw {
            title: data.detail?.title || "Tạo môn học thất bại!",
            message:
              data.detail?.message || "Không thể tạo môn học. Vui lòng thử lại.",
          };
        }

        if (data.success) {
          SwalAlert({
            status: data.success,
            title: data.title,
            message: data.message,
            time: 3000,
          });

          setFormData({
            subject_code: "",
            subject_name: "",
            description: "",
            department_id: "",
            credit: 3,
            theory_hours: 0,
            practice_hours: 0,
            status: "active",
          });

          setErrors({});
        } else {
          SwalAlert({
            status: "error",
            title: data.title || "Tạo môn học thất bại!",
            message: data.message || "Không thể tạo môn học. Vui lòng thử lại.",
            time: 3000,
          });
        }
      } catch (ex) {
        SwalAlert({
          status: "error",
          title: ex.title || "Có lỗi xảy ra!",
          message:
            ex.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
          time: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, apiUrl, isSubmitting]
  );

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
        console.log(data);
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
    <div className="subject-create">
      <div className="subject-create-header">
        <div>
          <div className="subject-create-breadcrumb">
            <span onClick={() => navigate("/university/subjects")}>
              Quản lý môn học
            </span>
            <span>/</span>
            <span>Thêm môn học</span>
          </div>
          <h2>Thêm môn học mới</h2>
          <p>Nhập thông tin để tạo một môn học mới trong hệ thống.</p>
        </div>

        <button
          type="button"
          className="subject-create-back"
          onClick={() => navigate("/university/subjects")}
        >
          <ArrowLeft size={17} />
          Quay lại
        </button>
      </div>

      <form className="subject-create-form" onSubmit={handleSubmit}>
        <div className="subject-create-card">
          <div className="subject-create-card-header">
            <div className="subject-create-icon">
              <BookOpen size={21} />
            </div>
            <div>
              <h3>Thông tin môn học</h3>
              <p>Các thông tin cơ bản của môn học</p>
            </div>
          </div>

          <div className="subject-create-card-body">
            <div className="subject-create-row">
              <div className="subject-create-field">
                <label htmlFor="subject_code">
                  Mã môn học <span>*</span>
                </label>
                <input
                  id="subject_code"
                  name="subject_code"
                  type="text"
                  placeholder="Ví dụ: IT001"
                  maxLength={20}
                  value={formData.subject_code}
                  onChange={handleChange}
                  className={errors.subject_code ? "is-invalid" : ""}
                />
                {errors.subject_code ? (
                  <small className="text-danger">{errors.subject_code}</small>
                ) : (
                  <small>Mã môn học không được vượt quá 20 ký tự.</small>
                )}
              </div>

              <div className="subject-create-field">
                <label htmlFor="subject_name">
                  Tên môn học <span>*</span>
                </label>
                <input
                  id="subject_name"
                  name="subject_name"
                  type="text"
                  placeholder="Ví dụ: Lập trình hướng đối tượng"
                  maxLength={150}
                  value={formData.subject_name}
                  onChange={handleChange}
                  className={errors.subject_name ? "is-invalid" : ""}
                />
                {errors.subject_name ? (
                  <small className="text-danger">{errors.subject_name}</small>
                ) : (
                  <small>Tên môn học không được vượt quá 150 ký tự.</small>
                )}
              </div>
            </div>

            <div className="subject-create-row">
              <div className="subject-create-field">
                <label htmlFor="department_id">
                  Bộ môn trực thuộc <span>*</span>
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={errors.department_id ? "is-invalid" : ""}
                >
                  <option value="">-- Chọn bộ môn --</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <small className="text-danger">
                    {errors.department_id}
                  </small>
                )}
              </div>

              <div className="subject-create-field">
                <label htmlFor="credit">
                  Số tín chỉ <span>*</span>
                </label>
                <input
                  id="credit"
                  name="credit"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.credit}
                  onChange={handleChange}
                  className={errors.credit ? "is-invalid" : ""}
                />
                {errors.credit ? (
                  <small className="text-danger">{errors.credit}</small>
                ) : (
                  <small>Số tín chỉ của môn học.</small>
                )}
              </div>
            </div>

            <div className="subject-create-row">
              <div className="subject-create-field">
                <label htmlFor="theory_hours">
                  Số tiết lý thuyết <span>*</span>
                </label>
                <input
                  id="theory_hours"
                  name="theory_hours"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.theory_hours}
                  onChange={handleChange}
                  className={errors.theory_hours ? "is-invalid" : ""}
                />
                {errors.theory_hours ? (
                  <small className="text-danger">{errors.theory_hours}</small>
                ) : (
                  <small>Tổng số tiết học lý thuyết.</small>
                )}
              </div>

              <div className="subject-create-field">
                <label htmlFor="practice_hours">
                  Số tiết thực hành <span>*</span>
                </label>
                <input
                  id="practice_hours"
                  name="practice_hours"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.practice_hours}
                  onChange={handleChange}
                  className={errors.practice_hours ? "is-invalid" : ""}
                />
                {errors.practice_hours ? (
                  <small className="text-danger">{errors.practice_hours}</small>
                ) : (
                  <small>Tổng số tiết học thực hành.</small>
                )}
              </div>
            </div>

            <div className="subject-create-field">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                placeholder="Nhập mô tả về môn học..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
              <small>Thông tin giới thiệu nội dung và mục tiêu môn học.</small>
            </div>

            <div className="subject-create-status">
              <div>
                <strong>Trạng thái hoạt động</strong>
                <p>Cho phép môn học được sử dụng trong hệ thống.</p>
              </div>

              <label className="subject-create-switch">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                />
                <span className="subject-create-slider"></span>
              </label>
            </div>

            <div className="subject-create-status-label">
              <span className={formData.status}>
                {formData.status === "active"
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"}
              </span>
            </div>
          </div>
        </div>

        <div className="subject-create-actions">
          <button
            type="button"
            className="subject-create-cancel"
            onClick={() => navigate("/university/subjects")}
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            className="subject-create-submit"
            disabled={isSubmitting}
          >
            <Save size={17} />
            {isSubmitting ? "Đang tạo..." : "Tạo môn học"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubjectCreate;
