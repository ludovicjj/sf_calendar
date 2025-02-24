import React, { useState } from 'react';
import Header from '../Header';
import CalendarNav from "./CalendarNav";
import CalendarGrid from "./CalendarGrid";
import {getDayId, getDaysBetween} from "../../../js/functions/date";
import {parseEvent} from "../../utils/eventUtils";

export default function ({ initialEvents }) {
    // Stocker la date actuelle
    const [currentDate, setCurrentDate] = useState(new Date());

    const parsedEvents = parseEvent(initialEvents);

    // Stocker les événements dans un Map (key : Y-m-d, value: array of object)
    const [eventsMap, setEventsMap] = useState(() => {
        const map = new Map();

        // sort formatted Events
        const sortEvents = [...parsedEvents].sort((a, b) => a.start < b.start ? -1 : 1)

        for (const event of sortEvents) {
            const days = getDaysBetween(event.start, event.end)
            for (const day of days) {
                const key = getDayId(day)
                if (!map.has(key)) {
                    map.set(key, []);
                }
                map.get(key).push(event);
            }
        }

        return map;
    });

    // Fonction pour ajouter un événement
    const addEvent = (event) => {
        const dayId = getDayId(new Date(event.start));
        setEventsMap(prevMap => {
            const newMap = new Map(prevMap);
            if (!newMap.has(dayId)) {
                newMap.set(dayId, []);
            }
            newMap.get(dayId).push(event);
            return newMap;
        });
    };

    // Fonction pour supprimer un événement
    const removeEvent = (eventId) => {
        setEventsMap(prevMap => {
            const newMap = new Map(prevMap);
            for (const [dayId, events] of newMap.entries()) {
                const filteredEvents = events.filter(event => event.id !== eventId);
                if (filteredEvents.length > 0) {
                    newMap.set(dayId, filteredEvents);
                } else {
                    newMap.delete(dayId);
                }
            }
            return newMap;
        });
    };

    return (
        <div className="p-8">
            <Header title="Calendrier" />
            <CalendarNav
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
            <CalendarGrid
                currentDate={currentDate}
                eventsMap={eventsMap}
            />
        </div>
    );
}