import { cloneTemplate, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { TBasketItem } from '../../types';

export class BasketItem {
  protected element: HTMLElement;
  protected events: IEvents;

  constructor(item: TBasketItem, index: number, events: IEvents) {
    this.events = events;

    const template = ensureElement<HTMLTemplateElement>('#card-basket');
    this.element = cloneTemplate(template);

    const title = this.element.querySelector('.card__title');
    const price = this.element.querySelector('.card__price');
    const itemIndex = this.element.querySelector('.basket__item-index');
    const deleteButton = this.element.querySelector('.basket__item-delete');

    if (title) title.textContent = item.title;
    if (price) price.textContent = `${item.price} синапсов`;
    if (itemIndex) itemIndex.textContent = index.toString();

    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        this.events.emit('product:removeBasket', item);
      });
    }
  }

  render() {
    return this.element;
  }
}