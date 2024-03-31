import { Product } from '../type/types';

export function loadProduct(productId: number, allProduct: Product[]) {
    const data = allProduct.filter((item) => item.productId === productId);
    if (data.length > 0) {
        return data[0].productName;
    }
    return '';
}
