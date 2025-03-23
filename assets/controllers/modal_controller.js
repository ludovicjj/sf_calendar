import { Controller } from '@hotwired/stimulus';
import '../styles/modal.css';
import {fillForm, resetForm} from "../js/functions/form.js";

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

    /**
     * Ouvre la modale et hydrate le formulaire si un événement est fourni
     *
     * @param {{name: string, start: Date, end: Date, fullDay: boolean, type: string, description?: string}|null} calendarEvent
     */
    open(calendarEvent = null) {
        if (calendarEvent) {
            fillForm(this.formTarget, calendarEvent)
        } else {
            resetForm(this.formTarget)
        }



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

    stopPropagation(e) {
        e.stopPropagation()
    }
}