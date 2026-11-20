import { useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import "./subject-detail-modal.css";

/**
 * Reusable Subject Details Modal (Read-only)
 * Shared between University and Student portals.
 */
export default function SubjectDetailModal({ isOpen, subject, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !subject) return null;

    return (
        <div className="subject-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-detail-title">
            <div className="subject-modal-card">
                <div className="subject-modal-header">
                    <div className="subject-modal-header-left">
                        <div className="subject-modal-icon-badge">
                            <BookOpen size={20} />
                        </div>
                        <h3 id="modal-detail-title" className="subject-modal-title">
                            Chi tiết môn học
                        </h3>
                    </div>
                    <button
                        type="button"
                        className="subject-modal-close-btn"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="subject-modal-body">
                    <div className="subject-detail-group">
                        <span className="subject-detail-label">Mã môn học (Primary Key):</span>
                        <div className="subject-detail-value">
                            <span className="subject-code-badge large">
                                {subject.subject_id}
                            </span>
                        </div>
                    </div>

                    <div className="subject-detail-group">
                        <span className="subject-detail-label">Tên môn học:</span>
                        <div className="subject-detail-value font-medium">
                            {subject.subject_name}
                        </div>
                    </div>

                    <div className="subject-detail-group">
                        <span className="subject-detail-label">Số tín chỉ:</span>
                        <div className="subject-detail-value">
                            <span className="subject-credits-badge">
                                {subject.credits} tín chỉ
                            </span>
                        </div>
                    </div>
                </div>

                <div className="subject-modal-footer">
                    <button
                        type="button"
                        className="subject-btn subject-btn-secondary"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
