import React from 'react';

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
});

export default function WeekCell ({hour, events, openModal }) {
    const eventsWithStartFlag = events.map(event => ({
        ...event,
        startsInThisHour: event.start.getHours() === hour
    }));

    const getColorClass = (color) => {
        switch(color) {
            case 'red': return 'bg-event-red';
            case 'blue': return 'bg-event-blue';
            case 'green': return 'bg-event-green';
            case 'yellow': return 'bg-event-yellow';
            case 'gray': return 'bg-event-gray';
            default: return 'bg-event-blue';
        }
    };

    return (
        <div className="h-[60px] border-b border-gray-200 relative">
            {eventsWithStartFlag.map((event, index) => {
                if (event.startsInThisHour) {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);

                    // Tools for totalHeightPercentage and topPercentage
                    const startHour = eventStart.getHours();
                    const endHour = eventEnd.getHours();
                    const startMinutes = eventStart.getMinutes();
                    const endMinutes = eventEnd.getMinutes();

                    // Calcul topPercentage
                    const topPercentage = (startMinutes / 60) * 100;

                    // Calcul totalHeightPercentage
                    let totalHeightPercentage
                    if (endHour === startHour) {
                        // Événement dans la même heure
                        totalHeightPercentage = ((endMinutes - startMinutes) / 60) * 100;
                    } else {
                        // Événement sur plusieurs heures
                        totalHeightPercentage = (endHour - startHour) * 100 + ((endMinutes - startMinutes) / 60) * 100;
                    }
                    totalHeightPercentage = Math.max(totalHeightPercentage, 1.67); // Au moins 1 minute

                    // Position
                    const position = event.position;
                    let left = position * 5
                    let width =  95 - left

                    // Couleur en fonction de l'événement
                    const colorClass = getColorClass(event.color);

                    // Classes pour l'événement
                    const eventClasses = [
                        'absolute z-10 px-1 overflow-hidden cursor-pointer text-white text-xs',
                        'rounded-t rounded-b',
                        colorClass,
                        position > 0 ? 'border border-white' : ''
                    ].filter(Boolean).join(' ');

                    // Détermine si l'événement est trop petit pour afficher le contenu complet
                    const canShowContent = totalHeightPercentage > 25;

                    return (
                        <div
                            key={`event-${index}`}
                            className={eventClasses}
                            style={{
                                top: `${topPercentage}%`,
                                height: `${totalHeightPercentage}%`,
                                width: `${width}%`,
                                left: `${left}%`,
                            }}
                            onClick={() => openModal(event)}
                            title={`${event.title} (${timeFormatter.format(eventStart)} - ${timeFormatter.format(eventEnd)})`}
                        >
                            {canShowContent && (
                                <>
                                    <div className="text-[10px] opacity-90">
                                        {timeFormatter.format(eventStart)} - {timeFormatter.format(eventEnd)}
                                    </div>
                                    {totalHeightPercentage > 60 && (
                                        <div className="truncate font-medium">{event.title}</div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                }
            })}
        </div>
    );
}