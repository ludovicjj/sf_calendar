import React from "react";
import {useToasts} from "../../../ToastContext";
import DeleteHeader from "../Header/DeleteHeader";
import {getColorClass, formatEventDate} from "../../../../utils/eventUtils";

export default function DeleteView({ event, showSummary, handleRemoveEvent, handleCloseModal }) {
    const { pushToast } = useToasts();

    const addToast = (title, content, type = "success", duration = 5000) => {
        pushToast({
            title: title,
            content: content,
            type: type,
            duration: duration
        })
    }

    const handleDelete = async () => {
        if (!event) {
            addToast("Erreur", "Une erreur est survenu.", 'error');
            return;
        }

        try {
            const url = `/api/event/${event.token}`

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                handleCloseModal()
                handleRemoveEvent(event)
                addToast("Succès", "L'événement a été supprimé avec succès.");
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'événement :", error);
        }
    }

    return (
        <div>
            <DeleteHeader
                event={event}
                showSummary={showSummary}
                handleCloseModal={handleCloseModal}

            />
            <div className="modal-body">
                <div className="mb-4 p-4">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <div className="w-5 h-5 text-gray-800">
                            <svg viewBox="0 0 24 24">
                                <g fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5"/>
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" d="M12 7v6"/>
                                    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
                                </g>
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">
                            Vous êtes sur le point de supprimer cet événement. Cette action est irréversiblle, êtes vous  sure de continuer ?
                        </p>
                    </div>

                    <div className="flex items-start gap-4 mb-4 p-4 border border-gray-200 rounded">
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
                </div>
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="
                        border border-grey-900 hover:border-red-700 hover:bg-red-500 hover:text-white
                        p-2 rounded-lg transition-all duration-300 ease-in-out"
                    >
                        Je confirme
                    </button>
                </div>
            </div>
        </div>
    );
}