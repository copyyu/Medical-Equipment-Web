import { useState, useRef, useEffect } from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    disabled?: boolean
    siblingCount?: number
}

/**
 * Generate page numbers with ellipsis for smart truncation pagination.
 * 
 * Examples:
 * - totalPages=7, current=1  → [1, 2, 3, 4, 5, 6, 7]
 * - totalPages=20, current=1 → [1, 2, '...', 19, 20]
 * - totalPages=20, current=10 → [1, 2, '...', 9, 10, 11, '...', 19, 20]
 * - totalPages=20, current=20 → [1, 2, '...', 19, 20]
 */
function generatePageRange(currentPage: number, totalPages: number, siblingCount: number): (number | '...')[] {
    const totalNumbers = siblingCount * 2 + 5
    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const showLeftEllipsis = leftSiblingIndex > 3
    const showRightEllipsis = rightSiblingIndex < totalPages - 2

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1)
        return [...leftRange, '...', totalPages - 1, totalPages]
    }

    if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = Array.from(
            { length: 3 + 2 * siblingCount },
            (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1
        )
        return [1, 2, '...', ...rightRange]
    }

    const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
    )
    return [1, 2, '...', ...middleRange, '...', totalPages - 1, totalPages]
}

/** Clickable ellipsis that turns into a page number input */
function EllipsisJump({
    totalPages,
    onPageChange,
    disabled
}: {
    totalPages: number
    onPageChange: (page: number) => void
    disabled: boolean
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const handleSubmit = () => {
        const pageNum = parseInt(inputValue, 10)
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum)
        }
        setIsEditing(false)
        setInputValue('')
    }

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="number"
                min={1}
                max={totalPages}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit()
                    if (e.key === 'Escape') { setIsEditing(false); setInputValue('') }
                }}
                onBlur={handleSubmit}
                placeholder="#"
                className="w-12 h-9 rounded-lg text-sm text-center border-2 border-emerald-400 bg-emerald-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        )
    }

    return (
        <button
            onClick={() => !disabled && setIsEditing(true)}
            disabled={disabled}
            className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed group relative"
            title="คลิกเพื่อไปหน้าที่ต้องการ"
        >
            <span className="group-hover:hidden">…</span>
            <span className="hidden group-hover:inline text-xs font-medium">Go</span>
        </button>
    )
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    siblingCount = 1
}: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = generatePageRange(currentPage, totalPages, siblingCount)

    return (
        <div className="flex items-center justify-center gap-1 mt-6 select-none">
            {/* Prev Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || disabled}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                aria-label="Previous page"
            >
                <HiOutlineChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <EllipsisJump
                            key={`ellipsis-${index}`}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            disabled={disabled}
                        />
                    )
                }

                const isActive = page === currentPage
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={disabled}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            isActive
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        } disabled:cursor-not-allowed`}
                        aria-label={`Page ${page}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            })}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || disabled}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <HiOutlineChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}
