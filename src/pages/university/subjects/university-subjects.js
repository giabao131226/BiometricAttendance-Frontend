import { useState, useEffect, useCallback } from "react";
import { Plus, Search, BookOpen, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";
import Home from "../../../components/Home/home";
import SubjectTable from "../../../components/Subject/SubjectTable";
import SubjectFormModal from "../../../components/Subject/SubjectFormModal";
import SubjectDetailModal from "../../../components/Subject/SubjectDetailModal";
import SubjectDeleteConfirmModal from "../../../components/Subject/SubjectDeleteConfirmModal";
import Pagination from "../../../components/Pagination/Pagination";
import { subjectService } from "../../../services/subject.service";
import "./university-subjects.css";

/**
 * University Subject Management Page
 * Handles listing, searching, pagination, adding, editing and viewing subject details.
 */
export default function UniversitySubjects() {
    const [subjects, setSubjects] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isMockMode, setIsMockMode] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successBanner, setSuccessBanner] = useState("");

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState("add"); // "add" | "edit"
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Delete modal states
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch subject list
    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await subjectService.getUniversitySubjects({
                page: currentPage,
                pageSize,
                search: searchKeyword
            });
            setSubjects(data.items || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setIsMockMode(data.isMock);
        } catch (err) {
            setErrorMessage(err.message || "Không thể tải danh sách môn học.");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchKeyword]);

    useEffect(() => {
        fetchSubjects();

        // Subscribe to cross-tab updates, in-window changes, and tab focus
        const unsubscribe = subjectService.subscribe(() => {
            fetchSubjects();
        });

        return unsubscribe;
    }, [fetchSubjects]);

    // Handle search form submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchKeyword(searchInput.trim());
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchInput("");
        setSearchKeyword("");
        setCurrentPage(1);
    };

    // Open Add Modal
    const handleOpenAdd = () => {
        setSelectedSubject(null);
        setFormMode("add");
        setIsFormOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (subject) => {
        setSelectedSubject(subject);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    // Open Detail Modal
    const handleOpenDetail = (subject) => {
        setSelectedSubject(subject);
        setIsDetailOpen(true);
    };

    // Open Delete Modal
    const handleOpenDelete = (subject) => {
        setSubjectToDelete(subject);
        setIsDeleteOpen(true);
    };

    // Handle Confirm Delete
    const handleConfirmDelete = async (subject) => {
        setIsDeleting(true);
        setErrorMessage("");
        try {
            await subjectService.deleteSubject(subject.subject_id);
            setIsDeleteOpen(false);
            setSubjectToDelete(null);
            setSuccessBanner(`Đã xóa môn học "${subject.subject_name}" (${subject.subject_id}) thành công!`);

            // If deleting the only subject on the current page (and not page 1), move back a page
            if (subjects.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                await fetchSubjects();
            }

            // Auto dismiss success banner
            setTimeout(() => {
                setSuccessBanner("");
            }, 4000);
        } catch (err) {
            setErrorMessage(err.message || "Không thể xóa môn học. Vui lòng thử lại.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle Save (Add or Update)
    const handleSaveSubject = async (originalSubjectId, subjectData) => {
        if (formMode === "add") {
            await subjectService.createSubject(subjectData);
            setSuccessBanner(`Thêm môn học "${subjectData.subject_name}" (${subjectData.subject_id}) thành công!`);
        } else {
            await subjectService.updateSubject(originalSubjectId, subjectData);
            setSuccessBanner(`Cập nhật môn học "${subjectData.subject_name}" (${subjectData.subject_id}) thành công!`);
        }

        setIsFormOpen(false);
        await fetchSubjects();

        // Auto dismiss success banner after 4 seconds
        setTimeout(() => {
            setSuccessBanner("");
        }, 4000);
    };

    return (
        <Home role="university">
            <div className="subjects-page">
                {/* Page Header */}
                <div className="subjects-page-header">
                    <div className="subjects-header-left">
                        <div className="subjects-breadcrumb">
                            <span>Nhà trường</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-active">Quản lý môn học</span>
                        </div>
                        <h2 className="subjects-page-title">Quản lý môn học</h2>
                        <p className="subjects-page-desc">
                            Quản lý danh mục các môn học trong chương trình đào tạo của nhà trường
                        </p>
                    </div>

                    <div className="subjects-header-right">
                        <button
                            type="button"
                            className="btn-add-subject"
                            onClick={handleOpenAdd}
                        >
                            <Plus size={16} />
                            <span>Thêm môn học</span>
                        </button>
                    </div>
                </div>

                {/* Status Banners */}
                {isMockMode && (
                    <div className="subjects-notice-banner">
                        <BookOpen size={16} />
                        <span>
                            Chế độ dữ liệu thử nghiệm (Mock Data): Sẵn sàng kết nối với API Backend FastAPI khi hoàn thành.
                        </span>
                    </div>
                )}

                {successBanner && (
                    <div className="subjects-alert-banner subjects-alert-success" role="status">
                        <CheckCircle2 size={18} />
                        <span>{successBanner}</span>
                        <button
                            type="button"
                            className="banner-close-btn"
                            onClick={() => setSuccessBanner("")}
                            aria-label="Đóng thông báo"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {errorMessage && (
                    <div className="subjects-alert-banner subjects-alert-danger" role="alert">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                        <button
                            type="button"
                            className="btn-retry"
                            onClick={fetchSubjects}
                        >
                            <RefreshCw size={14} />
                            <span>Thử lại</span>
                        </button>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="subjects-card">
                    {/* Filter & Search Bar */}
                    <div className="subjects-filter-bar">
                        <form onSubmit={handleSearchSubmit} className="subjects-search-form">
                            <div className="subjects-search-box">
                                <Search size={16} className="subjects-search-icon" />
                                <input
                                    type="text"
                                    className="subjects-search-input"
                                    placeholder="Tìm theo mã môn hoặc tên môn..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        className="subjects-search-clear"
                                        onClick={handleClearSearch}
                                        aria-label="Xóa từ khóa tìm kiếm"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <button type="submit" className="subjects-btn-search">
                                Tìm kiếm
                            </button>
                        </form>

                        <div className="subjects-meta-info">
                            <span className="subjects-total-badge">
                                Tổng số: <strong>{total}</strong> môn học
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <SubjectTable
                        subjects={subjects}
                        startIndex={(currentPage - 1) * pageSize}
                        actions={["view", "edit", "delete"]}
                        onView={handleOpenDetail}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                        isLoading={isLoading}
                        emptyMessage={
                            searchKeyword
                                ? `Không tìm thấy môn học nào khớp với từ khóa "${searchKeyword}".`
                                : "Chưa có môn học nào trong hệ thống."
                        }
                    />

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="subjects-pagination-wrapper">
                            <Pagination
                                currentPage={currentPage}
                                totalPage={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>

                {/* Modals */}
                <SubjectFormModal
                    isOpen={isFormOpen}
                    mode={formMode}
                    subject={selectedSubject}
                    onSave={handleSaveSubject}
                    onClose={() => setIsFormOpen(false)}
                />

                <SubjectDetailModal
                    isOpen={isDetailOpen}
                    subject={selectedSubject}
                    onClose={() => setIsDetailOpen(false)}
                />

                <SubjectDeleteConfirmModal
                    isOpen={isDeleteOpen}
                    subject={subjectToDelete}
                    isDeleting={isDeleting}
                    onConfirm={handleConfirmDelete}
                    onClose={() => !isDeleting && setIsDeleteOpen(false)}
                />
            </div>
        </Home>
    );
}
