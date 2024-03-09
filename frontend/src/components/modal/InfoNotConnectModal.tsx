import { useState } from 'react';

type infoSeasonType = {
    setInfoNotConnectFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function InfoNotConnectModal(props: infoSeasonType) {
    const [changeTitle, setChangeTitle] = useState<boolean>(false);
    const closeSeasonModal = () => {
        props.setInfoNotConnectFlag(false);
    };
    const openChangeTitle = () => {
        setChangeTitle(true);
    };
    const displayElement = () => {
        return (
            <div
                className="w-[15%] border-4 color-border-brown1 m-4 bg-white"
                style={{ aspectRatio: 1 / 1 }}
            ></div>
        );
    };
    return (
        <div className="absolute w-[50%] h-[60%] flex items-center justify-center color-text-textcolor border-8 color-border-brown1 color-bg-main z-50">
            <div className="w-[50%] h-full flex flex-col items-center">
                <div className="w-[90%] h-[15%] flex flex-col justify-end">
                    <p className="text-4xl">미접속 결산</p>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                </div>
                <div className="w-[90%] h-[50%] text-2xl">
                    <p>2년차 겨울 ~ 3년차 여름</p>
                    <div className="flex justify-between px-4">
                        <p>수익</p>
                        <p>30,000</p>
                    </div>
                    <div className="flex justify-between px-4">
                        <p>임대료</p>
                        <p>-500</p>
                    </div>
                </div>
                <div className="w-[90%] h-[35%] text-2xl">
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>당기 순익</p>
                        <p>29,500</p>
                    </div>
                    <p className="w-full h-[4px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>현재 칭호</p>
                        <p></p>
                    </div>

                    <div className="flex justify-between items-center px-4">
                        <p>사과</p>
                        <p>사과농장 주인</p>
                        <p
                            className="border-4 px-4 py-2 color-border-brown1 cursor-pointer"
                            onClick={() => openChangeTitle()}
                        >
                            변경
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-[50%] h-full flex flex-col items-center text-2xl">
                <p className="text-3xl my-8">다음 계절 : 3년차 가을</p>
                <div className="w-[90%] flex flex-col items-start">
                    <p>계절 이벤트</p>
                    <div className="w-full h-full flex">
                        {displayElement()}
                        {displayElement()}
                        {displayElement()}
                    </div>
                </div>
                <div className="w-[90%] flex flex-col items-start">
                    <p>채집 작물</p>
                    <div className="w-full h-full flex">
                        {displayElement()}
                        {displayElement()}
                        {displayElement()}
                    </div>
                </div>
                <div className="w-[90%] flex flex-col items-start">
                    <p>구매 불가 작물</p>
                    <div className="w-full h-full flex">
                        {displayElement()}
                        {displayElement()}
                        {displayElement()}
                    </div>
                </div>
            </div>
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeSeasonModal();
                }}
            >
                X
            </div>
        </div>
    );
}
