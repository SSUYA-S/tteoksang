import { SetStateAction } from 'react';

type NewsType = {
    setNewsFlag: React.Dispatch<SetStateAction<boolean>>;
};
export default function NewsModal(props: NewsType) {
    const closeNewsModal = () => {
        props.setNewsFlag(false);
    };
    return (
        <div className="absolute w-[70%] h-[95%] animation-modal ">
            <div className="h-[15%]"></div>
            <div
                className="relative w-full h-[85%] flex flex-col items-center justify-start text-black"
                style={{ backgroundColor: '#ececec' }}
            >
                <div className="relative w-[90%] h-[35%] flex flex-col items-center">
                    <p className="h-[50%] text-[4.5vw] flex items-center">
                        NEWSLETTER
                    </p>
                    <div className="w-full h-[50%] flex flex-col items-center">
                        <p className="w-full h-[0.2vw] bg-black"></p>
                        <p className="my-[0.4vw] text-[2.4vw]">
                            2023년 4월 6일호
                        </p>
                        <p className="w-full h-[0.2vw] bg-black"></p>
                    </div>
                    <div
                        className="absolute text-[2.6vw] cursor-pointer top-[1.6vw] right-[0vw]"
                        onClick={() => {
                            closeNewsModal();
                        }}
                    >
                        X
                    </div>
                </div>

                <div className="relative w-[90%] h-[65%] flex ">
                    <div className="w-[60%] h-full">
                        <div className="w-full h-[50%]  text-start text-[3.6vw]">
                            <p>중국에서 황사 발생</p>
                        </div>
                        <div className="w-full h-[40%]  text-start text-[2vw]">
                            <div>게임회사 어서오-십조, KOSPI 상장</div>
                        </div>
                    </div>

                    <div className="w-[40%] h-[90%] b text-start text-[2.4vw]">
                        한미 FTA체결
                    </div>
                </div>
            </div>
        </div>
    );
}
