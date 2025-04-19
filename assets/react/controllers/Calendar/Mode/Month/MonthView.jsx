import React from 'react';
import {endOfMonth, endOfWeek, getDaysBetween, startOfWeek} from "../../../../utils/dateUtils";
import MonthCell from "./MonthCell";
import MonthHeader from "./MonthHeader";
import PropTypes from "prop-types";

export default function MonthView ({currentDate, eventsMap, openModal}) {
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
            <MonthHeader />
            {weeks.map((week, index) => {
                const positionMap = new Map()

                return (
                    <div
                        key={index}
                        className="calendar-row"
                    >
                        {week.map((dayOfWeek, index) => (
                            <MonthCell
                                key={index}
                                dayOfWeek={dayOfWeek}
                                currentDate={currentDate}
                                eventsMap={eventsMap}
                                positionMap={positionMap}
                                openModal={openModal}
                            />
                        ))}
                    </div>
                )
            })}
        </div>
    );
}

MonthView.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
};