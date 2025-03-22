import {parseStringToDate} from "./dateUtils";

/**
 * Parse une liste d'événements sans appliquer la timezone du navigateur aux dates de début et de fin.
 *
 * @param {Array<Object>} initialEvents - Liste des événements à parser.
 * @param {string} initialEvents[].title - Nom ou titre de l'événement.
 * @param {string} initialEvents[].start - Date de début au format ISO 8601 (ex: "2024-02-25T10:00:00Z").
 * @param {string} initialEvents[].end - Date de fin au format ISO 8601 (ex: "2024-02-25T12:00:00Z").
 * @param {boolean} initialEvents[].fullDay - Indique si l'événement dure toute la journée.
 * @param {string} initialEvents[].color - Couleur de l'événement (ex: "red", "blue").
 * @param {string|null} initialEvents[].description - Description détaillée de l'événement.
 * @param {string} initialEvents[].token - Identifiant unique de l'événement (UUID v4).
 * @returns {Array<Object>} Liste des événements avec des objets `Date` au lieu de chaînes pour les dates.
 */
export function parseEvent(initialEvents) {
    return  initialEvents.map(event => {
        return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        };
    })
}

/**
 * Défini si un événement est sur plusieurs jours
 * @param {string} start
 * @param {string} end
 */
export function isFullDay(start, end) {
    const startDate = parseStringToDate(start);
    const endDate = parseStringToDate(end);

    return startDate.toDateString() !== endDate.toDateString();
}

/**
 * Défini si un événement est sur plusieurs jours
 * @param {string} start
 * @param {string} end
 */
export function isStartBeforeEnd(start, end) {
    if (!start || !end) return true;

    const startDate = parseStringToDate(start);
    const endDate = parseStringToDate(end);

    return startDate < endDate;
}

/**
 * Transforme des date au format string en object Date
 * @param {string} dateString
 */
function parseDateWithoutTimezone(dateString) {
    const iso = new Date(dateString).toISOString().slice(0, -1)
    return new Date(iso);
}