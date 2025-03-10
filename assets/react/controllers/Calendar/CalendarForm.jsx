import React, {useMemo, useState} from "react";
import {formatDateToInputDateString, formatInputDateStringToDate} from "../../utils/dateUtils";
import CalendarDatepicker from "./CalendarDatepicker";
import {isFullDay} from "../../utils/eventUtils";
import { v4 as uuidv4 } from 'uuid';

export default function CalendarForm (
    {
        selectedEvent,
        addEvent,
        startDatepickerVisibleRef,
        endDatepickerVisibleRef
    }
) {

    // State
    const [errors, setErrors] = useState({
        title: { isValid: false, isUpdated: false },
        start: { isValid: false, isUpdated: false },
        end: { isValid: false, isUpdated: false },
    });
    const [formData, setFormData] = useState({
        title: selectedEvent?.title || "",
        description: selectedEvent?.description || "",
        color: selectedEvent?.color || "blue",
        start: formatDateToInputDateString(selectedEvent?.start) || "",
        end: formatDateToInputDateString(selectedEvent?.end) || "",
    })

    const colors = useMemo(() => {
        return [
            { background: '#3788d8', value: 'blue' },
            { background: '#74b057', value: 'green' },
            { background: '#ff5858', value: 'red' },
            { background: '#fcd34d', value: 'yellow' },
            { background: '#9ca3af', value: 'gray' },
        ]
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        let updatedValue = value
        let isValid = value.trim() !== ""

        if (['start', 'end'].includes(name)) {
            const result = validateAndFormatDate(value)
            updatedValue = result.formattedValue
            isValid = result.isValid
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));

        if (name in errors) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: {isValid, isUpdated: true}
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

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
                const data = await response.json();
                console.log(data.event)
                addEvent(event);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement :', error);
        }
    }

    const validateAndFormatDate = (inputValue) => {
        // Seuls les chiffres sont autorisés
        let value = inputValue.replace(/[^0-9]/g, "");

        let day = value.slice(0, 2);
        let month = value.slice(2, 4);
        let year = value.slice(4, 8);
        let hours = value.slice(8, 10);
        let minutes = value.slice(10, 12);

        if (day > 31) day = "31";
        if (month > 12) month = "12";
        if (hours > 23) hours = "23";
        if (minutes > 59) minutes = "59";

        // Build formatted value
        let formattedValue = "";
        if (day) formattedValue += day;
        if (month) formattedValue += `-${month}`;
        if (year) formattedValue += `-${year}`;
        if (hours) formattedValue += ` ${hours}`;
        if (minutes) formattedValue += `:${minutes}`;

        // Vérifier si la date est valide
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        const isValid =
            date?.getDate() === parseInt(day, 10) &&
            date?.getMonth() + 1 === parseInt(month, 10) &&
            date?.getFullYear() === parseInt(year, 10);

        return {formattedValue, isValid};
    };

    const validateForm = () => {
        const hasErrors = Object.entries(errors).some(([_, value]) => !value.isValid);

        if (hasErrors) {
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                for (const key in updatedErrors) {
                    if (!updatedErrors[key].isValid) {
                        updatedErrors[key].isUpdated = true;
                    }
                }
                return updatedErrors;
            });

            return false;
        }

        return true
    }

    const toggleDatepicker = (currentRef, otherRef) => {
        if (otherRef.current) {
            otherRef.current = false; // Ferme l'autre datepicker si ouvert
        }

        currentRef.current = !currentRef.current; // Toggle la visibilité
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700" htmlFor="title">Nom de l'événement</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                />
                {errors.title.isUpdated && !errors.title.isValid && (
                    <p className="mt-1 text-red-500 text-sm">Cette valeur ne peux pas être vide.</p>
                )}
            </div>

            <CalendarDatepicker
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

            <CalendarDatepicker
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

            <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Couleur de l'événement</span>
                <div className="flex gap-4 mt-1">
                    {colors.map((color) => (
                        <label key={color.value} className="flex items-center color-item">
                            <input
                                type="radio"
                                name="color"
                                value={color.value}
                                className="p-2 rounded-full hidden"
                                checked={formData.color === color.value}
                                onChange={handleChange}
                            />
                            <span
                                className={`block w-[25px] h-[25px] rounded-full border-2 cursor-pointer ${formData.color === color.value ? "border-black" : "border-gray-400"}`}
                                style={{ backgroundColor: color.background }}
                            ></span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700" htmlFor="description">Commentaire</label>
                <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500 h-36"
                />
            </div>

            <button type="submit"
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                    formNoValidate
            >
                Enregistrer
            </button>
        </form>
    )
}