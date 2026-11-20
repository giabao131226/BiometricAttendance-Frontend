import { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import "./subject-delete-confirm-modal.css";

/**
 * Delete Confirmation Modal for Subjects
 * Ensures accidental clicks are prevented with explicit confirmation.
 */
export default function SubjectDeleteConfirmModal({
    isOpen,
    subject,
    isDeleting = false,
    onConfirm,
    onClose
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isDeleting) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isDeleting, onClose]);

    if (!isOpen || !subject) return null;

    return (
        <div
            className="subject-delete-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-delete-title"
        >
            <div className="subject-delete-card">
                <div className="subject-delete-header">
                    <div className="subject-delete-icon-box">
                        <AlertTriangle size={24} className="subject-delete-warn-icon" />
                    </div>
                    <button
                        type="button"
                        className="subject-delete-close-btn"
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="subject-delete-body">
                    <h3 id="modal-delete-title" className="subject-delete-title">
                        Xác nhận xóa môn học
                    </h3>
                    <p className="subject-delete-subtitle">
                        Bạn có chắc chắn muốn xóa môn học này khỏi hệ thống không? Hành động này không thể hoàn tác.
                    </p>

                    <div className="subject-delete-info-box">
                        <div className="subject-delete-row">
                            <span className="subject-delete-label">Mã môn học:</span>
                            <span className="subject-delete-code">{subject.subject_id}</span>
                        </div>
                        <div className="subject-delete-row">
                            <span className="subject-delete-label">Tên môn học:</span>
                            <span className="subject-delete-name">{subject.subject_name}</span>
                        </div>
                        <div className="subject-delete-row">
                            <span className="subject-delete-label">Số tín chỉ:</span>
                            <span className="subject-delete-credits">{subject.credits} tín chỉ</span>
                        </div>
                    </div>
                </div>

                <div className="subject-delete-footer">
                    <button
                        type="button"
                        className="subject-delete-btn subject-delete-btn-cancel"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="subject-delete-btn subject-delete-btn-confirm"
                        onClick={() => onConfirm && onConfirm(subject)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={16} className="subject-delete-spin" />
                                <span>Đang xóa...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                <span>Xác nhận xóa</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
