import React from 'react';
import {useToasts} from "../ToastContext";
import PropTypes from "prop-types";

const ALLOWED_MODES = ['month', 'week'];

export default function CalendarNav ({ currentDate, setCurrentDate, setIsModalOpen, setMode, mode }) {
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const { pushToast } = useToasts();

    const navigationStrategies = {
        year: {
            next: (date) => new Date(date.getFullYear() + 1, 0, 1),
            previous: (date) => new Date(date.getFullYear() - 1, 0, 1)
        },
        month: {
            next: (date) => new Date(date.getFullYear(), date.getMonth() + 1, 1),
            previous: (date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)
        },
        week: {
            next: (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7),
            previous: (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        },
        day: {
            next: (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
            previous: (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
        }
    };

    const handlePrevious = () => {
        setCurrentDate(prevDate => {
            const strategy = navigationStrategies[mode] || navigationStrategies.week;
            return strategy.previous(prevDate);
        });
    };

    const handleNext = () => {
        setCurrentDate(prevDate => {
            const strategy = navigationStrategies[mode] || navigationStrategies.week;
            return strategy.next(prevDate);
        });
    };

    const handleModeChange = (event) => {
        const newMode = event.target.value;
        // Reset current Date to today
        setCurrentDate(new Date());

        // Check selected mode
        if (ALLOWED_MODES.includes(newMode)) {
            setMode(newMode);
        } else {
            console.error(`Mode "${newMode}" is not allowed. Valid modes are: ${ALLOWED_MODES.join(', ')}`);
        }
    };

    const addToast = () => {
        pushToast({
            title: "Succès",
            content: "Bravo, vous savez cliquez sur un bouton !",
            duration: 5000
        })
    }

    return (
        <div className="flex justify-between my-4">
            {/* Left Navigation */}
            <div className="flex items-center gap-4">
                {/* Go today */}
                <button
                    type="button"
                    className="border border-grey-900 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                    onClick={goToToday}
                >
                    Aujourd'hui
                </button>

                <div className="flex gap-1">
                    {/* Go previous */}
                    <button
                        type="button"
                        className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                        onClick={handlePrevious}
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15 6l-6 6l6 6"/>
                        </svg>
                    </button>

                    {/* Go next */}
                    <button
                        type="button"
                        className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                        onClick={handleNext}
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

            {/* Right Navigation */}
            <div className="flex items-center gap-1">
                <select
                    value={mode}
                    onChange={handleModeChange}
                    className="select-thin-arrow block w-[150px] p-2 border border-grey-900 rounded-lg focus:outline-none cursor-pointer"
                >
                    <option value="month">Mois</option>
                    <option value="week">Semaine</option>
                </select>
                <button
                    type="button"
                    className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/>
                    </svg>
                </button>
                <button
                    type="button"
                    className="border border-grey-900 p-2 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-200 focus:outline-none"
                    onClick={addToast}>
                    Toast
                </button>
            </div>
        </div>
    );
}

CalendarNav.propTypes = {
    currentDate: PropTypes.instanceOf(Date).isRequired,
    setCurrentDate: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    setMode: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
};