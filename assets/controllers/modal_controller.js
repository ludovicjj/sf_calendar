import { Controller } from '@hotwired/stimulus';
import AirDatepicker from 'air-datepicker'
import '../styles/air-datepicker.css';
import localeFr from '../js/locales/fr.js';
import '../styles/modal.css';

export default class extends Controller {
    static targets = [ "wrapper", "start", "end", "checkbox", "form" ]

    async connect() {
        // state
        this.isOpen = false;

        // event
        this.element.addEventListener('click', this.close.bind(this))
        if (this.hasWrapperTarget) {
            this.wrapperTarget.addEventListener('click', this.stopPropagation)
        }
    }

    open() {
        this.isOpen = true;
        document.body.classList.add('modal-open')
        this.element.style.display = null
        this.element.removeAttribute('aria-hidden')
        this.element.setAttribute('aria-modal', 'true')
    }

    close() {
        if (!this.isOpen) return;

        document.body.classList.remove('modal-open')

        setTimeout(() => {
            this.element.style.display = "none"
            this.isOpen = false;
        }, 500)


        this.element.setAttribute('aria-hidden', 'true')
        this.element.removeAttribute('aria-modal')
    }

    async onSubmit(e) {
        e.preventDefault()

        if (!this.hasFormTarget) {
            return
        }

        const formData = new FormData(this.formTarget)
        const jsonData = this.serializeFormData(formData)

        const response = await fetch(this.formTarget.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(jsonData),
        })

        const data = await response.json()
        console.log(data)
    }

    serializeFormData(formData) {
        let object = {};
        formData.forEach((value, key) => {
            if (key.includes("At")) {
                value = this.formatDate(value); // Transforme les dates
            }
            object[key] = value;
        });

        return object;
    }

    formatDate(dateString) {
        if (!dateString) return null;
        const [day, month, year, hours, minutes] = dateString.match(/\d+/g);
        return `${year}-${month}-${day}T${hours}:${minutes}:00`; // Format ISO 8601
    }

    stopPropagation(e) {
        e.stopPropagation()
    }
}