import React, {useMemo} from 'react';
import {diffInDay, endOfWeek, getDayId, minDates} from "../../../../utils/dateUtils";
import PropTypes from "prop-types";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
})

/**
 * Représente une cellule (jour) dans la vue mensuelle du calendrier
 * Gère l'affichage des événements et les interactions
 */
export default function MonthCell ({ currentDate, dayOfWeek, eventsMap, positionMap, openModal, isLastCell }) {
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

    // Calcul du padding entre les évènements sur plusieurs jours et les évènements sur un jour
    const paddingTop = useMemo(() => {
        return getMaxOffset(positionMap) * 24;
    }, [positionMap]);

    const cellClasses = [
        "flex-1 flex-row aspect-square p-2",
        isCurrentDay ? 'bg-blue-100' : '',
        !isCurrentMonth ? 'calendar-cell-out': '',
        !isLastCell ? "border-r border-gray-200" : ""
    ].filter(Boolean).join(" ");

    const cellDateClasses = [
        'text-center',
        !isCurrentMonth ? 'opacity-30' : 'opacity-100',
    ].filter(Boolean).join(" ");

    return (
        <div className={cellClasses} style={{ width: 'calc(100% / 7)' }}>

            {/* Date indicator */}
            <div className={cellDateClasses}>
                {dayOfWeek.getDate()}
            </div>

            {/* Events container */}
            <div
                className="relative text-xs"
                style={{ paddingTop: `${paddingTop}px` }}
            >
                {renderEvents(dayEvents, dayOfWeek, positionMap, openModal)}
            </div>
        </div>
    );
}

/**
 * Rendu des événements pour la cellule
 */
function renderEvents(dayEvents, dayOfWeek, positionMap, openModal) {
    return dayEvents.map((event, index) => {
        const eventStartId = getDayId(event.start);
        const dayId = getDayId(dayOfWeek);

        // événement sur plusieurs jours
        if (event.fullDay && (eventStartId === dayId || dayOfWeek.getDay() === 1)) {
            return renderFullDayEvent(event, dayOfWeek, positionMap, index, openModal);
        }

        // Nettoyage de la Map
        if (event.fullDay && dayId === getDayId(event.end)) {
            positionMap.delete(event);
        }

        // événement sur un jour
        if (!event.fullDay) {
            return renderHourEvent(event, index, openModal);
        }

        return null;
    });
}

/**
 * Rendu d'un événement sur plusieurs jours
 */
function renderFullDayEvent(event, dayOfWeek, positionMap, index, openModal) {
    const dayId = getDayId(dayOfWeek);
    const eventStartId = getDayId(event.start);
    const position = positionMap.get(event);
    const endDate = minDates([event.end, endOfWeek(dayOfWeek)]);
    const days = diffInDay(dayOfWeek, endDate);

    // Couleur en fonction de l'événement
    const getColorClass = (color) => {
        switch(color) {
            case 'red': return 'bg-event-red';
            case 'blue': return 'bg-event-blue';
            case 'green': return 'bg-event-green';
            case 'yellow': return 'bg-event-yellow';
            case 'gray': return 'bg-event-gray';
            default: return 'bg-event-blue';
        }
    };

    const colorClass = getColorClass(event.color);

    const eventClasses = [
        'month_event-fullDay cursor-pointer absolute text-white h-[20px] z-10',
        colorClass
    ];

    // Classes de débordement
    if (dayId !== eventStartId) {
        eventClasses.push('month_event-overflow-left');
    }

    if (endDate !== event.end) {
        eventClasses.push('month_event-overflow-right');
    }

    return (
        <div
            style={{
                '--days': days.toString(),
                top: `${position * 24}px`,
            }}
            key={index}
            className={eventClasses.join(' ')}
            onClick={() => openModal(event)}
        >
            {event.title}
        </div>
    );
}

/**
 * Rendu d'un événement sur un jour
 */
function renderHourEvent(event, index, openModal) {
    // Couleur en fonction de l'événement
    const getColorClass = (color) => {
        switch(color) {
            case 'red': return 'bg-event-red';
            case 'blue': return 'bg-event-blue';
            case 'green': return 'bg-event-green';
            case 'yellow': return 'bg-event-yellow';
            case 'gray': return 'bg-event-gray';
            default: return 'bg-event-blue';
        }
    };

    const colorClass = getColorClass(event.color);

    const formattedStartTime = timeFormatter.format(new Date(event.start));

    return (
        <div
            key={index}
            className="flex items-center gap-1 mb-1 cursor-pointer hover:bg-gray-100 rounded px-1 py-px transition-colors"
            onClick={() => openModal(event)}
        >
            <span
                className={`w-2 h-2 block rounded-full flex-shrink-0 ${colorClass}`}
            ></span>
            <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
                {formattedStartTime} - {event.title}
            </span>
        </div>
    );
}

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

/**
 * Gestion du chevauchement entre les évènements sur plusieurs jours et les évènements sur un jour
 *
 * @param positionMap
 * @return {number}
 */
const getMaxOffset = (positionMap) => {
    return positionMap.size > 0 ? Math.max(...positionMap.values()) + 1 : 0;
}

MonthCell.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    dayOfWeek: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    positionMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
};