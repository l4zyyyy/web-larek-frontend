import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { createElement, ensureElement } from '../../utils/utils';
import { TBasketItem } from '../../types';

export class Basket extends Component<any> {
    protected _list: HTMLElement;
    public orderButton: HTMLButtonElement;
    protected _totalPrice: HTMLElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                events.emit('basket:submit');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this.orderButton, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this.orderButton, true);
        }
    }
    
    set total(total: number) {
        this.setText(this._totalPrice, `${total} синапсов`);
    }
}