import { Controller } from '@hotwired/stimulus';
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

    /**
     *
     * @param {{name: string, start: Date, end: Date, fullDay: boolean, type: string, description?: string}} calendarEvent
     */
    update(calendarEvent) {
        this.hydrateForm(calendarEvent)
        this.open()
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

    stopPropagation(e) {
        e.stopPropagation()
    }

    /**
     * @param {{name: string, start: Date, end: Date, fullDay: boolean, type: string, description?: string}} calendarEvent
     */
    hydrateForm(calendarEvent) {
        this.formTarget.querySelector('[name="name"]').value = calendarEvent.name;
        this.formTarget.querySelector('[name="startAt"]').value = this.formatDateForInput(calendarEvent.start);
        this.formTarget.querySelector('[name="endAt"]').value = this.formatDateForInput(calendarEvent.end);
        this.formTarget.querySelector('[name="fullDay"]').checked = calendarEvent.fullDay;
        this.formTarget.querySelector('[name="type"]').value = calendarEvent.type;

        if (calendarEvent.description) {
            this.formTarget.querySelector('[name="description"]').value = calendarEvent.description;
        } else {
            this.formTarget.querySelector('[name="description"]').value = ''
        }
    }

    /**
     * Formate une date au format "dd-mm-yyyy HH:mm"
     */
    formatDateForInput(date) {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() commence à 0
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
}