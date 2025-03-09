import React, {useEffect, useMemo, useState, useRef} from 'react';
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {formatDateForInput} from "../../utils/dateUtils";
import {localeFr} from "../../utils/localUtils";
import '../../../styles/air-datepicker.css'
import AirDatepicker from 'air-datepicker';

export default function CalendarModal ({ isOpen, closeModal, selectedEvent, addEvent }) {
    // State
    const [errors, setErrors] = useState({
        title: { isValid: false, isUpdated: false },
        start: { isValid: false, isUpdated: false },
        end: { isValid: false, isUpdated: false },
    });
    const [formData, setFormData] = useState({})
    const [isStartDatepickerVisible, setIsStartDatepickerVisible] = useState(false);
    const [isEndDatepickerVisible, setIsEndDatepickerVisible] = useState(false);

    // Ref
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const startDatepickerRef = useRef(null);
    const endDatepickerRef = useRef(null);
    const modalRef = useRef(null);
    const modalWrapperRef = useRef(null);

    useEffect(() => {
        setFormData({
            title: selectedEvent?.title || "",
            description: selectedEvent?.description || "",
            color: selectedEvent?.color || "blue",
            start: formatDateForInput(selectedEvent?.start) || "",
            end: formatDateForInput(selectedEvent?.end) || "",
        });
        setErrors({
            title: {isValid: !!selectedEvent?.title, isUpdated: false},
            start: {isValid: !!selectedEvent?.start, isUpdated: false},
            end: {isValid: !!selectedEvent?.end, isUpdated: false}
        })

    }, [selectedEvent])

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


            startDatepickerRef.current = new AirDatepicker(startDateRef.current, {
                selectedDates: formData.start ? [formData.start] : [],
                showEvent: 'none',
                timepicker: true,
                locale: localeFr,
                onSelect({ date }) {
                    setFormData((prevData) => ({
                        ...prevData,
                        start: formatDateForInput(date)
                    }));
                    setErrors((prevState) => ({
                        ...prevState,
                        start: {isValid: true, isUpdated: true}
                    }));
                }
            });

            endDatepickerRef.current = new AirDatepicker(endDateRef.current, {
                selectedDates: formData.end ? [formData.end] : [],
                showEvent: 'none',
                timepicker: true,
                locale: localeFr,
                onSelect({ date }) {
                    setFormData((prevData) => ({
                        ...prevData,
                        end: formatDateForInput(date)
                    }));
                    setErrors((prevState) => ({
                        ...prevState,
                        end: {isValid: true, isUpdated: true}
                    }));
                }
            });

            return () => {
                clearTimeout(timer)
                if (startDatepickerRef.current) {
                    startDatepickerRef.current.destroy();
                }
                if (endDatepickerRef.current) {
                    endDatepickerRef.current.destroy();
                }
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (startDatepickerRef.current && formData.start) {
            const start = convertToAirDatepickerFormat(formData.start)
            startDatepickerRef.current.update({
                selectedDates: start ? [start] : [],
            });
        }
        if (endDatepickerRef.current && formData.end) {
            const end = convertToAirDatepickerFormat(formData.end)
            endDatepickerRef.current.update({
                selectedDates: end ? [end] : [],
            });
        }
    }, [formData.start, formData.end])

    /**
     * Ferme la modale apres avoir joué l'animation de fermeture
     */
    const onClose = () => {
        const modal = modalRef.current
        const modalWrapper = modalWrapperRef.current

        modal.classList.remove('opacity-100')
        modal.classList.add('opacity-0')

        modalWrapper.classList.remove('translate-y-0')
        modalWrapper.classList.add('translate-y-[-50px]')

        setTimeout(() => closeModal(), 300);
    }

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

    const convertToAirDatepickerFormat = (dateString) => {
        if (!dateString) {
            return null
        }

        // Convertit "DD-MM-YYYY H:i" en "YYYY-MM-DD H:i"
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");
        const [hours, minutes] = timePart ? timePart.split(":") : [];

        if (!day || !month || !year) {
            return null
        }

        if (!hours || !minutes) {
            return null;
        }

        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

        const isDateValid =
            date.getDate() === parseInt(day, 10) &&
            date.getMonth() + 1 === parseInt(month, 10) &&
            date.getFullYear() === parseInt(year, 10);

        // Vérifier si l'heure est valide
        const isTimeValid =
            parseInt(hours, 10) >= 0 && parseInt(hours, 10) < 24 &&
            parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) < 60;

        // Retourner null si la date ou l'heure est invalide
        if (!isDateValid || !isTimeValid) {
            return
        }

        return date;
    };

    const handleShowStartDatePicker = () => {
        try{
            if (isStartDatepickerVisible) {
                startDatepickerRef.current.hide();
                startDateRef.current.blur()
            } else {
                startDatepickerRef.current.show();
                startDateRef.current.focus()
            }
        } catch (e) {
            startDatepickerRef.current.show();
            startDateRef.current.focus()
        }

        setIsStartDatepickerVisible((prev) => !prev);
        setIsEndDatepickerVisible(false);
    };

    const handleShowEndDatePicker = () => {
        try{
            if (isEndDatepickerVisible) {
                endDateRef.current.blur()
                endDatepickerRef.current.hide();
            } else {
                endDateRef.current.focus()
                endDatepickerRef.current.show();
            }
        } catch (e) {
            endDateRef.current.focus()
            endDatepickerRef.current.show();
        }

        setIsEndDatepickerVisible((prev) => !prev);
        setIsStartDatepickerVisible(false);
    };

    const onClick = (e) => {
        if(!e.target.closest('.calendar-btn')) {
            setIsStartDatepickerVisible(false);
            setIsEndDatepickerVisible(false);
        }
        e.stopPropagation()
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const event = {
            id: selectedEvent?.id || 55, // Utilise l'ID existant ou génère un nouvel ID
            title: formData.title,
            description: formData.description,
            color: formData.color,
            start: convertToAirDatepickerFormat(formData.start),
            end: convertToAirDatepickerFormat(formData.end),
        };

        addEvent(event)
    }

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50"
            onClick={onClose}
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
                        onClick={onClose}
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5">
                            <path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
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

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="start">Date de début</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="start"
                                    id="start"
                                    placeholder="DD-MM-YYYY hh:mm"
                                    ref={startDateRef}
                                    value={formData.start}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    className="mt-1 bg-blue-500 text-white rounded min-w-[50px] flex justify-center items-center calendar-btn"
                                    onClick={handleShowStartDatePicker} // Affiche le datepicker
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                        <path fill="currentColor" fillRule="evenodd" d="M5.25 5.497a.75.75 0 0 1-.75-.75V4A1.5 1.5 0 0 0 3 5.5v1h10v-1A1.5 1.5 0 0 0 11.5 4v.75a.75.75 0 0 1-1.5 0V4H6v.747a.75.75 0 0 1-.75.75M10 2.5H6v-.752a.75.75 0 1 0-1.5 0V2.5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0zM3 8v3.5A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V8z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </div>
                            {errors.start.isUpdated && !errors.start.isValid && (
                                <p className="mt-1 text-red-500 text-sm">Date invalide</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700" htmlFor="end">Date de fin</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    name="end"
                                    id="end"
                                    placeholder="DD-MM-YYYY hh:mm"
                                    ref={endDateRef}
                                    value={formData.end}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    className="mt-1 bg-blue-500 text-white rounded min-w-[50px] flex justify-center items-center calendar-btn"
                                    onClick={handleShowEndDatePicker} // Affiche le datepicker
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                        <path fill="currentColor" fillRule="evenodd" d="M5.25 5.497a.75.75 0 0 1-.75-.75V4A1.5 1.5 0 0 0 3 5.5v1h10v-1A1.5 1.5 0 0 0 11.5 4v.75a.75.75 0 0 1-1.5 0V4H6v.747a.75.75 0 0 1-.75.75M10 2.5H6v-.752a.75.75 0 1 0-1.5 0V2.5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0zM3 8v3.5A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V8z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                            </div>
                            {errors.end.isUpdated && !errors.end.isValid && (
                                <p className="mt-1 text-red-500 text-sm">Date invalide</p>
                            )}
                        </div>

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
                </div>
            </div>
        </div>,
        document.body
    );
}

CalendarModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    selectedEvent: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        start: PropTypes.instanceOf(Date).isRequired,
        end: PropTypes.instanceOf(Date),
        fullDay: PropTypes.bool,
        color: PropTypes.string,
    }),
};