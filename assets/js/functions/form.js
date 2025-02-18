/**
 * Hydrate le formulaire d'événement avec un CalendarEvent
 *
 * @param {HTMLFormElement} form
 * @param {{name: string, start: Date, end: Date, fullDay: boolean, type: string, description?: string}} calendarEvent
 */
export function fillForm(form, calendarEvent) {
    form.querySelector('[name="name"]').value = calendarEvent.name;
    form.querySelector('[name="startAt"]').value = formatDateForInput(calendarEvent.start);
    form.querySelector('[name="endAt"]').value = formatDateForInput(calendarEvent.end);
    form.querySelector('[name="fullDay"]').checked = calendarEvent.fullDay;
    form.querySelector('[name="description"]').value = calendarEvent?.description || '';

    const choice  = form.querySelector(`[name="type"][value="${calendarEvent.type}"]`)
    if (choice) {
        const colorItems = choice.closest('.color-items')

        colorItems.querySelectorAll('span.color').forEach(color => {
            color.classList.remove('border-gray-700')
            color.classList.add('border-gray-400')
        })

        choice.checked = true
        choice.nextElementSibling.classList.add('border-gray-700');
    }
}

export function resetForm(form) {
    form.reset()
    const colorItems = form.querySelector('.color-items')

    colorItems.querySelectorAll('span.color').forEach(color => {
        color.classList.remove('border-gray-700')
        color.classList.add('border-gray-400')
    })
}

/**
 * Formate une date au format "dd-mm-yyyy HH:mm"
 * @param {Date} date
 * @return string
 */
function formatDateForInput(date) {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() commence à 0
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}