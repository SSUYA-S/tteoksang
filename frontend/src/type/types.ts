interface Product {
    productId: number;
    productQuantity: number;
    productTotalCost: number;
}

interface ProductInfo {
    productId: number;
    productCost: number;
    productLimit: number;
    productFluctuation: number;
}

interface Article {
    articleHeadline: string;
}

interface BuyInfo {
    productName: string;
    productInfo: ProductInfo;
    myProduct: Product;
    buyingInfo: Product;
}

interface SellInfo {
    productName: string;
    productInfo: ProductInfo;
    myProduct: Product;
    sellingInfo: Product;
}
