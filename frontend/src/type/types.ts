import { SettingState } from '../util/counter-slice';
import { myProductState } from '../util/myproduct-slice';

export interface ProductBucket {
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
    myProduct: ProductBucket;
    buyingInfo: ProductBucket;
}

export interface SellInfo {
    productName: string;
    productInfo: ProductInfo;
    myProduct: ProductBucket;
    sellingInfo: ProductBucket;
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

export interface Achievement {
    achievementDescription: String;
    achievementGoalDescription: String;
    achievementId: number;
    achievementName: String;
}
export interface AchievementList {
    achievementList: Achievement[];
}
export interface Title {
    titleId: Number;
    titleName: String;
    titleContent: String;
}
export interface TitleList {
    titleList: Title[];
}
export interface Theme {
    themeId: Number;
    themeName: String;
}
export interface ThemeList {
    themeList: Theme[];
}
export interface Product {
    productId: Number;
    productName: String;
    productType: String;
    productUnit: String;
}
export interface ProductList {
    productList: Product[];
}
export interface Event {
    eventId: Number;
    eventName: String;
    eventType: String;
    eventDescription: String;
    eventEffectValue: Number;
    eventUnit: String;
}
export interface EventList {
    eventList: Event[];
}
export interface Infra {}
export interface InfraList {
    infraList: Infra[];
}
export interface MessageType {
    messageType: String;
    messageTypeValue: Number;
}
export interface MessageTypeList {
    messageTypeList: MessageType[];
}
export interface ProfileIcon {
    profileIconId: Number;
    profileIconName: String;
}
export interface ProfileIconList {
    profileIconList: ProfileIcon[];
}
export interface ProfileFrame {
    profileFrameId: Number;
    profileFrameName: String;
}
export interface ProfileFrameList {
    profileFrameList: ProfileFrame[];
}
export interface InitialData {
    achievementList: Achievement[];
    titleList: Title[];
    themeList: Theme[];
    productList: Product[];
    eventList: Event[];
    infraList: Infra[];
    messageTypeList: MessageType[];
    profileIconList: ProfileIcon[];
    profileFrameList: ProfileFrame[];
}
