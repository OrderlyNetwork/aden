import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxVisiblePages = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = pages.slice(startPage - 1, endPage);

    return (
        <>
            {/* Desktop Pagination */}
            <div className="md:dc-flex dc-mb-72 dc-items-center dc-justify-center dc-hidden dc-gap-5">
                <button 
                    onClick={() => onPageChange(1)}
                    className="dc-flex dc-items-center dc-justify-center dc-w-32 dc-h-32 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm hover:dc-bg-[#1a1a1a]"
                >
                    <ChevronsLeft className="dc-w-16 dc-h-16" />
                </button>
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="dc-flex dc-items-center dc-justify-center dc-w-32 dc-h-32 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm hover:dc-bg-[#1a1a1a] disabled:dc-opacity-50 disabled:dc-cursor-not-allowed"
                >
                    <ChevronLeft className="dc-w-16 dc-h-16" />
                </button>
                
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`dc-flex dc-items-center dc-justify-center dc-w-32 dc-h-32 dc-rounded-sm ${
                            currentPage === page
                                ? "dc-bg-[#E1E1E1] dc-text-[#0f0f0f]"
                                : "dc-text-[#777777] dc-bg-[#0f0f0f] hover:dc-bg-[#1a1a1a]"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="dc-flex dc-items-center dc-justify-center dc-w-32 dc-h-32 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm hover:dc-bg-[#1a1a1a] disabled:dc-opacity-50 disabled:dc-cursor-not-allowed"
                >
                    <ChevronRight className="dc-w-16 dc-h-16" />
                </button>
                <button 
                    onClick={() => onPageChange(totalPages)}
                    className="dc-flex dc-items-center dc-justify-center dc-w-32 dc-h-32 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm hover:dc-bg-[#1a1a1a]"
                >
                    <ChevronsRight className="dc-w-16 dc-h-16" />
                </button>
            </div>

            {/* Mobile Pagination */}
            <div className="md:dc-hidden dc-flex dc-items-center dc-justify-center dc-gap-4 dc-mb-12">
                <button 
                    onClick={() => onPageChange(1)}
                    className="dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="11 17 6 12 11 7"></polyline>
                        <polyline points="18 17 13 12 18 7"></polyline>
                    </svg>
                </button>
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm disabled:dc-opacity-50 disabled:dc-cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                
                {visiblePages.slice(0, 3).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-rounded-sm ${
                            currentPage === page
                                ? "dc-bg-[#E1E1E1] dc-text-[#0f0f0f]"
                                : "dc-text-[#777777] dc-bg-[#0f0f0f]"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                
                {totalPages > 3 && (
                    <button className="dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-text-[#777777] dc-bg-[#0f0f0f] dc-rounded-sm">
                        ...
                    </button>
                )}
                
                {totalPages > 3 && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`flex items-center justify-center w-28 h-28 rounded-sm ${
                            currentPage === totalPages
                                ? "bg-[#E1E1E1] text-[#0f0f0f]"
                                : "text-[#777777] bg-[#0f0f0f]"
                        }`}
                    >
                        {totalPages}
                    </button>
                )}

                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm disabled:dc-opacity-50 disabled:dc-cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                <button 
                    onClick={() => onPageChange(totalPages)}
                    className="dc-flex dc-items-center dc-justify-center dc-w-28 dc-h-28 dc-text-white dc-bg-[#0f0f0f] dc-rounded-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7"></polyline>
                        <polyline points="6 17 11 12 6 7"></polyline>
                    </svg>
                </button>
            </div>
        </>
    );
} 