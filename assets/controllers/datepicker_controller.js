import { Controller } from '@hotwired/stimulus';
import AirDatepicker from 'air-datepicker'
import '../styles/air-datepicker.css';
import localeFr from '../js/locales/fr.js';

export default class extends Controller {

    static targets = [ "start", "end", "checkbox" ]

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

        if (!startDate || !endDate) {
            return;
        }

        // Comparer les jours
        this.checkboxTarget.checked = startDate.toDateString() !== endDate.toDateString();
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