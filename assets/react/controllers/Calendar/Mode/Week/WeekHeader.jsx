import React from 'react';

export default function MonthHeader ({ daysOfWeek }) {
    const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (date) => {
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    };

    // border-r last:border-r-0
    return (
        <div className="flex flex-row border-b" role="row">
            <div className="time-labels-column w-16 text-right pr-2"></div>
            {daysOfWeek.map((day, index) => {
                const dayIsToday = isToday(day);

                return (
                    <div key={index} className="flex-1 text-center py-2 border-l border-gray-200">
                        <div className="text-sm text-gray-600">
                            {weekDays[index]}
                        </div>
                        <div className="mt-1 relative inline-flex items-center justify-center">
                            {dayIsToday ? (
                                <span className="absolute w-8 h-8 bg-blue-500 rounded-full"></span>
                            ) : null}
                            <span className={`text-lg font-medium relative z-10 ${dayIsToday ? 'text-white' : 'text-gray-800'}`}>
                                {day.getDate()}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}