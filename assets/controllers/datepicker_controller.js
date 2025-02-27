import { Controller } from '@hotwired/stimulus';
import AirDatepicker from 'air-datepicker'
import '../styles/air-datepicker.css';
import {localeFr} from "../react/utils/localUtils";

export default class extends Controller {

    static targets = [ "start", "end", "checkbox", "submit" ]

    async connect() {
        if (this.hasStartTarget) {
            new AirDatepicker(this.startTarget, {
                locale: localeFr,
                timepicker: true,
                selectedDates: this.transformValueToDate(this.startTarget),
                onSelect: () => this.onChange(),
            });
        }


        if (this.hasEndTarget) {
            new AirDatepicker(this.endTarget, {
                locale: localeFr,
                timepicker: true,
                selectedDates: this.transformValueToDate(this.endTarget),
                onSelect: () => this.onChange(),
            });
        }
    }

    onChange() {
        const startDate = this.parseDate(this.startTarget.value);
        const endDate = this.parseDate(this.endTarget.value);
        this.disableSubmit(false)

        if (startDate) {
            this.startTarget.classList.remove("border-red-500", "focus:border-red-500");
        }

        if (endDate) {
            this.endTarget.classList.remove("border-red-500", "focus:border-red-500");
        }

        if (!startDate || !endDate) {
            return;
        }

        // Comparer les jours
        this.checkboxTarget.checked = startDate.toDateString() !== endDate.toDateString();
    }

    // validateDateInput(event) {
    //     const input = event.target;
    //     // Seuls les chiffres sont autorisés
    //     let value = input.value.replace(/[^0-9]/g, "");
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
    //     let formattedValue = "";
    //     if (day) formattedValue += day;
    //     if (month) formattedValue += `-${month}`;
    //     if (year) formattedValue += `-${year}`;
    //     if (hours) formattedValue += ` ${hours}`;
    //     if (minutes) formattedValue += `:${minutes}`;
    //
    //     input.value = formattedValue;
    //
    //     // Vérification que la date est valide (évite 31 février, etc.)
    //     const testDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
    //     if (
    //         testDate?.getDate() !== parseInt(day, 10) ||
    //         testDate?.getMonth() + 1 !== parseInt(month, 10) || // getMonth() commence à 0 (janvier = 0)
    //         testDate?.getFullYear() !== parseInt(year, 10)
    //     ) {
    //         input.classList.add("border-red-500", "focus:border-red-500");
    //         this.disableSubmit(true)
    //     } else {
    //         input.classList.remove("border-red-500", "focus:border-red-500");
    //         this.disableSubmit(false)
    //     }
    // }

    disableSubmit(isValid) {
        if (!this.hasSubmitTarget) {
            return
        }
        this.submitTarget.disabled = isValid;
        this.submitTarget.classList.toggle("opacity-50", isValid);
    }

    parseDate(dateString) {
        if (!dateString) return null;

        // Adapter le format selon le datepicker utilisé (dd/MM/yyyy HH:mm)
        const [datePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");

        return new Date(year, month - 1, day);
    }

    /**
     * @param {HTMLInputElement} field
     * @return {Date[]}
     */
    transformValueToDate(field) {
        const dateString = field.value

        if (dateString) {
            const [datePart, timePart] = dateString.split(" ");
            const [day, month, year] = datePart.split("-");
            const [hours, minutes] = timePart.split(":");

            const yearNum = parseInt(year, 10); // Convertir en nombre (base 10)
            const monthNum = parseInt(month, 10) - 1; // Le mois commence à 0 (janvier = 0)
            const dayNum = parseInt(day, 10);
            const hoursNum = parseInt(hours, 10);
            const minutesNum = parseInt(minutes, 10);

            return [new Date(yearNum, monthNum, dayNum, hoursNum, minutesNum)];
        }

        return []
    }
}