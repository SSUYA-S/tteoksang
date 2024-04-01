import { useSelector } from 'react-redux';
import InventoryCard from '../section/InventoryCard';
import { ProductBucket, Product } from '../../type/types';
import { useEffect } from 'react';

type inventoryType = {
    setInventoryFlag: React.Dispatch<React.SetStateAction<boolean>>;
    productSource: Product[];
};

export default function InventoryModal(props: inventoryType) {
    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setInventoryFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
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
        <section className="absolute w-[80%] h-[80%] flex justify-center items-center z-50 animation-modal mt-[1vw]">
            <img
                src="/src/assets/images/layout/ui-board.webp"
                className="absolute w-full h-full -z-10"
                alt=""
            />
            <div className="absolute left-[1vw] w-[95%] h-[90%] items-center justify-center flex flex-wrap overflow-y-auto px-[3vw] py-[2vw]">
                {myProduct.map((product: ProductBucket) => {
                    return (
                        <InventoryCard
                            myProduct={product}
                            productName={
                                props.productSource[product.productId]
                                    .productName
                            }
                            productTodayCost={
                                productInfoList[product.productId].productCost
                            }
                            productFluctuation={
                                productInfoList[product.productId]
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
