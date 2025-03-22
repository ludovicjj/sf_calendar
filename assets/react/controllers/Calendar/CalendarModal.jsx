import React, {useEffect, useRef} from 'react';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import '../../../styles/air-datepicker.css'
import CalendarForm from "./CalendarForm";

export default function CalendarModal ({ isOpen, closeModal, selectedEvent, addEvent }) {
    // Ref
    const startDatepickerVisibleRef = useRef(false);
    const endDatepickerVisibleRef = useRef(false);
    const modalRef = useRef(null);
    const modalWrapperRef = useRef(null);

    useEffect(() => {
        let timer = null
        if (isOpen) {
            // animation d'ouverture de la modale
            const modal = modalRef.current
            const modalWrapper = modalWrapperRef.current

            modal.classList.add('opacity-0')
            modalWrapper.classList.add('translate-y-[-50px]')

            timer = setTimeout(() => {
                modal.classList.remove('opacity-0')
                modal.classList.add('opacity-100')

                modalWrapper.classList.remove('translate-y-[-50px]')
                modalWrapper.classList.add('translate-y-0')
            }, 300);

            return () => {
                clearTimeout(timer)
            }
        }
    }, [isOpen])

    /**
     * Ferme la modale apres avoir joué l'animation de fermeture
     */
    const handleCloseModal = () => {
        const modal = modalRef.current
        const modalWrapper = modalWrapperRef.current

        modal.classList.remove('opacity-100')
        modal.classList.add('opacity-0')

        modalWrapper.classList.remove('translate-y-0')
        modalWrapper.classList.add('translate-y-[-50px]')

        setTimeout(() => closeModal(), 300);
    }

    const onClick = (e) => {
        if(!e.target.closest('.calendar-btn')) {
            startDatepickerVisibleRef.current = !startDatepickerVisibleRef.current;
            endDatepickerVisibleRef.current = !endDatepickerVisibleRef.current;
        }
        e.stopPropagation()
    }

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50"
            onClick={handleCloseModal}
            ref={modalRef}
        >
            <div
                className="bg-white w-[600px] max-w-[calc(100vw-20px)] max-h-[calc(100vh-20px)] p-6 rounded-lg transition-transform duration-300"
                onClick={onClick}
                ref={modalWrapperRef}
            >
                <div className="flex justify-between mb-3">
                    <h2 className="text-md font-medium text-gray-800">
                        Ajouter un événement
                    </h2>

                    <button
                        type="button"
                        onClick={handleCloseModal}
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <CalendarForm
                        handleCloseModal={handleCloseModal}
                        selectedEvent={selectedEvent}
                        addEvent={addEvent}
                        startDatepickerVisibleRef={startDatepickerVisibleRef}
                        endDatepickerVisibleRef={endDatepickerVisibleRef}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}