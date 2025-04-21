import React, {useMemo} from 'react';
import {endOfMonth, endOfWeek, getDaysBetween, startOfWeek} from "../../../../utils/dateUtils";
import MonthHeader from "./MonthHeader";
import PropTypes from "prop-types";
import MonthRow from "./MonthRow";

/**
 * Composant principal pour l'affichage du calendrier en mode mois
 * Gère la prévisualisation des événements et la structure du calendrier
 */
export default function MonthContainer ({currentDate, eventsMap, openModal}) {

    const weeks = useMemo(() =>{
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0)
        const start = startOfWeek(firstDayOfMonth)
        const end = endOfWeek(endOfMonth(firstDayOfMonth))
        const daysOfMonth = getDaysBetween(start, end)

        // Division en semaines
        const weeks = [];
        for (let i = 0; i < daysOfMonth.length; i += 7) {
            weeks.push(daysOfMonth.slice(i, i + 7));
        }

        return weeks
    }, [currentDate])

    return (
        <div>
            <MonthHeader />

            {weeks.map((week, index) => {
                return <MonthRow
                    key={index}
                    week={week}
                    currentDate={currentDate}
                    eventsMap={eventsMap}
                    openModal={openModal}
                    isLastRow={index === weeks.length - 1}
                />
            })}
        </div>
    );
}

MonthContainer.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    eventsMap: PropTypes.instanceOf(Map).isRequired,
    openModal: PropTypes.func.isRequired,
};