/**
 * Timezone-aware date utilities
 * Gets the current date in the user's local timezone
 */

/**
 * Get today's date in the user's local timezone as YYYY-MM-DD
 */
export function getTodayInLocalTimezone(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get formatted date with timezone for display
 */
export function getFormattedDate(dateString?: string): string {
    const date = dateString ? new Date(dateString + 'T00:00:00') : new Date();

    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get current date and time with timezone info
 */
export function getCurrentDateTimeInfo() {
    const now = new Date();

    return {
        date: getTodayInLocalTimezone(),
        formattedDate: getFormattedDate(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        time: now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    };
}

/**
 * Check if a date string is today in local timezone
 */
export function isToday(dateString: string): boolean {
    return dateString === getTodayInLocalTimezone();
}

/**
 * Format a date for API requests (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
