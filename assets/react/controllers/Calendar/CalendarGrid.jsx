import React from 'react';
import WeekContainer from "./Mode/Week/WeekContainer";
import MonthContainer from "./Mode/Month/MonthContainer";
import PropTypes from "prop-types";

export default function CalendarGrid ({ currentDate, eventsMap, openModal, mode }) {

    const VIEW_COMPONENTS = {
        'month': MonthContainer,
        'week': WeekContainer,
    };

    const ViewComponent = VIEW_COMPONENTS[mode] || MonthContainer;

    return (
        <div className="calendar">
            <ViewComponent
                currentDate={currentDate}
                eventsMap={eventsMap}
                openModal={openModal}
            />
        </div>
    );
}

CalendarGrid.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
};
