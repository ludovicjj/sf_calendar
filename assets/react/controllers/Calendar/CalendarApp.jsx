import React, { useState, useCallback } from 'react';
import Header from '../Header';
import CalendarNav from "./CalendarNav";
import CalendarGrid from "./CalendarGrid";
import {getDayId, getDaysBetween} from "../../utils/dateUtils";
import {parseEvent} from "../../utils/eventUtils";
import PropTypes from "prop-types";
import CalendarModal from "./CalendarModal";
import {ToastContextProvider} from "../ToastContext";

export default function CalendarApp ({ initialEvents }) {
    // State current Date
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State selected event
    const [selectedEvent, setSelectedEvent] = useState(null);

    // State Events list
    const [eventsMap, setEventsMap] = useState(() => {
        const parsedEvents = parseEvent(initialEvents);
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
        setEventsMap(prevMap => {
            const newMap = new Map(prevMap);

            const days = getDaysBetween(event.start, event.end);
            for (const day of days) {
                const key = getDayId(day)
                if (!newMap.has(key)) {
                    newMap.set(key, []);
                }
                newMap.get(key).push(event);
            }

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

    // Fonction pour ouvrir la modale
    const openModal = (event = null) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedEvent(null)
        setIsModalOpen(false)
    }

    return (
        <div className="p-8">
            <Header title="Calendrier" />
            <ToastContextProvider>
                <CalendarNav
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    setIsModalOpen={setIsModalOpen}
                />
                <CalendarGrid
                    currentDate={currentDate}
                    eventsMap={eventsMap}
                    openModal={openModal}
                />
                <CalendarModal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    selectedEvent={selectedEvent}
                    addEvent={addEvent}
                />
            </ToastContextProvider>
        </div>
    );
}

CalendarApp.propTypes = {
    initialEvents: PropTypes.instanceOf(Array).isRequired,
};