import React from "react";

export default function DayHeader({ handleCloseModal, date }) {
    return (
        <div className="relative mb-3">
            {/* Close Modal */}
            <button
                type="button"
                className="absolute top-0 right-0 rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                onClick={handleCloseModal}
                aria-label="Fermer"
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                </svg>
            </button>

            {/* Contenu du jour */}
            <div className="flex flex-col items-center justify-center pt-4 pb-3">
                {/* Jour de la semaine abrégé */}
                <p className="text-xs uppercase text-gray-500 font-medium">
                    {new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date).toUpperCase()}
                </p>

                {/* Numéro du jour en gros */}
                <p className="text-4xl font-medium text-gray-800 leading-tight">
                    {date.getDate()}
                </p>
            </div>
        </div>
    )
}