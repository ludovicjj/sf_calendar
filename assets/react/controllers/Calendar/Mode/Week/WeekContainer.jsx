import React, {useMemo} from 'react';
import {endOfWeek, getDayId, getDaysBetween, startOfWeek} from "../../../../utils/dateUtils";
import WeekHeader from "./WeekHeader";
import PropTypes from "prop-types";
import WeekRow from "./WeekRow";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekContainer ({currentDate, eventsMap, openModal}) {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(start);
    const daysOfWeek = getDaysBetween(start, end);

    const eventsByDay  = useMemo(() => {
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