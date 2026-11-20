import { useState, useEffect } from "react";
import { BookOpen, X, Loader2, AlertCircle } from "lucide-react";
import "./subject-form-modal.css";

/**
 * Subject Form Modal (Add / Edit) for University
 * Strictly enforces fields: subject_id (PK), subject_name, credits
 */
export default function SubjectFormModal({
    isOpen,
    mode = "add",
    subject = null,
    onSave,
    onClose
}) {
    const isEdit = mode === "edit";

    const [formData, setFormData] = useState({
        subject_id: "",
        subject_name: "",
        credits: 3
    });

    const [originalSubjectId, setOriginalSubjectId] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState("");

    // Populate or reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (isEdit && subject) {
                setFormData({
                    subject_id: subject.subject_id || "",
                    subject_name: subject.subject_name || "",
                    credits: subject.credits || 3
                });
                setOriginalSubjectId(subject.subject_id || "");
            } else {
                setFormData({
                    subject_id: "",
                    subject_name: "",
                    credits: 3
                });
                setOriginalSubjectId("");
            }
            setErrors({});
            setGeneralError("");
            setIsSubmitting(false);
        }
    }, [isOpen, isEdit, subject]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "credits" ? (value === "" ? "" : Number(value)) : value
        }));

        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (generalError) {
            setGeneralError("");
        }
    };

    const validate = () => {
        const errs = {};
        const trimmedId = String(formData.subject_id || "").trim();
        const trimmedName = String(formData.subject_name || "").trim();
        const creditsNum = Number(formData.credits);

        if (!trimmedId) {
            errs.subject_id = "Mã môn học không được để trống.";
        }

        if (!trimmedName) {
            errs.subject_name = "Tên môn học không được để trống.";
        }

        if (formData.credits === "" || formData.credits === null || formData.credits === undefined) {
            errs.credits = "Số tín chỉ không được để trống.";
        } else if (!Number.isInteger(creditsNum) || creditsNum <= 0) {
            errs.credits = "Số tín chỉ phải là số nguyên dương lớn hơn 0.";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!validate()) return;

        setIsSubmitting(true);
        setGeneralError("");

        try {
            const payload = {
                subject_id: String(formData.subject_id).trim().toUpperCase(),
                subject_name: String(formData.subject_name).trim(),
                credits: Number(formData.credits)
            };

            await onSave(originalSubjectId, payload);
            // On success, parent will close modal
        } catch (err) {
            setGeneralError(err.message || "Có lỗi xảy ra khi lưu môn học.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="subject-form-overlay" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
            <div className="subject-form-card">
                <div className="subject-form-header">
                    <div className="subject-form-header-left">
                        <div className="subject-form-icon-badge">
                            <BookOpen size={20} />
                        </div>
                        <h3 id="form-modal-title" className="subject-form-title">
                            {isEdit ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
                        </h3>
                    </div>
                    <button
                        type="button"
                        className="subject-form-close-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="subject-form-body">
                        {generalError && (
                            <div className="subject-form-alert-error" role="alert">
                                <AlertCircle size={16} />
                                <span>{generalError}</span>
                            </div>
                        )}

                        {/* Field 1: subject_id */}
                        <div className="subject-form-group">
                            <label htmlFor="subject_id" className="subject-form-label">
                                Mã môn học <span className="text-danger">*</span>
                            </label>
                            <input
                                id="subject_id"
                                name="subject_id"
                                type="text"
                                className={`subject-form-input ${errors.subject_id ? "is-invalid" : ""}`}
                                placeholder="Ví dụ: INT101, MAT102"
                                value={formData.subject_id}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                autoFocus
                            />
                            {errors.subject_id && (
                                <span className="subject-form-error-text">{errors.subject_id}</span>
                            )}
                            {isEdit && (
                                <span className="subject-form-hint">
                                    Lưu ý: Mã môn học là khóa chính (Primary Key). Thay đổi mã sẽ cập nhật mã định danh bản ghi.
                                </span>
                            )}
                        </div>

                        {/* Field 2: subject_name */}
                        <div className="subject-form-group">
                            <label htmlFor="subject_name" className="subject-form-label">
                                Tên môn học <span className="text-danger">*</span>
                            </label>
                            <input
                                id="subject_name"
                                name="subject_name"
                                type="text"
                                className={`subject-form-input ${errors.subject_name ? "is-invalid" : ""}`}
                                placeholder="Ví dụ: Lập trình C++, Cơ sở dữ liệu"
                                value={formData.subject_name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {errors.subject_name && (
                                <span className="subject-form-error-text">{errors.subject_name}</span>
                            )}
                        </div>

                        {/* Field 3: credits */}
                        <div className="subject-form-group">
                            <label htmlFor="credits" className="subject-form-label">
                                Số tín chỉ <span className="text-danger">*</span>
                            </label>
                            <input
                                id="credits"
                                name="credits"
                                type="number"
                                min="1"
                                step="1"
                                className={`subject-form-input ${errors.credits ? "is-invalid" : ""}`}
                                placeholder="Nhập số tín chỉ (ví dụ: 3)"
                                value={formData.credits}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {errors.credits && (
                                <span className="subject-form-error-text">{errors.credits}</span>
                            )}
                        </div>
                    </div>

                    <div className="subject-form-footer">
                        <button
                            type="button"
                            className="subject-btn subject-btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="subject-btn subject-btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={15} className="subject-btn-spin" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <span>{isEdit ? "Cập nhật" : "Lưu môn học"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
