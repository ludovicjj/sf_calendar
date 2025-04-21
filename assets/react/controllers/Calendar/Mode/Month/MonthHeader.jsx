import React from 'react';

export default function MonthHeader () {
    const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    return (
        <div className="flex flex-row sticky top-0 rounded-lg bg-white z-20" role="row">
            {weekDays.map((day, index) => (
                <div key={index} className="flex-1 border-b border-gray-200">
                    <p className="text-right text-sm font-normal text-gray-600 py-1 px-2">{day}</p>
                </div>
            ))}
        </div>
    );
}