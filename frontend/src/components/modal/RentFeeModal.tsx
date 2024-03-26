import { Product, RentFeeInfoType } from '../../type/types';

interface Prop {
    rentFeeInfo: RentFeeInfoType;
    startTurn: number;
    endTurn: number;
    showReport: () => void;
    productList: Product[];
}

export default function RentFeeModal(props: Prop) {
    const rentFeeInfo: RentFeeInfoType = props.rentFeeInfo;
    const productList: Product[] = props.productList;

    //turn수로 날짜 계산 함수
    const calculateDate = (turn: number) => {
        const date: number = turn - 1;
        const day: number = (date % 30) + 1;
        const month: number = ((Math.floor(date / 30) + 2) % 12) + 1;
        const year: number = Math.floor((date + 60) / 360);
        //string 변환
        const dayString = day < 10 ? '0' + day : '' + day;
        const monthString = month < 10 ? '0' + month : '' + month;
        const yearString = year < 10 ? '0' + year : '' + year;

        return `${yearString}.${monthString}.${dayString}`;
    };

    /**기간 표시 */
    const duration = `${calculateDate(props.startTurn)} ~ ${calculateDate(
        props.endTurn
    )}`;

    let rentReceipt = <></>;
    if (rentFeeInfo.billType === 'basic') {
        rentReceipt = (
            <div className="w-[40%] h-[40%] bg-[#FDFFA3] flex flex-col absolute left-[30%] top-[35%] items-center">
                <div className="w-full h-[20%] p-[1vw] text-4xl text-red-500 flex justify-center items-end">
                    임대료 고지서
                </div>
                <hr className="color-bg-subbold w-[90%] h-[2px]"></hr>
                <div className="text-3xl w-full h-[30%] color-text-subbold">
                    {duration}
                </div>
                <div className="text-3xl text-right w-full h-[30%] p-[1vw] color-text-subbold">{`${rentFeeInfo.rentFee.toLocaleString()}원`}</div>
                <div
                    onClick={props.showReport}
                    className="w-[90%] p-[1vw] m-[1vw] border-[0.2vw] color-border-subbold text-2xl color-text-subbold cursor-pointer"
                >
                    확인
                </div>
            </div>
        );
    } else if (rentFeeInfo.billType === 'overdue') {
        rentReceipt = (
            <div className="w-[40%] h-[60%] bg-[#FFCEC3] flex flex-col absolute left-[30%] top-[20%] items-center">
                <div className="w-full h-[20%] p-[1vw] text-4xl text-red-500 flex justify-center items-end">
                    가압류 고지서
                </div>
                <hr className="color-bg-subbold w-[90%] h-[2px]"></hr>
                <div className="text-3xl w-full h-[10%] color-text-subbold">
                    {duration}
                </div>
                <div className="text-3xl text-right w-full h-[10%] p-[1vw] color-text-subbold">{`${rentFeeInfo.rentFee.toLocaleString()}원`}</div>
                <div className="text-3xl text-center w-full h-[50%] p-[1vw] text-red-500 overflow-y-auto break-words">
                    <span>[</span>
                    {rentFeeInfo.productList.map((product, index) => {
                        const prodName =
                            productList[product.productId - 1].productName;
                        const prodUnit =
                            productList[product.productId - 1].productUnit;
                        let returnString = `${prodName} ${product.productQuantity}${prodUnit}`;
                        if (index !== rentFeeInfo.productList.length - 1) {
                            returnString += ', ';
                        }
                        console.log(returnString);
                        return <span>{returnString}</span>;
                    })}
                    <span>]</span>
                    <p>품목을 압류하여</p>
                    <p>임대료를 납부했습니다.</p>
                </div>
                <div
                    onClick={props.showReport}
                    className="w-[90%] p-[1vw] h-[10%] m-[1vw] border-[0.2vw] color-border-subbold text-2xl color-text-subbold flex justify-center items-center cursor-pointer"
                >
                    확인
                </div>
            </div>
        );
    } else if (rentFeeInfo.billType === 'bankrupt') {
        rentReceipt = (
            <div className="w-[40%] h-[60%] bg-[#8e8e8e] flex flex-col absolute left-[30%] top-[20%] items-center">
                <div className="w-full h-[20%] p-[1vw] text-4xl text-white flex justify-center items-end">
                    파산 고지서
                </div>
                <hr className="bg-white w-[90%] h-[2px]"></hr>
                <div className="text-3xl w-full h-[10%] text-white">
                    {duration}
                </div>
                <div className="text-3xl text-right w-full h-[10%] p-[1vw] text-white">{`${rentFeeInfo.rentFee.toLocaleString()}원`}</div>
                <div className="text-3xl text-center w-[90%] h-[50%] p-[1vw] text-white overflow-y-auto break-keep flex flex-col justify-around items-center">
                    <p>모든 품목을 압류하더라도 임대료 납부가 불가능합니다.</p>
                    <p>GAME OVER...</p>
                </div>
                <div
                    onClick={props.showReport}
                    className="w-[90%] p-[1vw] h-[10%] m-[1vw] border-[0.2vw] border-white text-2xl text-white flex justify-center items-center cursor-pointer"
                >
                    ㅠㅠ 다시 시작해보자...
                </div>
            </div>
        );
    }

    return <>{rentReceipt}</>;
}
