import { useSelector } from 'react-redux';
import InventoryCard from '../section/InventoryCard';
import { ProductInfo } from '../../type/types';

import productSource from '../../dummy-data/resource/Product.json';

type inventoryType = {
    setInventoryFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InventoryModal(props: inventoryType) {
    const closeInventoryModal = () => {
        props.setInventoryFlag(false);
    };

    const myProduct = useSelector(
        (state: any) => state.reduxFlag.myProductSlice.myProductList
    );

    const productInfoList = useSelector(
        (state: any) => state.reduxFlag.productAndEventSlice.productInfoList
    );

    return (
        <section className="absolute w-[80%] h-[80%] flex justify-center items-center border-[0.4vw] color-border-sublight color-bg-main rounded-[0.6vw] z-50 animation-modal mt-[1vw]">
            <div className="absolute left-[1vw] w-[95%] h-[90%] bg-white flex flex-wrap overflow-y-auto">
                {myProduct.map((product) => {
                    return (
                        <InventoryCard
                            myProduct={product}
                            productName={
                                productSource.productList[product.productId - 1]
                                    .productName
                            }
                            productTodayCost={
                                productInfoList[product.productId - 1]
                                    .productCost
                            }
                            productFluctuation={
                                productInfoList[product.productId - 1]
                                    .productFluctuation
                            }
                        />
                    );
                })}
            </div>
            <div
                className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeInventoryModal();
                }}
            >
                X
            </div>
        </section>
    );
}
