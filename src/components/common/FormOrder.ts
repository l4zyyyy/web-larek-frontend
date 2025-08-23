import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrder } from '../../types';

export class FormOrder extends Form<IOrder> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected selectedPayment: string = '';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = container.querySelectorAll('.button_alt');
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedPayment = button.name;
                this.paymentButtons.forEach(btn => this.toggleClass(btn, 'button_alt-active', false));
                this.toggleClass(button, 'button_alt-active', true);
                this.events.emit('order.payment:change', { field: 'payment', value: this.selectedPayment });
            });
        });
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
    
    reset() {
        this.container.reset();
        this.paymentButtons.forEach(btn => this.toggleClass(btn, 'button_alt-active', false));
        this.selectedPayment = '';
    }
}