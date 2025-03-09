import React, {useEffect, useRef} from "react";
import AirDatepicker from "air-datepicker";
import {localeFr} from "../../utils/localUtils";
import {formatDateToInputDateString, formatInputDateStringToDate} from "../../utils/dateUtils";

export default function CalendarDatepicker(
    {
        name,
        value,
        label,
        error,
        setFormData,
        setErrors,
        onChange,
        isDatepickerVisibleRef,
        toggleDatepicker
    }) {

    const datepickerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const date = formatInputDateStringToDate(value)
        datepickerRef.current = new AirDatepicker(inputRef.current, {
            selectedDates: date ? [date] : [],
            showEvent: 'none',
            timepicker: true,
            locale: localeFr,
            onSelect({ date }) {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: formatDateToInputDateString(date)
                }));
                setErrors((prevState) => ({
                    ...prevState,
                    [name]: {isValid: true, isUpdated: true}
                }));
            }
        });

        return () => {
            if (datepickerRef.current) {
                datepickerRef.current.destroy();
            }
        }
    }, [])

    const handleShowDatePicker = () => {
        try{
            if (isDatepickerVisibleRef) {
                inputRef.current.blur()
                datepickerRef.current.hide()
            } else {
                inputRef.current.focus()
                datepickerRef.current.show()
            }
        } catch (e) {
            inputRef.current.focus()
            datepickerRef.current.show()
        }

        toggleDatepicker()
    };

    return (
        <div className="mb-4">
            <label className="text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
            <div className="flex gap-4">
                <input
                    type="text"
                    name={name}
                    id={name}
                    placeholder="DD-MM-YYYY hh:mm"
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    className="mt-1 p-2 w-full border rounded focus:outline-none focus:border-blue-500"
                />
                <button
                    type="button"
                    className="mt-1 bg-blue-500 text-white rounded min-w-[50px] flex justify-center items-center calendar-btn"
                    onClick={handleShowDatePicker}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                        <path fill="currentColor" fillRule="evenodd" d="M5.25 5.497a.75.75 0 0 1-.75-.75V4A1.5 1.5 0 0 0 3 5.5v1h10v-1A1.5 1.5 0 0 0 11.5 4v.75a.75.75 0 0 1-1.5 0V4H6v.747a.75.75 0 0 1-.75.75M10 2.5H6v-.752a.75.75 0 1 0-1.5 0V2.5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0zM3 8v3.5A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V8z" clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
            {error.isUpdated && !error.isValid && (
                <p className="mt-1 text-red-500 text-sm">Date invalide</p>
            )}
        </div>
    );
}