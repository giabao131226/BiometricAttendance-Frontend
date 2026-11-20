import { ChevronLeft, ChevronRight } from "lucide-react";
import "./pagination.css";

/**
 * Reusable Pagination Component
 * Displays page numbers, previous/next buttons and handles page changes.
 */
export default function Pagination({ currentPage = 1, totalPage = 1, onPageChange }) {
    if (totalPage <= 1) return null;

    return (
        <nav aria-label="Pagination Navigation">
            <ul className="pagination">
                <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft size={16} />
                        <span>Trang trước</span>
                    </button>
                </li>

                {Array.from({ length: totalPage }, (_, index) => {
                    const page = index + 1;
                    const isActive = currentPage === page;

                    return (
                        <li
                            key={page}
                            className={`page-item ${isActive ? "active" : ""}`}
                        >
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => onPageChange(page)}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                <li className={`page-item ${currentPage >= totalPage ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => currentPage < totalPage && onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPage}
                        aria-label="Next Page"
                    >
                        <span>Kế tiếp</span>
                        <ChevronRight size={16} />
                    </button>
                </li>
            </ul>
        </nav>
    );
}
