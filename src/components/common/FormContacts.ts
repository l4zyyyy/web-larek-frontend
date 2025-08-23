import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrder } from '../../types';

export class FormContacts extends Form<IOrder> {
    protected emailField: HTMLInputElement;
    protected phoneField: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailField = this.container.elements.namedItem('email') as HTMLInputElement;
        this.phoneField = this.container.elements.namedItem('phone') as HTMLInputElement;
    }
    
    set phone(value: string) {
        this.phoneField.value = value;
    }
    
    set email(value: string) {
        this.emailField.value = value;
    }
    
    reset() {
        this.container.reset();
    }
}