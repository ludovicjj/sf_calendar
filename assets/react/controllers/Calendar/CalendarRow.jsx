import React from 'react';
import {endOfMonth, endOfWeek, getDaysBetween, startOfWeek} from "../../../js/functions/date";
import CalendarCell from "./CalendarCell";
import PropTypes from "prop-types";

export default function CalendarRow ({currentDate, eventsMap}) {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0)
    const start = startOfWeek(firstDayOfMonth)
    const end = endOfWeek(endOfMonth(firstDayOfMonth))
    const daysOfMonth = getDaysBetween(start, end)

    // Divise les jours du mois en groupe de 7 jours pour obtenir une semaine
    const weeks = [];
    for (let i = 0; i < daysOfMonth.length; i += 7) {
        weeks.push(daysOfMonth.slice(i, i + 7));
    }

    return (
        <div>
            {weeks.map((week, weekIndex) => {
                const positionMap = new Map()

                return (
                    <div
                        key={weekIndex}
                        className="calendar-row"
                    >
                        {week.map((dayOfWeek, dayIndex) => (
                            <CalendarCell
                                key={dayIndex}
                                dayOfWeek={dayOfWeek}
                                currentDate={currentDate}
                                eventsMap={eventsMap}
                                positionMap={positionMap}
                            />
                        ))}
                    </div>
                )
            })}
        </div>
    );
}

CalendarRow.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
};