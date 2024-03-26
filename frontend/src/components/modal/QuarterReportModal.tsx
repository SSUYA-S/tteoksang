import { useState } from 'react';
import Quarter from '../../dummy-data/report/quarter.json';
import RentFeeModal from './RentFeeModal';
import { Title, Event, Product } from '../../type/types';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    setIsQtrReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuarterReportModal(props: Prop) {
    const [mode, setMode] = useState<number>(0);

    const showReport = () => {
        console.log('hello');
        setMode(1);
    };

    return (
        <>
            {mode === 0 ? (
                <RentFeeModal
                    rentFeeInfo={Quarter.rentFeeInfo}
                    startTurn={Quarter.turn - 91}
                    endTurn={Quarter.turn - 1}
                    showReport={showReport}
                    productList={props.productList}
                />
            ) : (
                <>
                    <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-10"></div>
                    <div className="w-[60%] h-[60%] absolute left-[20%] top-[20%] color-border-subbold border-[0.5vw] bg-white z-20">
                        <div
                            className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                            onClick={() => {
                                props.setIsQtrReportAvail(false);
                            }}
                        >
                            X
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
