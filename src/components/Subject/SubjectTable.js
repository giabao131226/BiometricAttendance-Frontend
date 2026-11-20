import { Eye, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react";
import "./subject-table.css";

/**
 * Reusable Subject Table Component
 * Used by both University (View + Edit) and Student (View only).
 */
export default function SubjectTable({
    subjects = [],
    startIndex = 0,
    actions = ["view"],
    onView,
    onEdit,
    onDelete,
    isLoading = false,
    emptyMessage = "Không tìm thấy môn học nào."
}) {
    if (isLoading) {
        return (
            <div className="subject-table-loading">
                <Loader2 size={28} className="subject-table-spin" />
                <p>Đang tải dữ liệu môn học...</p>
            </div>
        );
    }

    if (!subjects || subjects.length === 0) {
        return (
            <div className="subject-table-empty">
                <div className="subject-table-empty-icon">
                    <BookOpen size={36} />
                </div>
                <h4 className="subject-table-empty-title">{emptyMessage}</h4>
                <p className="subject-table-empty-desc">
                    Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại bộ lọc.
                </p>
            </div>
        );
    }

    return (
        <div className="subject-table-wrapper">
            <table className="subject-table">
                <thead>
                    <tr>
                        <th className="th-stt">STT</th>
                        <th className="th-code">Mã môn học</th>
                        <th className="th-name">Tên môn học</th>
                        <th className="th-credits">Số tín chỉ</th>
                        <th className="th-actions">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, index) => {
                        const stt = startIndex + index + 1;
                        return (
                            <tr key={subject.subject_id} className="subject-table-row">
                                <td className="td-stt">{stt}</td>
                                <td className="td-code">
                                    <span className="subject-code-badge">
                                        {subject.subject_id}
                                    </span>
                                </td>
                                <td className="td-name">
                                    <span className="subject-name-text">
                                        {subject.subject_name}
                                    </span>
                                </td>
                                <td className="td-credits">
                                    <span className="subject-credits-badge">
                                        {subject.credits} TC
                                    </span>
                                </td>
                                <td className="td-actions">
                                    <div className="subject-action-group">
                                        {actions.includes("view") && (
                                            <button
                                                type="button"
                                                className="subject-btn-action subject-btn-view"
                                                onClick={() => onView && onView(subject)}
                                                title="Xem chi tiết"
                                                aria-label={`Xem chi tiết ${subject.subject_name}`}
                                            >
                                                <Eye size={15} />
                                                <span>Xem</span>
                                            </button>
                                        )}

                                        {actions.includes("edit") && (
                                            <button
                                                type="button"
                                                className="subject-btn-action subject-btn-edit"
                                                onClick={() => onEdit && onEdit(subject)}
                                                title="Chỉnh sửa"
                                                aria-label={`Chỉnh sửa ${subject.subject_name}`}
                                            >
                                                <Pencil size={14} />
                                                <span>Sửa</span>
                                            </button>
                                        )}

                                        {actions.includes("delete") && (
                                            <button
                                                type="button"
                                                className="subject-btn-action subject-btn-delete"
                                                onClick={() => onDelete && onDelete(subject)}
                                                title="Xóa môn học"
                                                aria-label={`Xóa môn học ${subject.subject_name}`}
                                            >
                                                <Trash2 size={14} />
                                                <span>Xóa</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
