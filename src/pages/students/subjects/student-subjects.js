import { useState, useEffect, useCallback } from "react";
import { Search, GraduationCap, X, AlertCircle, RefreshCw } from "lucide-react";
import Home from "../../../components/Home/home";
import SubjectTable from "../../../components/Subject/SubjectTable";
import SubjectDetailModal from "../../../components/Subject/SubjectDetailModal";
import Pagination from "../../../components/Pagination/Pagination";
import { subjectService } from "../../../services/subject.service";
import "./student-subjects.css";

/**
 * Student Subjects Page ("Môn học của tôi")
 * Displays subjects the student is enrolled in according to ERD:
 * Student -> Student_CourseSection -> CourseSection -> Subject
 * View-only permissions: Can view list, search, view details.
 */
export default function StudentSubjects() {
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

    // Modal state for viewing details
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    // Fetch student's enrolled subjects
    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await subjectService.getStudentSubjects({
                page: currentPage,
                pageSize,
                search: searchKeyword
            });
            setSubjects(data.items || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setIsMockMode(data.isMock);
        } catch (err) {
            setErrorMessage(err.message || "Không thể tải danh sách môn học của bạn.");
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

    // Open Detail Modal
    const handleOpenDetail = (subject) => {
        setSelectedSubject(subject);
        setIsDetailOpen(true);
    };

    return (
        <Home role="student">
            <div className="student-subjects-page">
                {/* Page Header */}
                <div className="student-subjects-header">
                    <div className="student-breadcrumb">
                        <span>Sinh viên</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-active">Môn học của tôi</span>
                    </div>
                    <h2 className="student-page-title">Môn học của tôi</h2>
                    <p className="student-page-desc">
                        Danh sách các môn học bạn đang theo học trong học kỳ hiện tại
                    </p>
                </div>

                {/* Info Notice Banner */}
                {isMockMode && (
                    <div className="student-notice-banner">
                        <GraduationCap size={18} />
                        <span>
                            Dữ liệu mô phỏng theo lớp học phần đã ghi danh của sinh viên (Student → CourseSection → Subject).
                        </span>
                    </div>
                )}

                {errorMessage && (
                    <div className="student-alert-banner student-alert-danger" role="alert">
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

                {/* Main Card */}
                <div className="student-subjects-card">
                    {/* Search & Meta Bar */}
                    <div className="student-filter-bar">
                        <form onSubmit={handleSearchSubmit} className="student-search-form">
                            <div className="student-search-box">
                                <Search size={16} className="student-search-icon" />
                                <input
                                    type="text"
                                    className="student-search-input"
                                    placeholder="Tìm theo mã môn hoặc tên môn đang học..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        className="student-search-clear"
                                        onClick={handleClearSearch}
                                        aria-label="Xóa từ khóa tìm kiếm"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <button type="submit" className="student-btn-search">
                                Tìm kiếm
                            </button>
                        </form>

                        <div className="student-meta-info">
                            <span className="student-total-badge">
                                Đang học: <strong>{total}</strong> môn học
                            </span>
                        </div>
                    </div>

                    {/* Table (View-only) */}
                    <SubjectTable
                        subjects={subjects}
                        startIndex={(currentPage - 1) * pageSize}
                        actions={["view"]}
                        onView={handleOpenDetail}
                        isLoading={isLoading}
                        emptyMessage={
                            searchKeyword
                                ? `Không tìm thấy môn học nào khớp với từ khóa "${searchKeyword}".`
                                : "Bạn chưa có môn học nào được ghi danh trong học kỳ này."
                        }
                    />

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="student-pagination-wrapper">
                            <Pagination
                                currentPage={currentPage}
                                totalPage={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                <SubjectDetailModal
                    isOpen={isDetailOpen}
                    subject={selectedSubject}
                    onClose={() => setIsDetailOpen(false)}
                />
            </div>
        </Home>
    );
}
