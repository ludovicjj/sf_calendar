import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = [ "form" ]

    static outlets = [ "calendar" ]

    async onCreate(e) {
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

        if (response.ok) {
            this.clearErrors()

            if (this.hasCalendarOutlet) {
                this.calendarOutlet.addEventAndRender(data.event);
            }
        } else {
            this.addError(data)
        }
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

    /**
     * Transforme la date donnée au format ISO 8601
     *
     * @param dateString
     * @return {string|null}
     */
    formatDate(dateString) {
        if (!dateString) {
            return null;
        }

        const [day, month, year, hours, minutes] = dateString.match(/\d+/g);

        return `${year}-${month}-${day}T${hours}:${minutes}:00`; // Format ISO 8601
    }

    /**
     * Ajoute des messages d'erreur aux champs du formulaire.
     *
     * @param {Object.<string, string[]>} errors Un objet contenant les erreurs,
     * où chaque clé est le nom d'un champ et la valeur est un tableau de messages d'erreur.
     */
    addError(errors) {
        this.clearErrors()

        for (const name in errors) {
            const field = this.formTarget.querySelector(`[name="${name}"]`)
            if (field) {
                const fieldContainer = field.closest('.mb-4')

                errors[name].forEach(errorMessage => {
                    const error = document.createElement('div')
                    error.classList.add('text-red-500', 'text-sm', 'mt-1', 'error')
                    error.textContent = errorMessage
                    fieldContainer.append(error)
                })
            }
        }
    }

    clearErrors() {
        const errors = this.formTarget.querySelectorAll('.error')
        errors.forEach(error => error.remove())
    }

    enableColor(event) {
        const choice = event.currentTarget
        const colorItems = choice.closest('.color-items')

        colorItems.querySelectorAll('span.color').forEach(color => {
            color.classList.remove('border-gray-700')
            color.classList.add('border-gray-400')
        })

        choice.nextElementSibling.classList.add('border-gray-700');
        choice.nextElementSibling.classList.remove('border-gray-400');
    }
}