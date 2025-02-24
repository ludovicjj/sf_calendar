/**
 * Parse une liste d'événements sans appliquer la timezone du navigateur aux dates de début et de fin.
 *
 * @param {Array<Object>} initialEvents - Liste des événements à parser.
 * @param {string} initialEvents[].name - Nom ou titre de l'événement.
 * @param {string} initialEvents[].start - Date de début au format ISO 8601 (ex: "2024-02-25T10:00:00Z").
 * @param {string} initialEvents[].end - Date de fin au format ISO 8601 (ex: "2024-02-25T12:00:00Z").
 * @param {boolean} initialEvents[].fullDay - Indique si l'événement dure toute la journée.
 * @param {string} initialEvents[].type - Couleur de l'événement (ex: "red", "blue").
 * @param {string|null} initialEvents[].description - Description détaillée de l'événement.
 * @returns {Array<Object>} Liste des événements avec des objets `Date` au lieu de chaînes pour les dates.
 */
export function parseEvent(initialEvents) {
    return  initialEvents.map(event => {
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
    }).filter(event => event !== null);
}

/**
 * Transforme des date au format string en object Date
 * @param {string} dateString
 */
function parseDateWithoutTimezone(dateString) {
    const iso = new Date(dateString).toISOString().slice(0, -1)
    return new Date(iso);
}