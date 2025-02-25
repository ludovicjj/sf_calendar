import React from 'react';
import {diffInDay, endOfWeek, getDayId, minDates} from "../../../js/functions/date";
import PropTypes from "prop-types";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
})

/**
 * Retourne la position disponible pour les évènements sur plusieurs jours
 *
 * @param positionMap
 * @return {number}
 */
const getAvailablePosition = (positionMap) => {
    if (positionMap.size === 0) {
        return 0;
    }

    const positions = Array.from(positionMap.values()).map(Number);
    const max = Math.max(...positions);

    for (let i = 0; i < max; i++) {
        if (!positions.includes(i)) {
            return i;
        }
    }

    return max + 1;
}
export default function CalendarCell ({ currentDate, dayOfWeek, eventsMap, positionMap }) {
    const isCurrentMonth = dayOfWeek.getMonth() === currentDate.getMonth()
    const isCurrentDay = dayOfWeek.toDateString() === new Date().toDateString()

    const dayId = getDayId(dayOfWeek)

    // Récupère les évènements pour une journée donnée
    const dayEvents = eventsMap.get(dayId) || []

    // Hydrate positionMap avec les évènements sur plusieurs jours
    dayEvents.forEach((event) => {
        const startId = getDayId(event.start)
        if (event.fullDay && (startId === dayId || dayOfWeek.getDay() === 1)) {
            const position = getAvailablePosition(positionMap);
            positionMap.set(event, position);
        }
    });

    /**
     * Gestion du chevauchement entre les évènements sur plusieurs jours et les évènements sur un jour
     * @return {number}
     */
    const getMaxOffset = () => {
        return positionMap.size > 0 ? Math.max(...positionMap.values()) + 1 : 0;
    }

    const cellClass = ['calendar-cell']
    if (!isCurrentMonth) {
        cellClass.push('calendar-cell-out')
    }

    if (isCurrentDay) {
        cellClass.push('bg-blue-100')
    }

    return (
        <div
            className={cellClass.join(' ')}
        >
            <div className="calendar_date text-center">
                {dayOfWeek.getDate()}
            </div>
            <div
                className="calendar_events"
                style={{
                    '--offset': getMaxOffset().toString(),
                }}
            >
                {dayEvents.map((event, index) => {
                    const eventClasses = ['calendar_event']
                    const eventStartId = getDayId(event.start)

                    // Couleur d'un évènement
                    if (event.type) {
                        eventClasses.push('calendar_event-' + event.type)
                    }

                    if (event.fullDay && (eventStartId === dayId || dayOfWeek.getDay() === 1)) {
                        eventClasses.push('calendar_event-fullday')
                        const position = positionMap.get(event);

                        // Récupère la date la plus petite
                        const endDate =  minDates([event.end, endOfWeek(dayOfWeek)])
                        // Calcule le nb de jours entre le jour en cours d'itération et la fin de l'évènement
                        const days = diffInDay(dayOfWeek, endDate)

                        if (dayId !== eventStartId) {
                            eventClasses.push('calendar_event-overflow-left')
                        }

                        if (endDate !== event.end) {
                            eventClasses.push('calendar_event-overflow-right')
                        }

                        return (
                            <div
                                style={{
                                    '--days': days.toString(),
                                    '--offset': position.toString(),
                                }}
                                key={index}
                                className={eventClasses.join(' ')}
                            >
                                {event.name}
                            </div>
                        );
                    }

                    if (event.fullDay && dayId === getDayId(event.end)) {
                        positionMap.delete(event)
                    }

                    if (!event.fullDay) {
                        eventClasses.push('calendar_event-hour')
                        const formattedStartTime = timeFormatter.format(new Date(event.start));

                        return (
                            <div
                                key={index}
                                className={eventClasses.join(' ')}
                                data-id={event.id}
                                data-event-key={event.id}
                            >
                                <span>
                                    {formattedStartTime} - {event.name}
                                </span>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

CalendarCell.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    dayOfWeek: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    positionMap: PropTypes.instanceOf(Map).isRequired,
};