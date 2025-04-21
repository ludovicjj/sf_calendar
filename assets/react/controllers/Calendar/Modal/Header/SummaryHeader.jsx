import React from "react";

export default function SummaryHeader({ handleCloseModal, showEdit, showDelete }) {
    return (
        <div className="flex justify-end items-center gap-2 mb-3">
            {/* Edit */}
            <button
                type="button"
                className="rounded-full w-[35px] h-[35px] flex justify-center items-center text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                onClick={() => showEdit()}
                aria-label="Modifier"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                    <g fill="currentColor">
                        <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd"/>
                        <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z"/>
                    </g>
                </svg>
            </button>

            {/* Remove */}
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

            {/* Send */}
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