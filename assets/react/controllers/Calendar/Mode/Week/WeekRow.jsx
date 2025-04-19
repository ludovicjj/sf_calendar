import React, {useMemo} from 'react';
import WeekCell from "./WeekCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Obtient toutes les heures où un événement est présent
 * @param {Object} event - L'événement
 * @returns {number[]} - Tableau des heures où l'événement est présent
 */
const getEventHours= (event)  => {
    const startHour = event.start.getHours();
    const endHour = event.end.getHours();
    const endMinutes = event.end.getMinutes();

    const hours = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        // Un événement qui se termine à X:00 n'est pas visible dans l'heure X
        if (hour === endHour && endMinutes === 0) continue;
        hours.push(hour);
    }

    return hours;
}

export default function WeekRow ({dayEvents, openModal}) {
    const eventsWithPositions = useMemo(() => {
        // Map pour stocker les positions
        const eventPositions = new Map();

        // Attribuer les positions aux événements
        dayEvents.forEach((event, index, events) => {
            const eventHours = getEventHours(event);

            // Trouver la position maximale utilisée par les événements précédents
            let maxPosition = -1;

            // Vérifier uniquement les événements précédents
            events.slice(0, index).forEach(prevEvent => {
                const prevEventHours = getEventHours(prevEvent);
                const hasOverlap = eventHours.some(hour =>
                    prevEventHours.includes(hour)
                );

                if (hasOverlap && eventPositions.has(prevEvent.token)) {
                    maxPosition = Math.max(maxPosition, eventPositions.get(prevEvent.token));
                }
            });

            // Attribuer une position = max + 1
            eventPositions.set(event.token, maxPosition + 1);
        });

        return dayEvents.map(event => ({
            ...event,
            position: eventPositions.get(event.token)
        }));
    }, [dayEvents]);

    return(
        <div
            className="week-column flex-1 border-l border-gray-200"
        >
            {HOURS.map((hour, index) => {
                return <WeekCell
                    key={index}
                    hour={hour}
                    events={eventsWithPositions}
                    openModal={openModal}
                />
            })}
        </div>
    )
}