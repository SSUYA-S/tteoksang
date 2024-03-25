import { useState } from 'react';
import Quarter from '../../dummy-data/report/quarter.json';
import RentFeeModal from './RentFeeModal';
import { Title, Event, Product } from '../../type/types';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
}

export default function QuarterReportModal(props: Prop) {
    const [isRentModalAvail, setIsRentModalAvail] = useState<boolean>(true);

    return (
        <>
            {isRentModalAvail ? (
                <RentFeeModal
                    rentFeeInfo={Quarter.rentFeeInfo}
                    startTurn={Quarter.turn - 91}
                    endTurn={Quarter.turn - 1}
                    setIsRentModalAvail={setIsRentModalAvail}
                    productList={props.productList}
                />
            ) : (
                <></>
            )}
        </>
    );
}
