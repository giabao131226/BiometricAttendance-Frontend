/**
 * Subject Service
 * Single Source of Truth for Subject entity based on ERD:
 * - subject_id: string (PK)
 * - subject_name: string
 * - credits: number
 *
 * Supports FastAPI backend REST API integration and unified local storage provider.
 * Implements cross-tab and cross-component reactive synchronization.
 */

const STORAGE_KEY_SUBJECTS = "bioattend_shared_subjects";
const STORAGE_KEY_STUDENT = "bioattend_shared_student_enrolled";
const EVENT_SUBJECTS_UPDATED = "bioattend_subjects_updated";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Initial catalog for University
const INITIAL_SUBJECTS = [
    { subject_id: "INT101", subject_name: "Lập trình C++", credits: 3 },
    { subject_id: "INT102", subject_name: "Cơ sở dữ liệu", credits: 3 },
    { subject_id: "INT103", subject_name: "Cấu trúc dữ liệu và giải thuật", credits: 4 },
    { subject_id: "INT104", subject_name: "Mạng máy tính", credits: 3 },
    { subject_id: "INT105", subject_name: "Hệ điều hành", credits: 3 },
    { subject_id: "INT106", subject_name: "Kỹ thuật phần mềm", credits: 3 },
    { subject_id: "INT107", subject_name: "Lập trình Web", credits: 3 },
    { subject_id: "INT108", subject_name: "Trí tuệ nhân tạo", credits: 3 },
    { subject_id: "MAT101", subject_name: "Giải tích 1", credits: 3 },
    { subject_id: "MAT102", subject_name: "Đại số tuyến tính", credits: 3 },
    { subject_id: "PHY101", subject_name: "Vật lý đại cương 1", credits: 3 },
    { subject_id: "ENG101", subject_name: "Tiếng Anh chuyên ngành", credits: 2 }
];

// Student enrolled subject IDs (Student -> Student_CourseSection -> CourseSection -> Subject)
const INITIAL_STUDENT_ENROLLED_IDS = ["INT101", "INT102", "INT103", "MAT101", "ENG101"];

/**
 * Dispatch an update event to notify all components in the current window
 */
function notifySubjectsChanged(detail = {}) {
    if (typeof window !== "undefined") {
        try {
            window.dispatchEvent(new CustomEvent(EVENT_SUBJECTS_UPDATED, { detail }));
        } catch (e) {
            // Ignore in non-browser environments
        }
    }
}

/**
 * Read subjects from localStorage (Single Source of Truth across tabs)
 */
function getStoredSubjects() {
    if (typeof window === "undefined") return [...INITIAL_SUBJECTS];
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SUBJECTS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        // Fallback to initial
    }
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    return [...INITIAL_SUBJECTS];
}

/**
 * Save subjects to localStorage and broadcast change event
 */
function saveStoredSubjects(subjects) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_SUBJECTS, JSON.stringify(subjects));
    notifySubjectsChanged({ type: "save", subjects });
}

/**
 * Read student enrolled subject IDs
 */
function getStoredStudentEnrolledIds() {
    if (typeof window === "undefined") return [...INITIAL_STUDENT_ENROLLED_IDS];
    try {
        const stored = localStorage.getItem(STORAGE_KEY_STUDENT);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        // Fallback
    }
    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(INITIAL_STUDENT_ENROLLED_IDS));
    return [...INITIAL_STUDENT_ENROLLED_IDS];
}

/**
 * Save student enrolled IDs
 */
function saveStoredStudentEnrolledIds(ids) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(ids));
    notifySubjectsChanged({ type: "enrollment", ids });
}

export const subjectService = {
    /**
     * Subscribe to changes (cross-tab via storage event, in-window via custom event, and on tab focus)
     * @param {Function} callback
     * @returns {Function} unsubscribe function
     */
    subscribe(callback) {
        if (typeof window === "undefined") return () => {};

        const handleCustomEvent = (e) => {
            callback(e.detail || {});
        };

        const handleStorageEvent = (e) => {
            if (e.key === STORAGE_KEY_SUBJECTS || e.key === STORAGE_KEY_STUDENT) {
                callback({ source: "storage", key: e.key });
            }
        };

        const handleFocusEvent = () => {
            callback({ source: "focus" });
        };

        window.addEventListener(EVENT_SUBJECTS_UPDATED, handleCustomEvent);
        window.addEventListener("storage", handleStorageEvent);
        window.addEventListener("focus", handleFocusEvent);

        return () => {
            window.removeEventListener(EVENT_SUBJECTS_UPDATED, handleCustomEvent);
            window.removeEventListener("storage", handleStorageEvent);
            window.removeEventListener("focus", handleFocusEvent);
        };
    },

    /**
     * University: Get paginated subjects with search
     * Reads from FastAPI backend when available, or from unified shared localStorage.
     */
    async getUniversitySubjects({ page = 1, pageSize = 5, search = "" } = {}) {
        try {
            const token = localStorage.getItem("access_token_university") || localStorage.getItem("access_token");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const query = new URLSearchParams({
                page: String(page),
                page_size: String(pageSize),
                search: search.trim()
            });

            const res = await fetch(`${API_BASE_URL}/subjects?${query.toString()}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                return {
                    items: data.items || [],
                    total: data.total || 0,
                    page: data.page || page,
                    pageSize: data.page_size || pageSize,
                    totalPages: Math.ceil((data.total || 0) / (data.page_size || pageSize)) || 1,
                    isMock: false
                };
            } else if (res.status === 401 || res.status === 403) {
                // If explicitly rejected by auth, propagate error
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Không có quyền truy cập dữ liệu môn học.");
            }
        } catch (err) {
            if (err.message && (err.message.includes("Không có quyền") || err.message.includes("401") || err.message.includes("403"))) {
                throw err;
            }
            // Backend offline or timeout -> proceed with unified shared storage
        }

        // Unified Local Storage Single Source of Truth
        const allSubjects = getStoredSubjects();
        const keyword = search.trim().toLowerCase();

        const filtered = allSubjects.filter(sub => {
            if (!keyword) return true;
            return (
                sub.subject_id.toLowerCase().includes(keyword) ||
                sub.subject_name.toLowerCase().includes(keyword)
            );
        });

        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        const validPage = Math.min(Math.max(1, page), totalPages);
        const startIndex = (validPage - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        return {
            items,
            total,
            page: validPage,
            pageSize,
            totalPages,
            isMock: true
        };
    },

    /**
     * Student: Get enrolled subjects for current student
     * Resolves: Student -> Student_CourseSection -> CourseSection -> Subject
     * Reads from FastAPI backend when available, or from unified shared localStorage.
     */
    async getStudentSubjects({ page = 1, pageSize = 5, search = "" } = {}) {
        try {
            const token = localStorage.getItem("access_token_student") || localStorage.getItem("access_token");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const query = new URLSearchParams({
                page: String(page),
                page_size: String(pageSize),
                search: search.trim()
            });

            const res = await fetch(`${API_BASE_URL}/students/me/subjects?${query.toString()}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                return {
                    items: data.items || [],
                    total: data.total || 0,
                    page: data.page || page,
                    pageSize: data.page_size || pageSize,
                    totalPages: Math.ceil((data.total || 0) / (data.page_size || pageSize)) || 1,
                    isMock: false
                };
            } else if (res.status === 401 || res.status === 403) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Không có quyền xem môn học sinh viên.");
            }
        } catch (err) {
            if (err.message && (err.message.includes("Không có quyền") || err.message.includes("401") || err.message.includes("403"))) {
                throw err;
            }
            // Backend offline or timeout -> proceed with unified shared storage
        }

        // Unified Local Storage: Read directly from the same subject catalog
        const allSubjects = getStoredSubjects();
        const enrolledIds = new Set(getStoredStudentEnrolledIds());
        const keyword = search.trim().toLowerCase();

        // Deduplicate enrolled subjects by subject_id
        const enrolledMap = new Map();
        allSubjects.forEach(sub => {
            if (enrolledIds.has(sub.subject_id) && !enrolledMap.has(sub.subject_id)) {
                enrolledMap.set(sub.subject_id, sub);
            }
        });

        const enrolledList = Array.from(enrolledMap.values());

        const filtered = enrolledList.filter(sub => {
            if (!keyword) return true;
            return (
                sub.subject_id.toLowerCase().includes(keyword) ||
                sub.subject_name.toLowerCase().includes(keyword)
            );
        });

        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize) || 1;
        const validPage = Math.min(Math.max(1, page), totalPages);
        const startIndex = (validPage - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        return {
            items,
            total,
            page: validPage,
            pageSize,
            totalPages,
            isMock: true
        };
    },

    /**
     * Get single subject details by subject_id
     */
    async getSubjectById(subject_id) {
        const cleanId = String(subject_id || "").trim();
        try {
            const token = localStorage.getItem("access_token_university") || localStorage.getItem("access_token");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const res = await fetch(`${API_BASE_URL}/subjects/${encodeURIComponent(cleanId)}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                return { ...data, isMock: false };
            } else if (res.status === 404) {
                throw new Error(`Không tìm thấy môn học có mã "${cleanId}".`);
            }
        } catch (err) {
            if (err.message && err.message.includes("Không tìm thấy")) throw err;
        }

        const allSubjects = getStoredSubjects();
        const found = allSubjects.find(s => s.subject_id.toLowerCase() === cleanId.toLowerCase());
        if (!found) {
            throw new Error(`Không tìm thấy môn học có mã "${cleanId}".`);
        }
        return { ...found, isMock: true };
    },

    /**
     * University: Create new subject
     */
    async createSubject(subjectData) {
        const subject_id = String(subjectData.subject_id || "").trim();
        const subject_name = String(subjectData.subject_name || "").trim();
        const credits = Number(subjectData.credits);

        if (!subject_id) {
            throw new Error("Mã môn học không được để trống.");
        }
        if (!subject_name) {
            throw new Error("Tên môn học không được để trống.");
        }
        if (!Number.isInteger(credits) || credits <= 0) {
            throw new Error("Số tín chỉ phải là số nguyên dương.");
        }

        let backendWorked = false;
        try {
            const token = localStorage.getItem("access_token_university") || localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/subjects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ subject_id, subject_name, credits })
            });

            if (res.ok) {
                const created = await res.json();
                backendWorked = true;
                // Also update local storage cache for consistency
                const all = getStoredSubjects();
                if (!all.some(s => s.subject_id.toLowerCase() === subject_id.toLowerCase())) {
                    all.unshift({ subject_id, subject_name, credits });
                    saveStoredSubjects(all);
                }
                notifySubjectsChanged({ type: "create", subject: created });
                return { ...created, isMock: false };
            } else if (res.status === 409) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Mã môn học đã tồn tại trong hệ thống (409 Conflict).");
            } else if (res.status === 422) {
                throw new Error("Dữ liệu môn học không hợp lệ (422).");
            }
        } catch (err) {
            if (err.message && (err.message.includes("409") || err.message.includes("422") || err.message.includes("tồn tại"))) {
                throw err;
            }
        }

        if (backendWorked) return;

        // Shared localStorage update
        const allSubjects = getStoredSubjects();
        const isDuplicate = allSubjects.some(
            s => s.subject_id.toLowerCase() === subject_id.toLowerCase()
        );

        if (isDuplicate) {
            throw new Error("Mã môn học đã tồn tại trong hệ thống.");
        }

        const newSubject = { subject_id, subject_name, credits };
        allSubjects.unshift(newSubject);
        saveStoredSubjects(allSubjects);

        return { ...newSubject, isMock: true };
    },

    /**
     * University: Update subject (Ensures single source of truth across all roles)
     */
    async updateSubject(originalSubjectId, subjectData) {
        const subject_id = String(subjectData.subject_id || "").trim();
        const subject_name = String(subjectData.subject_name || "").trim();
        const credits = Number(subjectData.credits);

        if (!subject_id) {
            throw new Error("Mã môn học không được để trống.");
        }
        if (!subject_name) {
            throw new Error("Tên môn học không được để trống.");
        }
        if (!Number.isInteger(credits) || credits <= 0) {
            throw new Error("Số tín chỉ phải là số nguyên dương.");
        }

        let backendSuccess = false;
        try {
            const token = localStorage.getItem("access_token_university") || localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/subjects/${encodeURIComponent(originalSubjectId)}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ subject_id, subject_name, credits })
            });

            if (res.ok) {
                const updated = await res.json();
                backendSuccess = true;

                // Sync unified localStorage cache
                const allSubjects = getStoredSubjects();
                const targetIdx = allSubjects.findIndex(
                    s => s.subject_id.toLowerCase() === originalSubjectId.toLowerCase()
                );
                if (targetIdx !== -1) {
                    allSubjects[targetIdx] = { subject_id, subject_name, credits };
                } else {
                    allSubjects.unshift({ subject_id, subject_name, credits });
                }
                saveStoredSubjects(allSubjects);

                if (subject_id.toLowerCase() !== originalSubjectId.toLowerCase()) {
                    const enrolledIds = getStoredStudentEnrolledIds();
                    const updatedEnrolled = enrolledIds.map(id =>
                        id.toLowerCase() === originalSubjectId.toLowerCase() ? subject_id : id
                    );
                    saveStoredStudentEnrolledIds(updatedEnrolled);
                }

                notifySubjectsChanged({ type: "update", subject: updated });
                return { ...updated, isMock: false };
            } else if (res.status === 409) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Mã môn học mới bị trùng hoặc vi phạm ràng buộc dữ liệu (409).");
            } else if (res.status === 404) {
                throw new Error(`Không tìm thấy môn học "${originalSubjectId}" trên hệ thống (404).`);
            } else if (res.status === 401 || res.status === 403) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Không có quyền chỉnh sửa môn học.");
            }
        } catch (err) {
            if (err.message && (err.message.includes("409") || err.message.includes("404") || err.message.includes("Không có quyền"))) {
                throw err;
            }
        }

        if (backendSuccess) return;

        // Shared localStorage update (Single Source of Truth)
        const allSubjects = getStoredSubjects();
        const targetIndex = allSubjects.findIndex(
            s => s.subject_id.toLowerCase() === originalSubjectId.toLowerCase()
        );

        if (targetIndex === -1) {
            throw new Error(`Không tìm thấy môn học "${originalSubjectId}" trong danh mục.`);
        }

        // Check duplicate if subject_id changed
        if (subject_id.toLowerCase() !== originalSubjectId.toLowerCase()) {
            const isConflicting = allSubjects.some(
                (s, idx) => idx !== targetIndex && s.subject_id.toLowerCase() === subject_id.toLowerCase()
            );
            if (isConflicting) {
                throw new Error("Mã môn học mới đã trùng với một môn học khác trong hệ thống.");
            }

            // Sync student enrolled list with new subject_id
            const enrolledIds = getStoredStudentEnrolledIds();
            const updatedEnrolled = enrolledIds.map(id =>
                id.toLowerCase() === originalSubjectId.toLowerCase() ? subject_id : id
            );
            saveStoredStudentEnrolledIds(updatedEnrolled);
        }

        const updatedSubject = { subject_id, subject_name, credits };
        allSubjects[targetIndex] = updatedSubject;
        saveStoredSubjects(allSubjects);

        return { ...updatedSubject, isMock: true };
    },

    /**
     * University: Delete subject
     */
    async deleteSubject(subjectId) {
        if (!subjectId) {
            throw new Error("Mã môn học không hợp lệ.");
        }

        let backendSuccess = false;
        try {
            const token = localStorage.getItem("access_token_university") || localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/subjects/${encodeURIComponent(subjectId)}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            if (res.ok) {
                backendSuccess = true;
                const all = getStoredSubjects().filter(s => s.subject_id.toLowerCase() !== subjectId.toLowerCase());
                saveStoredSubjects(all);
                const enrolled = getStoredStudentEnrolledIds().filter(id => id.toLowerCase() !== subjectId.toLowerCase());
                saveStoredStudentEnrolledIds(enrolled);
                notifySubjectsChanged({ type: "delete", subject_id: subjectId });
                return { success: true, subject_id: subjectId, isMock: false };
            } else if (res.status === 400 || res.status === 409) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || "Không thể xóa môn học vì đang có lớp học phần hoặc dữ liệu liên kết.");
            } else if (res.status === 404) {
                throw new Error("Không tìm thấy môn học cần xóa trong hệ thống.");
            }
        } catch (err) {
            if (err.message && (err.message.includes("Không thể xóa") || err.message.includes("Không tìm thấy"))) {
                throw err;
            }
        }

        if (backendSuccess) return;

        // Shared localStorage update
        const allSubjects = getStoredSubjects();
        const targetIndex = allSubjects.findIndex(
            s => s.subject_id.toLowerCase() === subjectId.toLowerCase()
        );

        if (targetIndex === -1) {
            throw new Error("Không tìm thấy môn học cần xóa trong danh mục.");
        }

        allSubjects.splice(targetIndex, 1);
        saveStoredSubjects(allSubjects);

        // Clean up from student enrolled list
        const enrolledIds = getStoredStudentEnrolledIds();
        const updatedEnrolled = enrolledIds.filter(id => id.toLowerCase() !== subjectId.toLowerCase());
        saveStoredStudentEnrolledIds(updatedEnrolled);

        return { success: true, subject_id: subjectId, isMock: true };
    }
};
