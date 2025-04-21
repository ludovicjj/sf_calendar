import React, {useMemo} from "react";
import {formatDateToInputDateString, formatInputDateStringToDate} from "../../../../utils/dateUtils";
import {isFullDay} from "../../../../utils/eventUtils";
import {useToasts} from "../../../ToastContext";
import EventDatepickerField from "../../Form/EventDatepickerField";
import ColorField from "../../Form/ColorField"
import TextareaField from "../../Form/TextareaField"
import InputField from "../../Form/InputField"
import useCalendarForm from "../../Hook/useCalendarForm";
import { v4 as uuidv4 } from 'uuid';
import FormHeader from "../Header/FormHeader";
import '../../../../../styles/air-datepicker.css'

/**
 *
 * @param {Function} handleCloseModal - Fonction de fermeture de la modale
 * @param {Object|null} event - événement en cours de modification
 * @param {Function} handleUpdateEvent - Fonction de creation/modification d'un événement
 * @param startDatepickerVisibleRef - Reference
 * @param endDatepickerVisibleRef - Reference
 * @param showSummary - Function de retour à la vue SUMMARY dans la modale
 * @param showDelete - Function de retour à la vue SUMMARY dans la modale
 * @return {JSX.Element}
 */
export default function FormView (
    {
        handleCloseModal,
        event,
        handleUpdateEvent,
        startDatepickerVisibleRef,
        endDatepickerVisibleRef,
        showSummary,
        showDelete
    }
) {

    const { pushToast } = useToasts();

    const colors = useMemo(() => {
        return [
            { class: 'bg-event-blue', value: 'blue' },
            { class: 'bg-event-green', value: 'green' },
            { class: 'bg-event-red', value: 'red' },
            { class: 'bg-event-yellow', value: 'yellow' },
            { class: 'bg-event-gray', value: 'gray' },
        ]
    }, [])

    const initialData = {
        title: event?.title || "",
        description: event?.description || "",
        color: event?.color || "blue",
        start: formatDateToInputDateString(event?.start) || "",
        end: formatDateToInputDateString(event?.end) || "",
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

        const newEvent = {
            token: event?.token || uuidv4(),
            title: formData.title,
            description: formData.description,
            color: formData.color,
            start: formatInputDateStringToDate(formData.start),
            end: formatInputDateStringToDate(formData.end),
            fullDay: isFullDay(formData.start, formData.end)
        };

        try {
            const url = event ? `/api/event/${event.token}` : '/api/event';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            if (response.ok) {
                handleCloseModal()

                if (event) {
                    addToast("Succès", "L'événement a été modifié avec succès.");
                    handleUpdateEvent(newEvent, event);
                } else {
                    addToast("Succès", "L'événement a été créé avec succès.");
                    handleUpdateEvent(newEvent);
                }
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
        <div>
            <FormHeader
                event={event}
                handleCloseModal={handleCloseModal}
                showSummary={showSummary}
                showDelete={showDelete}
            />
            <div className="modal-body">
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
                                className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded"
                                formNoValidate
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
