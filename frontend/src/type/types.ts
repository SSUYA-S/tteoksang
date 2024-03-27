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

///////////////이 아래부터는 결산용 type////////////

/**강탈한 상품 목록을 위한 type */
export interface ConfProductType {
    productId: number;
    productQuantity: number;
}

/**연체료 모달 위한 type */
export interface RentFeeInfoType {
    billType: string;
    rentFee: number;
    productList: ConfProductType[];
}

/**랭킹 정보 표시 시 유저 정보를 위한 type */
export interface RankUserType {
    userNickname: string;
    profileIconId: number;
    profileFrameId: number;
}

/**결산 시 랭킹 정보를 위한 type */
export interface RankReportType {
    rankName: string;
    rankDescription: string;
    theFirstUserInfo: RankUserType;
    theFirstRecord: number;
    myRank: number;
    myRecord: number;
}

/**결산 시 통계 정보를 위한 각 아이템 type */
export interface StatItemsType {
    productId: number;
    value: number;
}

/**결산 시 통계 type */
export interface Stat {
    values: StatItemsType[];
}

/**결산 시 도전과제 달성 표시 위한 것 */
export interface AchievementReport {
    achievementId: number;
}

/**전체 결산 시 내 개인 작물 관련 통계를 위한 type */
export interface privateProdRep {
    productId: number;
    totalAccPrivateProductPurchaseQuantity: number;
    totalAccPrivateProductOutcome: number;
    totalAccPrivateProductSalesQuantity: number;
    totalAccPrivateProductIncome: number;
    totalAccPrivateProductProfit: number;
    totalAccPrivateBrokerFee: number;
}

/**전체 결산 시 사용할 전체 농작물 관련 통계 */
export interface publicProdRep {
    productId: number;
    totalAccProductPurchaseQuantity: number;
    totalAccProductOutcome: number;
    totalAccProductSalesQuantity: number;
    totalAccProductIncome: number;
    totalAccProductProfit: number;
    totalAccBrokerFee: number;
    maxProductPurchaseQuantityPerTurn: number;
    maxProductSalesQuantityPerTurn: number;
}

/**private prod report 연단위로 묶은 type */
export interface annualPrivate {
    year: number;
    productList: privateProdRep;
}

/**public prod report 연단위로 묶은 type */
export interface annualPublic {
    year: number;
    productList: publicProdRep;
}

/**rent fee report 연단위로 묶은 type */
export interface annualRent {
    year: number;
    totalAccPrivateRentFee: number;
}

/**upgrade fee report 연단위로 묶은 type */
export interface annualUpgrade {
    year: number;
    totalAccPrivateUpgradeFee: number;
}

/**private event 발생횟수 type */
export interface privateEventReport {
    eventId: number;
    totalAccPrivateEventOccurCount: number;
}

/**special event 발생횟수 type */
export interface specialEventReport {
    specialEventId: number;
    totalAccSpecialEventOccurCount: number;
}

/**연단위로 묶은 public event type */
export interface annualPrivateEvent {
    year: number;
    privateEventList: privateEventReport[];
}

/**연단위로 묶은 special event type */
export interface annualSpecialEvent {
    year: number;
    specialEventList: specialEventReport[];
}

/**접속 시간 분석을 위한 각 시간단위별 값 */
export interface timeSlotCount {
    timeSlotIndex: number;
    privateTimeSlotCount: number;
}

/**분기 리포트를 위한 type */
export interface QuarterReportType {
    turn: number;
    rentFeeInfo: RentFeeInfoType;
    quarterProfit: number;
    rentFee: number;
    inProductList: number;
    titleId: number;
}

/**반기 리포트를 위한 type */
export interface HalfReportType {
    turn: number;
    rentFeeInfo: RentFeeInfoType; //2개 분기 합친 것
    quarterReport: QuarterReportType;
    totalProductIncome: number;
    totalProductOutcome: number;
    totalBrokerFee: number;
    totalUpgradeFee: number;
    totalRentFee: number;
    eventBonus: number;
    participantCount: number;
    rankInfoList: RankReportType[];
    tteoksangStatistics: Stat;
    tteokrockStatistics: Stat;
    bestSellerStatistics: Stat;
    achievementList: AchievementReport[];
}

/**전체 결산 리포트를 위한 type */
export interface FinalReportType {
    rentFeeInfo: RentFeeInfoType;
    season: number;
    privateProductReportList: annualPrivate[];
    publicProductReportList: annualPublic[];
    privateRentReportList: annualRent[];
    warehouseLevel: number;
    brokerLevel: number;
    vehicleLevel: number;
    privateUpgradeReportList: annualUpgrade[];
    privateEventReportList: annualPrivateEvent[];
    specialEventReportList: annualSpecialEvent[];
    achievementList: AchievementReport[];
    privateAccPrivatePlayTime: number;
    privateTimeSlotReportList: timeSlotCount[];
    rankInfoList: RankReportType[];
    tteoksangStatistics: Stat;
    tteokrockStatistics: Stat;
}

export interface OfflineReportType {
    lastGameTurn: number;
    rentFeeInfo: RentFeeInfoType;
    halfReport: HalfReportType;
    quarterReport: QuarterReportType;
    participantCount: number;
    rankInfoList: RankReportType[];
    tteoksangStatistics: Stat;
    tteokrockStatistics: Stat;
    bestSellerStatistics: Stat;
}

export interface HalfReceipt {
    totalProductIncome: number;
    totalProductOutcome: number;
    totalUpgradeFee: number;
    totalBrokerFee: number;
    totalRentFee: number;
    eventBonus: number;
    totalIncome: number;
    totalOutcome: number;
}
