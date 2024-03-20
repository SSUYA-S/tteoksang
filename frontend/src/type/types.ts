import { SettingState } from '../util/counter-slice';
import { myProductState } from '../util/myproduct-slice';

export interface Product {
    productId: number;
    productQuantity: number;
    productTotalCost: number;
}

export interface ProductInfo {
    productId: number;
    productCost: number;
    productLimit: number;
    productFluctuation: number;
}

export interface Article {
    articleHeadline: string;
}

export interface BuyInfo {
    productName: string;
    productInfo: ProductInfo;
    myProduct: Product;
    buyingInfo: Product;
}

export interface SellInfo {
    productName: string;
    productInfo: ProductInfo;
    myProduct: Product;
    sellingInfo: Product;
}

export interface RootSliceState {
    reduxSlice: SettingState;
    myProductSlice: myProductState;
}
