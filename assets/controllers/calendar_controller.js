import { Controller } from '@hotwired/stimulus';
import '../styles/calendar.css';
import {addDays,
    diffInDay,
    endOfMonth,
    endOfWeek,
    getDayId,
    getDaysBetween,
    minDates,
    startOfWeek,
    fetchEvent
} from "../js/functions/date.js";

/** @typedef {{name: string, start: Date, end: Date, fullDay?: boolean, type?: string}} CalendarEvent */

const dayFormatter = new Intl.DateTimeFormat(undefined, {weekday: 'short'}) // long
const timeFormatter = new Intl.DateTimeFormat(undefined, {hour: '2-digit', minute: '2-digit'})
const monthFormatter = new Intl.DateTimeFormat(undefined, {month: 'long'})

export default class extends Controller {

    static targets = [ "root", "date" ]

    /** @type {Map<string, CalendarEvent[]>} */
    #eventsMap = new Map()

    async connect() {
        const events = await fetchEvent('/api/events/user/2')

        this.#eventsMap = new Map()
        this.month = new Date().getMonth()
        this.year = new Date().getFullYear()

        if (!this.hasRootTarget) {
            console.error('missing root element')
        }

        this.#fillEventMap(events)
        this.#render()
    }

    prev() {
        this.month -= 1
        this.#navigate()
    }
    next() {
        this.month += 1
        this.#navigate()
    }

    /**
     * @param {Date} curentDate
     */
    #showCurrentDate(curentDate) {
        this.dateTarget.innerHTML = `${monthFormatter.format(curentDate)} ${curentDate.getFullYear()}`
    }

    #navigate() {
        if (this.month < 0) {
            this.month = 11;
            this.year -= 1;
        } else if (this.month > 11) {
            this.month = 0;
            this.year += 1;
        }

        this.#render();
    }

    #render() {
        const curentDate = new Date(this.year, this.month, 1)
        const firstDayOfMonth = new Date(this.year, this.month, 1, 0, 0, 0, 0);
        const start = startOfWeek(firstDayOfMonth);
        const end = endOfWeek(endOfMonth(firstDayOfMonth));
        const daysOfMonth = getDaysBetween(start, end);

        const days = Array.from(
            {length: 7},
            (_, i) => dayFormatter.format(addDays(start, i))
        );

        this.#showCurrentDate(curentDate)

        this.rootTarget.innerHTML = `
            <div class="calendar">
                <div class="calendar-month-header" role="row">
                    ${days.map(day => `<div class="month-header"><p class="day">${day}</p></div>`).join("")}
                </div>
            </div>
        `;

        /** @type {Map<CalendarEvent, position>} */
        const positionMap = new Map()
        const calendar = this.rootTarget.querySelector('.calendar')
        let monthRow = this.createMonthRow()

        for (const dayOfMonth of daysOfMonth) {
            const cell = this.#buildDivCell(dayOfMonth, this.month, positionMap)
            monthRow.append(cell)
            if (dayOfMonth.getDay() === 0) {
                calendar.append(monthRow)
                monthRow = this.createMonthRow()
                positionMap.clear()
            }
        }
    }

    #buildDivCell(date, month, positionMap) {
        const getAvailablePosition = () => {
            if (positionMap.size === 0) {
                return 0;
            }
            const positions = Array.from(positionMap.values());
            const max = Math.max(...positions);
            for (let i = 0; i < max; i++) {
                if (!positions.includes(i)) {
                    return i;
                }
            }
            return max + 1;
        }
        const cell = document.createElement('div')
        cell.classList.add('month-cell')


        const dayId = getDayId(date)
        const currentDayId = getDayId(new Date())
        const isCurrentMonth = date.getMonth() === month
        const isCurrentDay = currentDayId === dayId

        if (isCurrentDay) {
            cell.classList.add('current-day')
        }
        if (!isCurrentMonth) {
            cell.classList.add('month-cell-out')
        }

        cell.innerHTML = `
            <div class="calendar_date">
                ${date.getDate()}
            </div>
            <div class="calendar_events"></div>
        `

        const eventContainer = cell.querySelector('.calendar_events')
        const events = this.#eventsMap.get(dayId) || []
        const finishedEvents = [];

        for (const event of events) {
            const classes = ['calendar_event']
            if (event.type) {
                classes.push('calendar_event-' + event.type)
            }


            // Début d'un évènement sur plusieurs jours
            if (
                event.fullDay &&
                (dayId === getDayId(event.start) || date.getDay() === 1)
            ) {
                const position = getAvailablePosition()
                positionMap.set(event, position);
                const endDate =  minDates([event.end, endOfWeek(date)])

                const days = diffInDay(date, endDate)

                if (dayId !== getDayId(event.start)) {
                    classes.push('calendar_event-overflow-left')
                }
                if (endDate !== event.end) {
                    classes.push('calendar_event-overflow-right')
                }
                classes.push('calendar_event-fullday')

                eventContainer.insertAdjacentHTML(
                    'beforeend',
                    `<div 
                        class="${classes.join(' ')}"
                        style="--days:${days}; --offset:${position}"
                    >
                        ${event.name}
                    </div>`
                )
            }

            if (event.fullDay && dayId === getDayId(event.end)) {
                finishedEvents.push(event)
            }

            // Début d'un évènement un seul jour
            if (!event.fullDay) {
                classes.push('calendar_event-hour')
                eventContainer.insertAdjacentHTML('beforeend', `<div class="${classes.join(' ')}">
                    <span>${timeFormatter.format(event.start)} - ${event.name}</span>
                </div>`)
            }
        }

        // Gestion des chevauchements
        const maxOffset = positionMap.size > 0 ? Math.max(...positionMap.values()) + 1 : 0;
        eventContainer.style.setProperty('--offset', maxOffset.toString())

        for (const event of finishedEvents) {
            positionMap.delete(event)
        }

        return cell
    }

    #buildCell(date, month, positionMap) {
        const getAvailablePosition = () => {
            if (positionMap.size === 0) {
                return 0;
            }
            const positions = Array.from(positionMap.values());
            const max = Math.max(...positions);
            for (let i = 0; i < max; i++) {
                if (!positions.includes(i)) {
                    return i;
                }
            }
            return max + 1;
        }
        const td = document.createElement('td')
        const dayId = getDayId(date)
        const currentDayId = getDayId(new Date())
        const isCurrentMonth = date.getMonth() === month
        const isCurrentDay = currentDayId === dayId

        if (isCurrentDay) {
            td.classList.add('current-day')
        }

        td.innerHTML = `<div class="calendar_cell">
            <div class="calendar_date${isCurrentMonth ? '' : ' calendar_date-diff'}">${date.getDate()}</div>
            <div class="calendar_events"></div>
        </div>`

        const eventContainer = td.querySelector('.calendar_events')
        const events = this.#eventsMap.get(dayId) || []
        const finishedEvents = [];

        for (const event of events) {
            const classes = ['calendar_event']
            if (event.type) {
                classes.push('calendar_event-' + event.type)
            }


            // Début d'un évènement sur plusieurs jours
            if (
                event.fullDay &&
                (dayId === getDayId(event.start) || date.getDay() === 1)
            ) {
                const position = getAvailablePosition()
                positionMap.set(event, position);
                const endDate =  minDates([event.end, endOfWeek(date)])

                const days = diffInDay(date, endDate)

                if (dayId !== getDayId(event.start)) {
                    classes.push('calendar_event-overflow-left')
                }
                if (endDate !== event.end) {
                    classes.push('calendar_event-overflow-right')
                }
                classes.push('calendar_event-fullday')

                eventContainer.insertAdjacentHTML(
                    'beforeend',
                    `<div 
                        class="${classes.join(' ')}"
                        style="--days:${days}; --offset:${position}"
                    >
                        ${event.name}
                    </div>`
                )
            }

            if (event.fullDay && dayId === getDayId(event.end)) {
                finishedEvents.push(event)
            }

            // Début d'un évènement un seul jour
            if (!event.fullDay) {
                classes.push('calendar_event-hour')
                eventContainer.insertAdjacentHTML('beforeend', `<div class="${classes.join(' ')}">
                    <span>${timeFormatter.format(event.start)} - ${event.name}</span>
                </div>`)
            }
        }

        eventContainer.style.setProperty('--offset', (Math.max(...positionMap.values()) + 1).toString())

        for (const event of finishedEvents) {
            positionMap.delete(event)
        }

        return td
    }

    createMonthRow() {
        const row = document.createElement('div')
        row.classList.add('calendar-month-row')
        row.setAttribute('role', 'row-group')

        return row
    }

    /**
     * @param {CalendarEvent[]} events
     */
    #fillEventMap(events) {
        const sortEvents = [...events].sort((a, b) => a.start < b.start ? -1 : 1)

        for (const event of sortEvents) {
            const days = getDaysBetween(event.start, event.end)
            for (const day of days) {
                const id = getDayId(day)
                this.#eventsMap.set(
                    id,
                    [
                        ...(this.#eventsMap.get(id) || []),
                        event
                    ]
                )
            }
        }
    }
}