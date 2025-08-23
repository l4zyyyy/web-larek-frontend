export interface IProduct {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderRequest extends IOrder {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductData {
    setProductList(items: IProduct[]): void;
    getProductList(): IProduct[];
    getProductById(id: string): IProduct;
}

export interface IOrderData {
    _basket: TBasketItem[];
    _order: Omit<IOrder, 'items' | 'total'>;
    addProduct(item: TBasketItem): void;
    deleteProduct(idProduct: string): void;
    getTotal(): number;
    getBasket(): TBasketItem[];
    setOrder(orderData: Omit<IOrder, 'items' | 'total'>): void;
}

export type TProductId = Pick<IProduct, 'id'>;
export type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
export type FormErrors = Partial<Record<keyof IOrder, string>>;