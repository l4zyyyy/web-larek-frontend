import { Model } from '../components/base/Model';
import { IEvents } from './base/events';
import { FormErrors, IOrder, TBasketItem } from '../types';

export class OrderData extends Model<IOrder> {
    _basket: TBasketItem[] = [];
    _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    };
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        super({}, events);
    }

    addProduct(product: TBasketItem): void {
        this._basket.push(product);
        this.updateTotal();
    }

    deleteProduct(idProduct: string): void {
        this._basket = this._basket.filter((item) => item.id !== idProduct);
        this.updateTotal();
    }

    getTotal(): number {
        return this._basket.reduce((sum, item) => sum + item.price, 0);
    }

    updateTotal(): void {
        this.events.emit('totalUpdated');
    }

    getBasket(): TBasketItem[] {
        return this._basket;
    }
    
    clearBasket(): void {
        this._basket = [];
        this.updateTotal();
    }

    clearDataForms(): void {
        this._order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
        };
    }

    setOrderField(field: keyof Pick<IOrder, 'payment' | 'address'>, value: string): void {
        this._order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this._order);
        }
    }

    setContact(field: keyof Pick<IOrder, 'email' | 'phone'>, value: string): void {
        this._order[field] = value;
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this._order);
        }
    }

    validateOrder(): boolean {
        const errors: typeof this.formErrors = {};
        if (!this._order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this._order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsOrder:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    
    validateContacts(): boolean {
        const errors: typeof this.formErrors = {};
        if (!this._order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this._order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrorsContacts:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}