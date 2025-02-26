import React from 'react';

export default function ({ currentDate, setCurrentDate, setIsModalOpen }) {
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    return (
        <div className="flex justify-between my-4">
            {/* Navigation Gauche */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="border border-grey-900 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                    onClick={goToToday}
                >
                    Aujourd'hui
                </button>

                <div className="flex gap-1">
                    <button
                        type="button"
                        className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                        onClick={goToPreviousMonth}
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15 6l-6 6l6 6"/>
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                        onClick={goToNextMonth}
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 6l6 6l-6 6"/>
                        </svg>
                    </button>
                </div>

                {/* Affichage du mois actuel */}
                <div className="font-medium text-xl">
                    {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </div>
            </div>

            {/* Bouton Ajouter un événement */}
            <div>
                <button
                    type="button"
                    className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}