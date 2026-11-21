import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import "../../../styles/major/major-create.css";
import SwalAlert from "../../../components/SwalAlert/swal-alert";

function MajorEdit() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const params = useParams();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    major_code: "",
    major_name: "",
    description: "",
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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "active" : "inactive") : value,
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

        const response = await fetch(
          `${apiUrl}/university/major/edit/${params.id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              major_code: formData.major_code.trim(),
              major_name: formData.major_name.trim(),
              description: formData.description.trim(),
              status: formData.status,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw {
            title: data.detail?.title || "Cập nhật ngành thất bại!",
            message:
              data.detail?.message ||
              "Không thể cập nhật thông tin ngành. Vui lòng thử lại.",
          };
        }

        if (data.success) {
          SwalAlert({
            status: "success",
            title: data.title || "Cập nhật ngành thành công!",
            message:
              data.message || "Thông tin ngành đã được cập nhật thành công.",
            time: 3000,
          });

          setErrors({});

          setTimeout(() => {
            navigate("/university/majors");
          }, 1000);
        } else {
          SwalAlert({
            status: "error",
            title: data.title || "Cập nhật ngành thất bại!",
            message:
              data.message ||
              "Không thể cập nhật thông tin ngành. Vui lòng thử lại.",
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
    [formData, apiUrl, isSubmitting, params.id, navigate],
  );

  useEffect(() => {
    fetch(`${apiUrl}/university/major/detail/${params.id}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.detail?.message || "Không thể lấy thông tin ngành.",
          );
        }

        return data;
      })
      .then((data) => {
        setFormData({
          ...data.detail,
          status: data.detail.status === "inactive" ? "inactive" : "active",
        });
      })
      .catch((ex) => {
        SwalAlert({
          status: "error",
          title: "Có lỗi xảy ra",
          message: ex.message,
          time: 3000,
        });
      });
  }, [apiUrl, params.id]);

  return (
    <div className="major-create">
      <div className="major-create-header">
        <div>
          <div className="major-create-breadcrumb">
            <span onClick={() => navigate("/university/majors")}>
              Quản lý ngành
            </span>
            <span>/</span>
            <span>Chỉnh sửa ngành</span>
          </div>

          <h2>Chỉnh sửa thông tin ngành</h2>
          <p>
            Cập nhật thông tin và trạng thái hoạt động của ngành trong hệ thống.
          </p>
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
              <p>Chỉnh sửa các thông tin cơ bản của ngành</p>
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
                  placeholder="Ví dụ: CNTT"
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
                  placeholder="Ví dụ: ngành Công nghệ thông tin"
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

            <div className="major-create-field">
              <label htmlFor="description">Mô tả</label>

              <textarea
                id="description"
                name="description"
                placeholder="Nhập mô tả về ngành..."
                rows={5}
                value={formData.description || ""}
                onChange={handleChange}
              />

              <small>
                Cập nhật thông tin giới thiệu về chức năng và lĩnh vực đào tạo
                của ngành.
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
            {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MajorEdit;
