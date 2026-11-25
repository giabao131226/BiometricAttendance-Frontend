
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import "../../../styles/major/major-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function MajorCreate() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faculties, setFaculties] = useState([]);

  const [formData, setFormData] = useState({
    major_code: "",
    major_name: "",
    description: "",
    faculty_id: "",
    degree_level: "Đại học",
    duration: 4,
    status: "active",
  });

  const validate = () => {
    const newErrors = {};

    const majorCode = formData.major_code.trim();
    const majorName = formData.major_name.trim();

    if (!majorCode) {
      newErrors.major_code = "Vui lòng nhập mã ngành!";
    } else if (majorCode.length > 20) {
      newErrors.major_code = "Mã ngành không được vượt quá 20 ký tự!";
    } else if (/\s/.test(majorCode)) {
      newErrors.major_code = "Mã ngành không được chứa khoảng trắng!";
    }

    if (!majorName) {
      newErrors.major_name = "Vui lòng nhập tên ngành!";
    } else if (majorName.length > 150) {
      newErrors.major_name = "Tên ngành không được vượt quá 150 ký tự!";
    }

    if (!formData.faculty_id) {
      newErrors.faculty_id = "Vui lòng chọn khoa!";
    }

    if (!formData.degree_level) {
      newErrors.degree_level = "Vui lòng chọn trình độ đào tạo!";
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      newErrors.duration = "Thời gian đào tạo phải lớn hơn 0!";
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

        const response = await fetch(`${apiUrl}/university/major/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            major_code: formData.major_code.trim(),
            major_name: formData.major_name.trim(),
            description: formData.description.trim(),
            faculty_id: Number(formData.faculty_id),
            duration: Number(formData.duration),
          }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw {
            title: data.detail?.title || "Tạo ngành thất bại!",
            message:
              data.detail?.message || "Không thể tạo ngành. Vui lòng thử lại.",
          };
        }

        if (data.success) {
          SwalAlert({
            status: "success",
            title: data.title,
            message: data.message,
            time: 3000,
          });

          setFormData({
            major_code: "",
            major_name: "",
            description: "",
            faculty_id: "",
            degree_level: "Đại học",
            duration: 4,
            status: "active",
          });

          setErrors({});
        } else {
          SwalAlert({
            status: "error",
            title: data.title || "Tạo ngành thất bại!",
            message: data.message || "Không thể tạo ngành. Vui lòng thử lại.",
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
    [formData, apiUrl, isSubmitting],
  );

  useEffect(() => {
    fetch(`${apiUrl}/university/faculty`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy dữ liệu khoa.",
          );
        }

        return data;
      })
      .then((data) => {
        if (data.success) {
          setFaculties(data.faculties);
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
    <div className="major-create">
      <div className="major-create-header">
        <div>
          <div className="major-create-breadcrumb">
            <span onClick={() => navigate("/university/majors")}>
              Quản lý ngành
            </span>
            <span>/</span>
            <span>Thêm ngành</span>
          </div>
          <h2>Thêm ngành mới</h2>
          <p>Nhập thông tin để tạo một ngành mới trong hệ thống.</p>
        </div>

        <button
          type="button"
          className="major-create-back"
          onClick={() => navigate("/university/majors")}
        >
          <ArrowLeft size={17} />
          Quay lại
        </button>
      </div>

      <form className="major-create-form" onSubmit={handleSubmit}>
        <div className="major-create-card">
          <div className="major-create-card-header">
            <div className="major-create-icon">
              <Building2 size={21} />
            </div>
            <div>
              <h3>Thông tin ngành</h3>
              <p>Các thông tin cơ bản của ngành</p>
            </div>
          </div>

          <div className="major-create-card-body">
            <div className="major-create-row">
              <div className="major-create-field">
                <label htmlFor="major_code">
                  Mã ngành <span>*</span>
                </label>

                <input
                  id="major_code"
                  name="major_code"
                  type="text"
                  placeholder="Ví dụ: 7480201"
                  maxLength={20}
                  value={formData.major_code}
                  onChange={handleChange}
                  className={errors.major_code ? "is-invalid" : ""}
                />

                {errors.major_code ? (
                  <small className="text-danger">{errors.major_code}</small>
                ) : (
                  <small>Mã ngành không được vượt quá 20 ký tự.</small>
                )}
              </div>

              <div className="major-create-field">
                <label htmlFor="major_name">
                  Tên ngành <span>*</span>
                </label>

                <input
                  id="major_name"
                  name="major_name"
                  type="text"
                  placeholder="Ví dụ: Công nghệ thông tin"
                  maxLength={150}
                  value={formData.major_name}
                  onChange={handleChange}
                  className={errors.major_name ? "is-invalid" : ""}
                />

                {errors.major_name ? (
                  <small className="text-danger">{errors.major_name}</small>
                ) : (
                  <small>Tên ngành không được vượt quá 150 ký tự.</small>
                )}
              </div>
            </div>

            <div className="major-create-row">
              <div className="major-create-field">
                <label htmlFor="faculty_id">
                  Khoa trực thuộc <span>*</span>
                </label>

                <select
                  id="faculty_id"
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleChange}
                  className={errors.faculty_id ? "is-invalid" : ""}
                >
                  <option value="">-- Chọn khoa --</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.faculty_name}
                    </option>
                  ))}
                </select>

                {errors.faculty_id && (
                  <small className="text-danger">{errors.faculty_id}</small>
                )}
              </div>

              <div className="major-create-field">
                <label htmlFor="degree_level">
                  Trình độ đào tạo <span>*</span>
                </label>

                <select
                  id="degree_level"
                  name="degree_level"
                  value={formData.degree_level}
                  onChange={handleChange}
                  className={errors.degree_level ? "is-invalid" : ""}
                >
                  <option value="Đại học">Đại học</option>
                  <option value="Cao đẳng">Cao đẳng</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>

                {errors.degree_level && (
                  <small className="text-danger">
                    {errors.degree_level}
                  </small>
                )}
              </div>
            </div>

            <div className="major-create-field">
              <label htmlFor="duration">
                Thời gian đào tạo (năm) <span>*</span>
              </label>

              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                step="1"
                value={formData.duration}
                onChange={handleChange}
                className={errors.duration ? "is-invalid" : ""}
              />

              {errors.duration ? (
                <small className="text-danger">{errors.duration}</small>
              ) : (
                <small>Nhập số năm đào tạo của ngành.</small>
              )}
            </div>

            <div className="major-create-field">
              <label htmlFor="description">Mô tả</label>

              <textarea
                id="description"
                name="description"
                placeholder="Nhập mô tả về ngành..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />

              <small>
                Thông tin giới thiệu về chức năng và lĩnh vực đào tạo của ngành.
              </small>
            </div>

            <div className="major-create-status">
              <div>
                <strong>Trạng thái hoạt động</strong>
                <p>Cho phép ngành được sử dụng trong hệ thống.</p>
              </div>

              <label className="major-create-switch">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={handleChange}
                />
                <span className="major-create-slider"></span>
              </label>
            </div>

            <div className="major-create-status-label">
              <span className={formData.status}>
                {formData.status === "active"
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"}
              </span>
            </div>
          </div>
        </div>

        <div className="major-create-actions">
          <button
            type="button"
            className="major-create-cancel"
            onClick={() => navigate("/university/majors")}
          >
            Hủy bỏ
          </button>

          <button
            type="submit"
            className="major-create-submit"
            disabled={isSubmitting}
          >
            <Save size={17} />
            {isSubmitting ? "Đang tạo..." : "Tạo ngành"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MajorCreate;
