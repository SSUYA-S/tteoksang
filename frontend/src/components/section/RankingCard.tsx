import { useState } from 'react';
import { RankReportType } from '../../type/types';

export default function RankingCard({
    rankName,
    rankDescription,
    myRank,
    myRecord,
    theFirstRecord,
    theFirstUserInfo,
}: RankReportType) {
    const [flag, setFlag] = useState<boolean>(false);

    const openDesc = () => {
        setFlag(true);
    };
    const closeDesc = () => {
        setFlag(false);
    };
    return (
        <div
            className="relative w-full h-full flex items-center bg-white border-[0.3vw] rounded-[0.8vw] color-border-subbold p-[0.4vw]"
            onMouseOver={openDesc}
            onMouseOut={closeDesc}
        >
            <div className="relative w-[25%] h-full flex items-center justify-center">
                <img
                    className="absolute w-full z-10 rounded-[0.6vw]"
                    src={`/src/assets/images/profile/frame (${theFirstUserInfo.profileFrameId}).png`}
                    alt=""
                />
                <img
                    className="absolute w-full rounded-[0.6vw]"
                    src={`/src/assets/images/profile/icon (${theFirstUserInfo.profileIconId}).png`}
                    alt=""
                />
            </div>

            <div className="w-full color-text-textcolor h-full flex flex-col items-center justify-between">
                <div>
                    <div className="flex items-end justify-center">
                        <p className="text-[1.4vw]">{rankName}</p>
                        <p className="text-[1.2vw] mx-[0.8vw]">
                            {theFirstUserInfo.userNickname}
                        </p>
                    </div>
                    <p className="text-[1.2vw]">점수 : {theFirstRecord} </p>
                </div>
                <div>
                    <p className="text-[1.1vw]">
                        내 점수 : {myRecord} ({myRank}등)
                    </p>
                </div>
            </div>
            {flag ? (
                <div className="absolute bg-black right-0 top-0 w-full h-full flex items-center justify-center opacity-80 text-white z-20 rounded-[0.4vw]">
                    {rankDescription}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
