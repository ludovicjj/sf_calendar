import React, {useMemo} from 'react';
import WeekCell from "./WeekCell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Vérifie si deux événements se chevauchent réellement en temps
 * @param {Object} currentEvent - Événement en cours de positionnement
 * @param {Object} prevEvent - Événement precédent
 * @returns {boolean} - True si les événements se chevauchent
 */
const eventsOverlap = (currentEvent, prevEvent) => {
    const currentStart = currentEvent.start.getTime();
    const currentEnd = currentEvent.end.getTime();

    const prevStart = prevEvent.start.getTime();
    const prevEnd = prevEvent.end.getTime();

    // Vérifier si les plages temporelles se chevauchent
    return currentStart < prevEnd && currentEnd > prevStart;
};

export default function WeekRow ({dayEvents, openModal}) {
    const eventsWithPositions = useMemo(() => {
        // Map pour stocker les positions
        const eventPositions = new Map();

        // Attribuer les positions aux événements
        dayEvents.forEach((event, index, events) => {
            // Trouver la position maximale utilisée par les événements précédents
            let maxPosition = -1;

            // Vérifier uniquement les événements précédents
            events.slice(0, index).forEach(prevEvent => {
                const hasOverlap = eventsOverlap(event, prevEvent);

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