interface IProduct {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    price: number | null;
}

interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

interface IOrderRequest extends IOrder {
    items: string[];
    total: number;
}

interface IOrderResult {
    id: string;
    total: number;
}

interface IProductData {
    setProductList(items: IProduct[]): void;
    getProductList(): IProduct[];
    getProductById(id: string): IProduct;
}

interface IOrderData {
    _basket: TBasketItem[];
    _order: Omit<IOrder, 'items' | 'total'>;
    addProduct(item: TBasketItem): void;
    deleteProduct(idProduct: string): void;
    getTotal(): number;
    getBasket(): TBasketItem[];
    setOrder(orderData: Omit<IOrder, 'items' | 'total'>): void;
}

type TProductId = Pick<IProduct, 'id'>;
type TBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
type FormErrors = Partial<Record<keyof IOrder, string>>;