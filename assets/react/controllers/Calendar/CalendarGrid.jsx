import React from 'react';
import WeekContainer from "./Mode/Week/WeekContainer";
import MonthView from "./Mode/Month/MonthView";
import PropTypes from "prop-types";

export default function CalendarGrid ({ currentDate, eventsMap, openModal, mode }) {

    const VIEW_COMPONENTS = {
        'month': MonthView,
        'week': WeekContainer,
    };

    const ViewComponent = VIEW_COMPONENTS[mode] || MonthView;

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
