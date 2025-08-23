import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Базовый класс карточки
export class Card extends Component<any> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    
    public itemId: string;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent);
    }
    
    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
        }
    }
}

// Карточка товара на главной странице
export class ProductCard extends Card {
    openButton: HTMLButtonElement;
    
    constructor(container: HTMLButtonElement, events: IEvents) {
        super(container, events);
        this.openButton = container; // Вся карточка является кнопкой
        this.openButton.addEventListener('click', () => {
            this.events.emit('product:open', { id: this.itemId });
        });
    }
}

// Карточка товара в модальном окне
export class ProductCardPreview extends Card {
    protected _description: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    buttonStatus(isInBasket: boolean) {
        this.setText(this.button, isInBasket ? 'Убрать из корзины' : 'В корзину');
    }

    buttonDisabled(priceless: boolean) {
        this.setDisabled(this.button, priceless);
    }
}