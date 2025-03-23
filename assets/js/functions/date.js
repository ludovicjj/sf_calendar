/**
 * Recupere les evements depuis une API tier
 * @param {string} url
 */
export async function fetchEvent(url)
{
    const response = await fetch(url)
    const data = await response.json()

    if (!data.hasOwnProperty('events')) {
        return []
    }

    return data.events
        .map(event => formatEvent(event))
        .filter(event => event !== null);
}

/**
 * @param {object} event
 */
export function formatEvent(event) {
    try {
        return {
            ...event,
            start: parseDateWithoutTimezone(event.start),
            end: parseDateWithoutTimezone(event.end),
        };
    } catch (error) {
        console.error('Error parsing event dates:', error);
        return null;
    }
}

/**
 * Transforme des date au format string en object Date
 * @param {string} dateString
 */
function parseDateWithoutTimezone(dateString) {
    const iso = new Date(dateString).toISOString().slice(0, -1)
    return new Date(iso);
}