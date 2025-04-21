import React from "react";

export default function DeleteHeader({ event, handleCloseModal, showSummary }) {
    return (
        <div className="flex justify-between items-center mb-3">
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

            {/* Close Modal */}
            <button
                type="button"
                className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                onClick={handleCloseModal}
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                </svg>
            </button>
        </div>
    );
}