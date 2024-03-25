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
    resourceName: string;
    checksumValue: string;
}
export interface ChecksumList {
    checksumList: Checksum[];
}
export interface NewChecksum {
    achievement: string;
    event: string;
    infra: string;
    messageType: string;
    product: string;
    profileFrame: string;
    profileIcon: string;
    theme: string;
    title: string;
}

export interface Achievement {
    achievementDescription: string;
    achievementGoalDescription: string;
    achievementId: number;
    achievementName: string;
}
export interface AchievementList {
    achievementList: Achievement[];
}
export interface Title {
    titleId: number;
    titleName: string;
    titleContent: string;
}
export interface TitleList {
    titleList: Title[];
}
export interface Theme {
    themeId: number;
    themeName: string;
}
export interface ThemeList {
    themeList: Theme[];
}
export interface Product {
    productId: number;
    productName: string;
    productType: string;
    productUnit: string;
}
export interface ProductList {
    productList: Product[];
}
export interface Event {
    eventId: number;
    eventName: string;
    eventType: string;
    eventDescription: string;
    eventEffectValue: number;
    eventUnit: string;
}
export interface EventList {
    eventList: Event[];
}
export interface InfraList {
    brokerInfoList: BrokerInfo[];
    vehicleInfoList: VehicleInfo[];
    warehouseInfoList: WarehouseInfo[];
}
export interface MessageType {
    messageType: string;
    messageTypeValue: number;
}
export interface MessageTypeList {
    messageTypeList: MessageType[];
}
export interface ProfileIcon {
    profileIconId: number;
    profileIconName: string;
}
export interface ProfileIconList {
    profileIconList: ProfileIcon[];
}
export interface ProfileFrame {
    profileFrameId: number;
    profileFrameName: string;
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
    infraList: InfraList;
    messageTypeList: MessageType[];
    profileIconList: ProfileIcon[];
    profileFrameList: ProfileFrame[];
}

export interface profileData {
    career: number;
    profileFrameId: number;
    profileIconId: number;
    themeId: number;
    titleId: number;
    userNickname: string;
}
export interface BrokerInfo {
    brokerLevel: number;
    brokerName: string;
    brokerUpgradeFee: number;
    brokerFeeRate: number;
    brokerContent: string;
}
export interface VehicleInfo {
    vehicleLevel: number;
    vehicleName: string;
    vehicleUpgradeFee: number;
    vehicleCapacity: number;
    vehicleContent: string;
}
export interface WarehouseInfo {
    warehouseLevel: number;
    warehouseName: string;
    warehouseUpgradeFee: number;
    warehouseCapacity: number;
    warehouseContent: string;
}

export interface Chat {
    userNickname: string;
    message: string;
    profileIconId: number;
    profileFrameId: number;
}

export interface TotalProductInfo {
    productId: number;
    totalAccPrivateProductPurchaseQuantity: number;
    totalAccPrivateProductOutcome: number;
    totalAccPrivateProductSalesQuantity: number;
    totalAccPrivateProductIncome: number;
    totalAccPrivateProductProfit: number;
    totalAccPrivateBrokerFee: number;
}
