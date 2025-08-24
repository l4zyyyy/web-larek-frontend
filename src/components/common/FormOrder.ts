import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrder } from '../../types';

export class FormOrder extends Form<IOrder> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = container.querySelectorAll('.button_alt');

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { 
                    field: 'payment', 
                    value: button.name 
                });
            });
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(btn =>
            this.toggleClass(btn, 'button_alt', btn.name === value)
        );
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    reset() {
        this.container.reset();
        this.payment = '';
    }
}
