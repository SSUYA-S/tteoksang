import { useState } from 'react';

type infoResultType = {
    setInfoResultFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function InfoResultModal(props: infoResultType) {
    const [changeTitle, setChangeTitle] = useState<boolean>(false);
    const closeResultModal = () => {
        props.setInfoResultFlag(false);
    };
    const openChangeTitle = () => {
        setChangeTitle(true);
    };
    const closeChangeTitle = () => {
        setChangeTitle(false);
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
                    <p className="text-4xl">전체 결산</p>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                </div>
                <div className="w-[90%] h-[50%] text-2xl">
                    <div className="flex justify-between px-4">
                        <p>수익</p>
                        <p>300,000</p>
                    </div>
                    <div className="flex justify-between px-4">
                        <p>지출</p>
                        <p>-50,000</p>
                    </div>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>총수익</p>
                        <p>250,000</p>
                    </div>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>기본금</p>
                        <p>1,000,000</p>
                    </div>
                    <div className="flex justify-between px-4">
                        <p>시즌 보상</p>
                        <p>250,000</p>
                    </div>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>시작금</p>
                        <p>1,200,000</p>
                    </div>
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>랭킹</p>
                        <p></p>
                    </div>
                    <div className="flex justify-between px-4">
                        <p>수익 순위</p>
                        <p>25위</p>
                    </div>
                </div>
                <div className="w-[90%] h-[35%] text-2xl">
                    <p className="w-full h-[2px] color-bg-brown1 my-2" />
                    <div className="flex justify-between px-4">
                        <p>단일 거래 최다 매출</p>
                        <p>상위 17%</p>
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
                <div className="w-[90%] flex justify-between">
                    <p className="py-2 px-10 color-bg-subbold color-border-subbold text-white cursor-pointer">
                        자세히
                    </p>
                    <p className="py-2 px-10 border-2 color-border-subbold color-text-subbold cursor-pointer">
                        시작
                    </p>
                </div>
            </div>
            <div
                className="absolute text-3xl flex items-center justify-center text-white -top-8 -right-8 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                onClick={() => {
                    closeResultModal();
                }}
            >
                X
            </div>
            {changeTitle ? (
                <div className="absolute w-[40%] h-full text-2xl py-2 flex items-start justify-center color-text-textcolor border-[4px] color-border-sublight color-bg-main">
                    <div className="relative w-[90%] h-full">
                        <div className=" h-[10%] flex flex-col items-center justify-center">
                            <p className="text-4xl">칭호 변경</p>
                        </div>
                        <div className="h-[25%] flex flex-col items-start">
                            <p className="w-full h-[3px] color-bg-brown1 my-2"></p>
                            <p className="mb-2">현재 칭호</p>
                            <div className="w-full flex h-20 border-[3px] py-2 color-border-orange1 color-text-orange1 items-center">
                                <div className="mx-6">사과</div>
                                <p>사과농장 주인</p>
                            </div>
                        </div>
                        <p className="w-full text-start">변경 가능 칭호</p>
                        <div className="h-[60%] flex tems-start flex-wrap flex-row overflow-y-auto">
                            <div className="w-full flex h-[20%] border-[3px] py-2 color-border-orange1 color-text-orange1 items-center my-2">
                                <div className="mx-6">사과</div>
                                <p>사과농장 주인</p>
                            </div>

                            <div className="w-full flex h-[25%] border-[3px] py-2 color-border-brown1 color-text-textcolor items-center my-2">
                                <div className="mx-6">사과</div>
                                <p>사과는 맛있어</p>
                            </div>
                            <div className="w-full flex h-[25%] border-[3px] py-2 color-border-brown1 color-text-textcolor items-center my-2">
                                <div className="mx-6">사과</div>
                                <p>맛있으면 또 먹지</p>
                            </div>
                            <div className="w-full flex h-[25%] border-[3px] py-2 color-border-brown1 color-text-textcolor items-center my-2">
                                <div className="mx-6">사과</div>
                                <p>맛있으면 또 먹지</p>
                            </div>
                            <div className="w-full flex h-[25%] border-[3px] py-2 color-border-brown1 color-text-textcolor items-center my-2">
                                <div className="mx-6">사과</div>
                                <p>맛있으면 또 먹지</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start my-4"></div>
                        <div
                            className="absolute text-3xl flex items-center justify-center text-white -top-10 -right-10 w-16 h-16 border-[6px] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                            onClick={() => {
                                closeChangeTitle();
                            }}
                        >
                            X
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
