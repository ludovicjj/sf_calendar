import React from 'react';
import PropTypes from "prop-types";
import MonthCell from "./MonthCell";

/**
 * Représente une rangée (semaine) dans la vue mensuelle du calendrier
 */
export default function MonthRow ({ week, currentDate, eventsMap, openModal, isLastRow }) {
    // Map pour stocker les positions par semaines
    const positionMap = new Map()

    const rowClasses = [
        "flex flex-row",
        !isLastRow ? "border-b border-gray-200" : ""
    ].filter(Boolean).join(" ");

    return(
        <div
            className={rowClasses}
        >
            {week.map((dayOfWeek, index) => (
                <MonthCell
                    key={index}
                    dayOfWeek={dayOfWeek}
                    currentDate={currentDate}
                    eventsMap={eventsMap}
                    openModal={openModal}
                    positionMap={positionMap}
                    isLastCell={index === week.length - 1}
                />
            ))}
        </div>
    )
}

MonthRow.propTypes = {
    week: PropTypes.array.isRequired,
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
    isLastRow: PropTypes.bool
};