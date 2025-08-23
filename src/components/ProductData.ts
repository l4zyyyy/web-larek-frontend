import { Model } from '../components/base/Model';
import { IEvents } from './base/events';
import { IProduct } from '../types';
import { IProductData } from '../types';

export class ProductData extends Model<IProduct> implements IProductData {
    productList: IProduct[];
    
    constructor(protected events: IEvents) {
        super({}, events);
    }

    setProductList(items: IProduct[]): void {
        this.productList = items;
        this.events.emit('productList:changed', { products: this.productList });
    }

    getProductList(): IProduct[] {
        return this.productList;
    }

    getProductById(id: string): IProduct {
        return this.productList.find((item) => item.id === id);
    }
}