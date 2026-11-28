import { useEffect, useState } from "react";
import {
  IdCard,
  ScanFace,
  Fingerprint,
  Building2,
  GraduationCap,
} from "lucide-react";
import "./university/majors/majors-management.css";
import SwalAlert from "../components/SwalAlert/swal-alert";
const API_BASE_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const ROLE_CONFIG = {
  student: {
    idLabel: "Mã sinh viên",
    active: "Đang học",
    inactive: "Ngừng học",
    subtitle: "Thông tin sinh viên và trạng thái đăng ký sinh trắc học",
  },
  lecturer: {
    idLabel: "Mã giảng viên",
    active: "Đang công tác",
    inactive: "Ngừng công tác",
    subtitle: "Thông tin giảng viên",
  },
};

const formatDate = (value) => {
  if (!value) return "—";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
};

const LABEL_COL = { width: "30%", fontWeight: 500 };

function InfoTable({ title, rows }) {
  return (
    <div className="major-content">
      <div className="major-table-header">
        <h3>{title}</h3>
      </div>

      <div className="major-table-wrapper">
        <table className="major-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td style={LABEL_COL}>{label}</td>
                <td>{value || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BiometricTable({ faceCount, fingerprintCount }) {
  const rows = [
    ["Khuôn mặt", faceCount],
    ["Vân tay", fingerprintCount],
  ];

  return (
    <div className="major-content">
      <div className="major-table-header">
        <h3>Dữ liệu sinh trắc học</h3>
      </div>

      <div className="major-table-wrapper">
        <table className="major-table">
          <tbody>
            {rows.map(([label, count]) => (
              <tr key={label}>
                <td style={LABEL_COL}>{label}</td>
                <td>
                  <span
                    className={`major-status ${count > 0 ? "active" : "inactive"}`}
                  >
                    {count > 0 ? `Đã đăng ký (${count} mẫu)` : "Chưa đăng ký"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value }) {
  return (
    <div className="major-stat-card">
      <div className={`major-stat-icon ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/profile/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "Không thể lấy thông tin cá nhân.",
          );
        }

        return data;
      })
      .then(setProfile)
      .catch((ex) => {
        SwalAlert({
          status: "error",
          title: "Có lỗi xảy ra",
          message: ex.message,
          time: 3000,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="major-management">Đang tải thông tin...</div>;
  }

  if (!profile) {
    return (
      <div className="major-management">
        <div className="major-empty">Không có dữ liệu để hiển thị</div>
      </div>
    );
  }

  const isStudent = profile.role === "student";
  const cfg = ROLE_CONFIG[profile.role] || ROLE_CONFIG.student;

  const personalRows = [
    ["Họ và tên", profile.name],
    [cfg.idLabel, profile.user_id],
    ["Giới tính", profile.gender],
    ["Ngày sinh", formatDate(profile.date_of_birth)],
    ["Số điện thoại", profile.phone],
    ["Email", profile.email],
  ];

  const academicRows = [
    ["Lớp", profile.class_name],
    ["Khóa", profile.cohort_name],
    ["Ngành học", profile.major_name],
    ["Khoa", profile.faculty_name],
  ];

  const workRows = [
    ["Khoa", profile.faculty_name],
    ["Học vị", profile.degree],
  ];

  return (
    <div className="major-management">
      <div className="major-page-header">
        <div>
          <h2>Thông tin cá nhân</h2>
          <p>{cfg.subtitle}</p>
        </div>

        <span
          className={`major-status ${
            profile.status === "active" ? "active" : "inactive"
          }`}
        >
          {profile.status === "active" ? cfg.active : cfg.inactive}
        </span>
      </div>

      <div className="major-statistics">
        <StatCard
          icon={IdCard}
          color="purple"
          label={cfg.idLabel}
          value={profile.user_id}
        />

        {isStudent ? (
          <>
            <StatCard
              icon={ScanFace}
              color={profile.face_count > 0 ? "green" : "red"}
              label="Khuôn mặt"
              value={`${profile.face_count} mẫu`}
            />
            <StatCard
              icon={Fingerprint}
              color={profile.fingerprint_count > 0 ? "green" : "red"}
              label="Vân tay"
              value={`${profile.fingerprint_count} mẫu`}
            />
          </>
        ) : (
          <>
            <StatCard
              icon={Building2}
              color="green"
              label="Khoa"
              value={profile.faculty_name || "—"}
            />
            <StatCard
              icon={GraduationCap}
              color="purple"
              label="Học vị"
              value={profile.degree || "—"}
            />
          </>
        )}
      </div>

      <InfoTable title="Thông tin cá nhân" rows={personalRows} />

      {isStudent ? (
        <>
          <InfoTable title="Thông tin học tập" rows={academicRows} />
          <BiometricTable
            faceCount={profile.face_count}
            fingerprintCount={profile.fingerprint_count}
          />
        </>
      ) : (
        <InfoTable title="Thông tin công tác" rows={workRows} />
      )}
    </div>
  );
}
