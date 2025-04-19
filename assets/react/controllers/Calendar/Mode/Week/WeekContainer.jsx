import React, {useMemo} from 'react';
import {endOfWeek, getDayId, getDaysBetween, startOfWeek} from "../../../../utils/dateUtils";
import WeekHeader from "./WeekHeader";
import PropTypes from "prop-types";
import WeekRow from "./WeekRow";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * Vérifie si un événement est présent à une heure spécifique
 * @param {Object} event - L'événement à vérifier
 * @param {number} hour - L'heure à vérifier
 * @returns {boolean} - True si l'événement est présent à cette heure
 */
const isEventPresentAtHour = (event, hour) => {
    const startHour = event.start.getHours();
    const endHour = event.end.getHours();
    const endMinutes = event.end.getMinutes();

    return startHour <= hour &&
        (endHour > hour || (endHour === hour && endMinutes > 0));
};

export default function WeekContainer ({currentDate, eventsMap, openModal}) {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(start);
    const daysOfWeek = getDaysBetween(start, end);

    const eventsByDay  = useMemo(() => {
        // Create Map
        const eventsByDay = new Map();

        daysOfWeek.forEach(day => {
            const dayId = getDayId(day);
            const dayEvents = eventsMap.get(dayId) || [];

            const sortedEvents = [...dayEvents]
                .filter(event => !event.fullDay)
                .sort((a, b) => a.start - b.start);

            eventsByDay.set(dayId, sortedEvents);
        });

        return eventsByDay;
    }, [daysOfWeek, eventsMap])

    // const processedEvents = useMemo(() => {
    //     // Initialiser la structure de données
    //     const eventsByDayAndHour = new Map();
    //
    //     // Initialiser la map pour chaque jour et heure
    //     daysOfWeek.forEach(day => {
    //         const dayId = getDayId(day);
    //         eventsByDayAndHour.set(dayId, new Map());
    //
    //         HOURS.forEach(hour => {
    //             eventsByDayAndHour.get(dayId).set(hour, []);
    //         });
    //     });
    //
    //     // Traiter chaque jour (lundi au dimanche)
    //     daysOfWeek.forEach(day => {
    //         // recupere les event par jour
    //         const dayId = getDayId(day);
    //         const dayEvents = eventsMap.get(dayId) || [];
    //
    //         // Filtrer les événements non journée complète et les trier par heure de début
    //         const sortedEvents = [...dayEvents]
    //             .filter(event => !event.fullDay)
    //             .sort((a, b) => a.start - b.start);
    //
    //         if (sortedEvents.length === 0) return;

            // Positions assignées aux événements
            //const eventPositions = new Map();

            // Attribuer les positions aux événements
            // sortedEvents.forEach((event, index, events) => {
            //     const eventHours = getEventHours(event);
            //
            //     // Trouver la position maximale utilisée par les événements précédents
            //     // qui se chevauchent avec celui-ci
            //     let maxPosition = -1;
            //
            //     // Vérifier uniquement les événements précédents (déjà traités)
            //     events.slice(0, index).forEach(prevEvent => {
            //         console.log(prevEvent)
            //         // Vérifier s'il y a chevauchement d'heures
            //         const prevEventHours = getEventHours(prevEvent);
            //         const hasOverlap = eventHours.some(hour =>
            //             prevEventHours.includes(hour)
            //         );
            //
            //         if (hasOverlap && eventPositions.has(prevEvent.token)) {
            //             maxPosition = Math.max(maxPosition, eventPositions.get(prevEvent.token));
            //         }
            //     });
            //
            //     // Attribuer une position = max + 1
            //     eventPositions.set(event.token, maxPosition + 1);
            // });

            // Distribuer les événements aux cellules horaires
    //         sortedEvents.forEach(event => {
    //             const eventHours = getEventHours(event);
    //             //const position = eventPositions.get(event.token);
    //             const startHour = event.start.getHours();
    //
    //             eventHours.forEach(hour => {
    //                 const startsInThisHour = hour === startHour;
    //
    //                 eventsByDayAndHour.get(dayId).get(hour).push({
    //                     ...event,
    //                     startsInThisHour,
    //                     //position
    //                 });
    //             });
    //         });
    //     });
    //
    //     return eventsByDayAndHour;
    // }, [daysOfWeek, eventsMap]);
    //
    // console.log(processedEvents);

    return (
        <div>
            {/* Header */}
            <WeekHeader daysOfWeek={daysOfWeek} />

            <div className="flex flex-row relative">
                {/* Time row */}
                <div className="time-labels-column w-16 text-right pr-2">
                    {HOURS.map(hour => (
                        <div
                            key={`hour-label-${hour}`}
                            className="time-label"
                            style={{ height: '60px' }}
                        >
                            <span>{hour}:00</span>
                        </div>
                    ))}
                </div>

                {/* Day row */}
                <div className="week-container flex-1 flex">
                    {daysOfWeek.map((day, dayIndex) => {
                        const dayId = getDayId(day);
                        const dayEvents = eventsByDay.get(dayId) || [];

                        return(
                            <WeekRow
                                key={dayIndex}
                                dayEvents={dayEvents}
                                openModal={openModal}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

WeekContainer.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
};