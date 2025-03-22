import {useEffect, useState} from "react";
const ANIMATION_DURATION = 300; // en ms

export function Toast({ title, content, type = "info", onClose, startExitAnimation}) {
    const [isExiting, setIsExiting] = useState(false);

    // Styles en fonction du type
    const getTypeStyles = () => {
        switch (type) {
            case "success":
                return "bg-green-100 border-green-500 text-green-700";
            case "error":
                return "bg-red-100 border-red-500 text-red-700";
            case "warning":
                return "bg-yellow-100 border-yellow-500 text-yellow-700";
            case "info":
            default:
                return "bg-blue-100 border-blue-500 text-blue-700";
        }
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, ANIMATION_DURATION);
    };

    useEffect(() => {
        if (startExitAnimation) {
            handleClose();
        }
    }, [startExitAnimation]);

    const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

    return (
        <div
            className={`rounded-lg border-l-4 p-4 shadow-md mb-3 ${getTypeStyles()} ${animationClass}`}
            style={{ transition: "transform 0.3s ease-out, opacity 0.3s ease-out" }}
            role="alert"
        >
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    {title && <h3 className="font-bold mb-1">{title}</h3>}
                    {content && <p className="text-sm">{content}</p>}
                </div>
                <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Fermer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}