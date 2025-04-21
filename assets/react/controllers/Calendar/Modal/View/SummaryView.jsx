import React from 'react';
import {getColorClass, formatEventDate} from '../../../../utils/eventUtils'
import SummaryHeader from "../Header/SummaryHeader";

export default function EventSummary({event, handleCloseModal, showEdit, showDelete}) {
    if (!event) return null;

    return (
        <div>
            <SummaryHeader
                handleCloseModal={handleCloseModal}
                showEdit={showEdit}
                showDelete={showDelete}
            />

            <div className="modal-body">
                <div className="flex items-start gap-4 mb-4">
                    {/* Couleur de l'événement */}
                    <div className={`block mt-2 rounded h-[15px] w-[15px] ${getColorClass(event.color)}`}></div>
                    <div>
                        {/* Titre de l'événement */}
                        <p className="font-medium">{event.title}</p>
                        {/* Dates de l'événement */}
                        <p className="text-gray-600 text-xs">
                            {formatEventDate(event)}
                        </p>
                    </div>
                </div>

                {/* Description */}
                {event.description && (
                    <div className="flex items-strat gap-4 mb-4">
                        {/* Icon description */}
                        <div className="mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeWidth="2" d="M2.75 5.25h18.5M2.75 12h18.5m-18.5 6.75h13.5"
                                />
                            </svg>
                        </div>
                        {/* Description Content */}
                        <div className="text-sm text-gray-600 whitespace-pre-line">
                            {event.description}
                        </div>
                    </div>
                )}

                {/* Author */}
                <div className="flex items-strat gap-4 mb-4">
                    {/* Icon Author */}
                    <div className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12 2a5 5 0 1 0 5 5a5 5 0 0 0-5-5m0 8a3 3 0 1 1 3-3a3 3 0 0 1-3 3m9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"
                            />
                        </svg>
                    </div>
                    {/* Author fullName */}
                    <div className="text-sm text-gray-600">
                        John Doe
                    </div>
                </div>
            </div>
        </div>
    )
}