import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { ProductData } from './components/ProductData';
import { OrderData } from './components/OrderData';
import { IOrder, IProduct, TBasketItem } from './types';
import { ProductCard, ProductCardPreview } from './components/common/Card';
import { Basket } from './components/common/Basket';
import { FormOrder } from './components/common/FormOrder';
import { FormContacts } from './components/common/FormContacts';
import { FormSuccess } from './components/common/FormSuccess';

// Инициализация базовых компонентов
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модели данных
const productData = new ProductData(events);
const orderData = new OrderData(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);

// Изменился список товаров -> Рендер карточек на главной
events.on('productList:changed', () => {
    page.catalog = productData.getProductList().map(item => {
        const card = new ProductCard(cloneTemplate(cardCatalogTemplate), events);
        card.itemId = item.id;
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        });
    });
});

// Открыть карточку товара -> Показать превью в модалке
events.on('product:open', (data: { id: string }) => {
    const product = productData.getProductById(data.id);
    const cardPreview = new ProductCardPreview(cloneTemplate(cardPreviewTemplate), events);
    
    cardPreview.itemId = product.id;
    cardPreview.buttonStatus(orderData.getBasket().some(item => item.id === product.id));
    cardPreview.buttonDisabled(product.price === null);

    const cardElement = cardPreview.render({
        title: product.title,
        image: product.image,
        description: product.description,
        price: product.price,
        category: product.category
    });

    const button = cardElement.querySelector('.card__button');
    button.addEventListener('click', () => {
        if(orderData.getBasket().some(item => item.id === product.id)) {
            events.emit('product:removeBasket', product);
            cardPreview.buttonStatus(false);
        } else {
            events.emit('product:addBasket', product);
            cardPreview.buttonStatus(true);
        }
    });

    modal.render({ content: cardElement });
});

// Добавить товар в корзину
events.on('product:addBasket', (product: IProduct) => {
    orderData.addProduct({ id: product.id, title: product.title, price: product.price });
});

// Удалить товар из корзины
events.on('product:removeBasket', (product: IProduct) => {
    orderData.deleteProduct(product.id);
});

// Обновилась корзина (добавление/удаление) -> Пересчитать счетчик и сумму
events.on('totalUpdated', () => {
    page.counter = orderData.getBasket().length;
    basket.total = orderData.getTotal();
});

// Открыть корзину -> Показать модалку с товарами
events.on('basket:open', () => {
    const basketItems = orderData.getBasket().map((item, index) => {
        const card = cloneTemplate(cardBasketTemplate);
        const title = card.querySelector('.card__title');
        const price = card.querySelector('.card__price');
        const deleteButton = card.querySelector('.basket__item-delete');
        const itemIndex = card.querySelector('.basket__item-index');
        
        itemIndex.textContent = (index + 1).toString();
        title.textContent = item.title;
        price.textContent = `${item.price} синапсов`;
        deleteButton.addEventListener('click', () => {
            events.emit('product:removeBasket', item);
            events.emit('basket:open'); // Перерисовать корзину
        });
        return card;
    });

    basket.items = basketItems;
    basket.total = orderData.getTotal();
    modal.render({ content: basket.render() });
});

// Нажали "Оформить" в корзине -> Открыть форму заказа
events.on('basket:submit', () => {
    modal.render({ content: formOrder.render({ valid: false, errors: [] }) });
});

// Изменилось поле в форме заказа
events.on(/^order\..*:change/, (data: { field: 'payment' | 'address'; value: string }) => {
    orderData.setOrderField(data.field, data.value);
});

// Изменилось поле в форме контактов
events.on(/^contacts\..*:change/, (data: { field: 'email' | 'phone'; value: string }) => {
    orderData.setContact(data.field, data.value);
});

// Изменились ошибки валидации формы заказа
events.on('formErrorsOrder:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;
    formOrder.valid = !payment && !address;
    formOrder.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Нажали "Далее" в форме заказа -> Открыть форму контактов
events.on('order:submit', () => {
    modal.render({ content: formContacts.render({ valid: false, errors: [] }) });
});

// Изменились ошибки валидации формы контактов
events.on('formErrorsContacts:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    formContacts.valid = !email && !phone;
    formContacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Нажали "Оплатить" в форме контактов -> Отправить заказ на сервер
events.on('contacts:submit', () => {
    const orderRequest = {
        ...orderData._order,
        items: orderData.getBasket().map(item => item.id),
        total: orderData.getTotal(),
    };
    
    api.orderProducts(orderRequest)
        .then(result => {
            const success = new FormSuccess(cloneTemplate(successTemplate), {
                onClick: () => modal.close(),
            });
            success.show(result.total);
            modal.render({ content: success.render() });

            orderData.clearBasket();
            orderData.clearDataForms();
            formOrder.reset();
            formContacts.reset();
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокировка/разблокировка страницы при открытии/закрытии модалки
events.on('modal:open', () => page.locked = true);
events.on('modal:close', () => page.locked = false);

// Получаем товары с сервера
api.getProductList()
    .then(productData.setProductList.bind(productData))
    .catch(err => console.error(err));