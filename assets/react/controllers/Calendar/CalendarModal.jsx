import React, {useEffect, useMemo, useState} from 'react';
import ReactDOM from "react-dom";

export default function CalendarModal ({ isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false);

    const choices = useMemo(() => {
        return [
            { color: '#3788d8', label: 'blue' },
            { color: '#74b057', label: 'green' },
            { color: '#ff5858', label: 'red' },
            { color: '#fcd34d', label: 'yellow' },
            { color: '#9ca3af', label: 'gray' },
        ]
    }, [])

    // Update state when property IsOpen change
    useEffect(() => {
        let timer = null;

        if (isOpen) {
            // affiche immédiatement la modale
            setIsVisible(true);
            // change les classes de transition apres un delay
            timer = setTimeout(() => setIsAnimating(true), 300);
        } else {
            // retire immédiatement les classes de transition
            setIsAnimating(false);
            // cache la modal apres un delay
            timer = setTimeout(() => setIsVisible(false), 300);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isOpen]);

    if (!isVisible) {
        return null;
    }

    return ReactDOM.createPortal (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={onClose}
        >
            <div
                className={`bg-white w-[600px] max-w-[calc(100vw-20px)] max-h-[calc(100vh-20px)] p-6 rounded-lg transition-transform duration-300 ${isAnimating ? "translate-y-0": "translate-y-[-50px]"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between mb-3">
                    <h2 className="text-md font-medium text-gray-800">
                        Ajouter un événement
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <form>
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="name">Nom de l'événement</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="startAt">Date de début</label>
                            <input
                                type="text"
                                name="startAt"
                                id="startAt"
                                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="endAt">Date de fin</label>
                            <input
                                type="text"
                                name="endAt"
                                id="endAt"
                                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Couleur de l'événement</span>
                            <div className="flex gap-4 mt-1">
                                {choices.map((choice) => (
                                    <label key={choice.label} className="flex items-center color-item">
                                        <input
                                            type="radio"
                                            name="color"
                                            value={choice.label}
                                            className="p-2 rounded-full"
                                        />
                                        <span
                                            className="block w-[25px] h-[25px] rounded-full border-2 border-gray-400 cursor-pointer "
                                            style={{ backgroundColor: choice.color }}
                                        ></span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="comment">Commentaire</label>
                            <textarea
                                name="comment"
                                id="comment"
                                className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500 h-36"
                            />
                        </div>

                        <button type="submit"
                                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                                formNoValidate
                        >
                            Enregistrer
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
}