import React from 'react';
import CalendarRow from "./CalendarRow";
import PropTypes from "prop-types";

export default function CalendarGrid ({ currentDate, eventsMap }) {
    const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    return (
        <div className="calendar">
            <div className="flex flex-row" role="row">
                {weekDays.map((day, index) => (
                    <div key={index} className="flex-1 border-b border-gray-200">
                        <p className="text-right text-sm font-normal text-gray-600 py-1 px-2">{day}</p>
                    </div>
                ))}
            </div>
            <CalendarRow
                currentDate={currentDate}
                eventsMap={eventsMap}
            />
        </div>
    );
}

CalendarGrid.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
};
