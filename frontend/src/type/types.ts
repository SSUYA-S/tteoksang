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

export interface Checksum {
    resourceName: String;
    checksumValue: String;
}
export interface ChecksumList {
    checksumList: Checksum[];
}
export interface NewChecksum {
    achievement: String;
    event: String;
    infra: String;
    messageType: String;
    product: String;
    profileFrame: String;
    profileIcon: String;
    theme: String;
    title: String;
}

export interface profileData {
    career: number;
    profileFrameId: number;
    profileIconId: number;
    themeId: number;
    titleId: number;
    userNickname: string;
}
