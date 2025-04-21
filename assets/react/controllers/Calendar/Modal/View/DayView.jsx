import React from "react";
import { getDayId } from "../../../../utils/dateUtils";
import {getColorClass} from '../../../../utils/eventUtils'
import DayHeader from "../Header/DayHeader";

export default function DayView({ date, eventsMap, showSummary , handleCloseModal}) {
    const dayId = getDayId(date);
    const dayEvents = eventsMap.get(dayId) || [];

    const fullDayEvents = dayEvents.filter(event => event.fullDay);
    const hourEvents = dayEvents.filter(event => !event.fullDay)
        .sort((a, b) => new Date(a.start) - new Date(b.start))

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div>
            <DayHeader
                handleCloseModal={handleCloseModal}
                date={date}
            />

            <div className="modal-body">
                {/* FullDay Listing */}
                {fullDayEvents.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2 text-gray-600">Journée entière</h3>
                        <div className="space-y-2">
                            {fullDayEvents.map((event, index) => (
                                <div
                                    key={`fullday-${index}`}
                                    className={`rounded p-2 text-white cursor-pointer ${getColorClass(event.color)}`}
                                    onClick={() => showSummary(event)}
                                >
                                    <div className="text-sm">{event.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hour Listing */}
                {hourEvents.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-600">Horaires</h3>
                        <div className="space-y-2">
                            {hourEvents.map((event, index) => {
                                const startTime = timeFormatter.format(new Date(event.start));
                                const endTime = timeFormatter.format(new Date(event.end));

                                return (
                                    <div
                                        key={`hour-${index}`}
                                        className="pl-2 hover:bg-gray-100 cursor-pointer transition-colors py-1 rounded-lg"
                                        onClick={() => showSummary(event)}
                                    >
                                        <div className="flex items-center">
                                        <span
                                            className={`w-2 h-2 block mr-2 rounded-full flex-shrink-0 ${getColorClass(event.color)}`}
                                        ></span>
                                            <div className="text-xs text-gray-500 mr-2">
                                                {startTime} - {endTime}
                                            </div>
                                            <div>
                                                <div className="text-sm">{event.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {dayEvents.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        Aucun événement pour cette journée
                    </div>
                )}
            </div>
        </div>
    );
}