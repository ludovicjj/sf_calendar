import { Controller } from '@hotwired/stimulus';
import '../styles/menu.css'

export default class extends Controller {
    connect() {
        this.element.addEventListener('click', async (e) => {
            if (
                e.target.closest('a') ||
                e.target.closest('img')
            ) {
                return;
            }

            const isOpen = this.element.classList.contains('open')

            if (isOpen) {
                this.element.classList.remove('open')
                this.element.classList.add('close')
            } else {
                this.element.classList.add('open')
                this.element.classList.remove('close')
            }
        })
    }
}