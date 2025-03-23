import React, {useMemo} from "react";
import {formatDateToInputDateString, formatInputDateStringToDate} from "../../utils/dateUtils";
import {isFullDay} from "../../utils/eventUtils";
import {useToasts} from "../ToastContext";
import EventDatepickerField from "./Form/EventDatepickerField";
import ColorField from "./Form/ColorField"
import TextareaField from "./Form/TextareaField"
import InputField from "./Form/InputField"
import useCalendarForm from "./Hook/useCalendarForm";
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {Function} handleCloseModal - Fonction de fermeture de la modale
 * @param {Object|null} selectedEvent - événement en cours de modification
 * @param {Function} pushEvent - Fonction de creation/modification d'un événement
 * @param {Function} removeEvent - Fonction de suppression d'un événement
 * @param startDatepickerVisibleRef - Reference
 * @param endDatepickerVisibleRef - Reference
 * @return {JSX.Element}
 */
export default function CalendarForm (
    {
        handleCloseModal,
        selectedEvent,
        pushEvent,
        removeEvent,
        startDatepickerVisibleRef,
        endDatepickerVisibleRef
    }
) {

    const { pushToast } = useToasts();

    const colors = useMemo(() => {
        return [
            { background: '#3788d8', value: 'blue' },
            { background: '#74b057', value: 'green' },
            { background: '#ff5858', value: 'red' },
            { background: '#fcd34d', value: 'yellow' },
            { background: '#9ca3af', value: 'gray' },
        ]
    }, [])

    const initialData = {
        title: selectedEvent?.title || "",
        description: selectedEvent?.description || "",
        color: selectedEvent?.color || "blue",
        start: formatDateToInputDateString(selectedEvent?.start) || "",
        end: formatDateToInputDateString(selectedEvent?.end) || "",
    }

    const getInitialErrors = (data) => {
        const errors = {
            title: {
                isValid: false,
                isUpdated: false,
                message: "Cette valeur ne peut pas être vide."
            },
            start: {
                isValid: false,
                isUpdated: false,
                message: "Date invalide"
            },
            end: {
                isValid: false,
                isUpdated: false,
                message: "Date invalide"
            }
        };

        if (data.title) errors.title.isValid = true;
        if (data.start) errors.start.isValid = true;
        if (data.end) errors.end.isValid = true;

        return errors;
    };

    const initialErrors = getInitialErrors(initialData);

    const {
        formData,
        errors,
        handleChange,
        validateForm,
        setFormData,
        setErrors
    } = useCalendarForm({initialData, initialErrors})

    const addToast = (title, content, type = "success", duration = 5000) => {
        pushToast({
            title: title,
            content: content,
            type: type,
            duration: duration
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm(formData);

        if (!isValid) {
            return;
        }

        const event = {
            token: selectedEvent?.token || uuidv4(),
            title: formData.title,
            description: formData.description,
            color: formData.color,
            start: formatInputDateStringToDate(formData.start),
            end: formatInputDateStringToDate(formData.end),
            fullDay: isFullDay(formData.start, formData.end)
        };

        try {
            const url = selectedEvent ? `/api/event/${selectedEvent.token}` : '/api/event';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                handleCloseModal()

                if (selectedEvent) {
                    addToast("Succès", "L'événement a été modifié avec succès.");
                    pushEvent(event, selectedEvent);
                } else {
                    addToast("Succès", "L'événement a été créé avec succès.");
                    pushEvent(event);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement :', error);
        }
    }

    const handleDelete = async () => {
        if (!selectedEvent) {
            addToast("Erreur", "Une erreur est survenu.", 'error');
            return;
        }

        try {
            const url = `/api/event/${selectedEvent.token}`

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                handleCloseModal()
                removeEvent(selectedEvent)
                addToast("Succès", "L'événement a été supprimé avec succès.");
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement :', error);
        }
    }

    const toggleDatepicker = (currentRef, otherRef) => {
        if (otherRef.current) {
            otherRef.current = false;
        }

        currentRef.current = !currentRef.current;
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Champ pour le titre */}
            <InputField
                label="Nom de l'événement"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
            />

            {/* Champ pour la date de debut */}
            <EventDatepickerField
                name="start"
                value={formData.start}
                label="Date de début"
                error={errors.start}
                setFormData={setFormData}
                setErrors={setErrors}
                onChange={handleChange}
                isDatepickerVisibleRef={startDatepickerVisibleRef}
                toggleDatepicker={() => toggleDatepicker(startDatepickerVisibleRef, endDatepickerVisibleRef)}
            />

            {/* Champ pour la date de fin */}
            <EventDatepickerField
                name="end"
                value={formData.end}
                label="Date de fin"
                error={errors.end}
                setFormData={setFormData}
                setErrors={setErrors}
                onChange={handleChange}
                isDatepickerVisibleRef={endDatepickerVisibleRef}
                toggleDatepicker={() => toggleDatepicker(endDatepickerVisibleRef, startDatepickerVisibleRef)}
            />

            {/* Champ pour la couleur */}
            <ColorField
                label="Couleur de l'événement"
                colors={colors}
                value={formData.color}
                onChange={handleChange}
            />

            {/* Champ pour la description */}
            <TextareaField
                label="Commentaire"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />

            <div className="flex justify-between">
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                        formNoValidate
                >
                    Enregistrer
                </button>

                {selectedEvent && (<button
                    type="button"
                    onClick={handleDelete}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                >
                    Supprimer
                </button>)}
            </div>
        </form>
    )
}
