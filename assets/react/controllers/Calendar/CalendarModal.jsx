import React, {useState, useRef, useEffect, useCallback} from 'react';
import ReactDOM from "react-dom";
import FormView from "./Modal/View/FormView";
import DayView from "./Modal/View/DayView";
import SummaryView from "./Modal/View/SummaryView";
import DeleteView from "./Modal/View/DeleteView";

// Modes disponibles pour la modale
const MODAL_VIEWS = {
    SEE_MORE: 'see-more',
    SUMMARY: 'summary',
    EDIT: 'edit',
    CREATE: 'create',
    DELETE: 'delete'
};

export default function CalendarModal ({ isOpen, closeModal, selectedEvent, setSelectedEvent, handleUpdateEvent, handleRemoveEvent, eventsMap }) {

    // State local pour gérer le mode de la modale
    const [modalView, setModalView] = useState(null);

    // Refs pour les dates pickers
    const startDatepickerVisibleRef = useRef(false);
    const endDatepickerVisibleRef = useRef(false);

    // Refs pour l'animation
    const modalRef = useRef(null);
    const modalWrapperRef = useRef(null);

    useEffect(() => {
        if (!selectedEvent) {
            // Pas d'événement sélectionné = mode création
            setModalView(MODAL_VIEWS.CREATE);
        } else if (selectedEvent.type === 'day-view') {
            // Voir tous les événements d'un jour
            setModalView(MODAL_VIEWS.SEE_MORE);
        } else {
            // Événement spécifique sélectionné = afficher le résumé
            setModalView(MODAL_VIEWS.SUMMARY);
        }
    }, [selectedEvent]);

    // Animation d'ouverture
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

    // Animation de fermeture
    const handleCloseModal = () => {
        const modal = modalRef.current
        const modalWrapper = modalWrapperRef.current

        modal.classList.remove('opacity-100')
        modal.classList.add('opacity-0')

        modalWrapper.classList.remove('translate-y-0')
        modalWrapper.classList.add('translate-y-[-50px]')

        setTimeout(() => closeModal(), 300);
    }

    // Close modal when user click outside
    const onClick = useCallback((e) => {
        // Empêcher la propagation de l'événement si l'utilisateur clique sur un élément avec la classe ".calendar-btn"
        if (!e.target.closest('.calendar-btn')) {
            startDatepickerVisibleRef.current = false;
            endDatepickerVisibleRef.current = false;
        }
        e.stopPropagation();
    }, []);

    if (!isOpen) {
        return null;
    }

    /**
     * Passer en mode édition depuis le résumé
     */
    const showEdit = () => {
        setModalView(MODAL_VIEWS.EDIT)
    }

    const showSummary = (event) => {
        setSelectedEvent(event)
        setModalView(MODAL_VIEWS.SUMMARY)
    }

    const showDelete = () => {
        setModalView(MODAL_VIEWS.DELETE)
    }

    const renderModalView = () => {
        switch (modalView) {
            case MODAL_VIEWS.EDIT:
            case MODAL_VIEWS.CREATE:
                return (
                    <FormView
                        handleCloseModal={handleCloseModal}
                        event={modalView === MODAL_VIEWS.EDIT ? selectedEvent : null}
                        handleUpdateEvent={handleUpdateEvent}
                        handleRemoveEvent={handleRemoveEvent}
                        startDatepickerVisibleRef={startDatepickerVisibleRef}
                        endDatepickerVisibleRef={endDatepickerVisibleRef}
                        showSummary={showSummary}
                        showDelete={showDelete}
                    />
                );
            case MODAL_VIEWS.SUMMARY:
                return (
                    <SummaryView
                        event={selectedEvent}
                        handleCloseModal={handleCloseModal}
                        showEdit={showEdit}
                        showDelete={showDelete}
                    />
                );
            case MODAL_VIEWS.SEE_MORE:
                const date = selectedEvent.date;
                return (
                    <DayView
                        date={date}
                        eventsMap={eventsMap}
                        showSummary={showSummary}
                        handleCloseModal={handleCloseModal}
                    />
                );
            case MODAL_VIEWS.DELETE:
                return (
                    <DeleteView
                        event={selectedEvent}
                        showSummary={showSummary}
                        handleRemoveEvent={handleRemoveEvent}
                        handleCloseModal={handleCloseModal}
                    />
                );
            default:
                return null;
        }
    };

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
                {renderModalView()}
            </div>
        </div>,
        document.body
    );
}