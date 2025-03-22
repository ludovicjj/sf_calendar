import React, {useMemo, useState} from "react";
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
 * @param {Function} addEvent - Fonction de fermeture de la modale
 * @param startDatepickerVisibleRef - Reference
 * @param endDatepickerVisibleRef - Reference
 * @return {JSX.Element}
 * @constructor
 */
export default function CalendarForm (
    {
        handleCloseModal,
        selectedEvent,
        addEvent,
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

    const initialErrors =  {
        title: {
            isValid: false,
            isUpdated: false,
            message: "Cette valeur ne peux pas être vide."
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
        },
    }

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
            const response = await fetch('/api/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (response.ok) {
                handleCloseModal()
                addToast("Succès", "L'événement a été créé avec success.")
                addEvent(event)
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

            <button type="submit"
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                    formNoValidate
            >
                Enregistrer
            </button>
        </form>
    )
}

// // State
// const [errors, setErrors] = useState({
//     title: { isValid: false, isUpdated: false, message: "Cette valeur ne peux pas être vide." },
//     start: { isValid: false, isUpdated: false, message: "Date invalide" },
//     end: { isValid: false, isUpdated: false, message: "Date invalide" },
//     dateRange: { isValid: true, isUpdated: false, message: "La date de début doit être antérieure à la date de fin" }
// });
//
// const [formData, setFormData] = useState({
//     title: selectedEvent?.title || "",
//     description: selectedEvent?.description || "",
//     color: selectedEvent?.color || "blue",
//     start: formatDateToInputDateString(selectedEvent?.start) || "",
//     end: formatDateToInputDateString(selectedEvent?.end) || "",
// })

// const validateAndFormatDate = (inputValue) => {
//     // Seuls les chiffres sont autorisés
//     let value = inputValue.replace(/[^0-9]/g, "");
//
//     let day = value.slice(0, 2);
//     let month = value.slice(2, 4);
//     let year = value.slice(4, 8);
//     let hours = value.slice(8, 10);
//     let minutes = value.slice(10, 12);
//
//     if (day > 31) day = "31";
//     if (month > 12) month = "12";
//     if (hours > 23) hours = "23";
//     if (minutes > 59) minutes = "59";
//
//     // Build formatted value
//     let formattedValue = "";
//     if (day) formattedValue += day;
//     if (month) formattedValue += `-${month}`;
//     if (year) formattedValue += `-${year}`;
//     if (hours) formattedValue += ` ${hours}`;
//     if (minutes) formattedValue += `:${minutes}`;
//
//     // Vérifier si la date est valide
//     const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
//     const isValid =
//         date?.getDate() === parseInt(day, 10) &&
//         date?.getMonth() + 1 === parseInt(month, 10) &&
//         date?.getFullYear() === parseInt(year, 10);
//
//     return {formattedValue, isValid};
// };

// const validateForm = () => {
//     const isDateRangeValid = isStartBeforeEnd(formData.start, formData.end);
//     const hasErrors = Object.entries(errors)
//         .some(([_, value]) => !value.isValid);
//
//     if (hasErrors) {
//         // update state
//         setErrors((prevErrors) => {
//             const updatedErrors = { ...prevErrors }
//
//             for (const key in updatedErrors) {
//                 if (!updatedErrors[key].isValid) {
//                     updatedErrors[key].isUpdated = true;
//                 }
//             }
//             return updatedErrors;
//         });
//
//         return false;
//     }
//
//     return true
// }

// const handleChange = (e) => {
//     const { name, value } = e.target
//     let updatedValue = value
//     let isValid = value.trim() !== ""
//
//     if (['start', 'end'].includes(name)) {
//         const result = validateAndFormatDate(value)
//         updatedValue = result.formattedValue
//         isValid = result.isValid
//     }
//
//     // Mise à jour du formData avec la nouvelle valeur
//     const updatedFormData = {
//         ...formData,
//         [name]: updatedValue,
//     };
//     setFormData(updatedFormData);
//
//     if (name in errors) {
//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: {isValid, isUpdated: true}
//         }));
//     }
// };