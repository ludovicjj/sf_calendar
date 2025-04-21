import React from "react";

export default function FormHeader({ event, handleCloseModal, showSummary, showDelete }) {
    return (
        <div className="flex flex-row items-center mb-3">
            {/* Section de gauche */}
            <div>
                {event && (
                    <button
                        type="button"
                        className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 bg-gray-100 hover:text-black transition-colors"
                        onClick={() => showSummary(event)}
                        aria-label="Retour"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"/>
                        </svg>
                    </button>
                )}
            </div>

            {/* Section de droite */}
            <div className="flex flex-1 justify-end gap-1">
                {event && (
                    <>
                        <button
                            type="button"
                            className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                            onClick={() => showDelete()}
                            aria-label="Supprimer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                            onClick={handleCloseModal}
                            aria-label="Envoyer par email"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"
                                />
                            </svg>
                        </button>
                    </>

                )}

                <button
                    type="button"
                    className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    onClick={handleCloseModal}
                    aria-label="Fermer"
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}