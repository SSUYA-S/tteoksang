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
                    <p className="h-[50%] text-8xl flex items-center">
                        NEWSLETTER
                    </p>
                    <div className="w-full h-[50%] flex flex-col items-center">
                        <p className="w-full h-2 bg-black"></p>
                        <p className="my-4 text-5xl">2023년 4월 6일호</p>
                        <p className="w-full h-2 bg-black"></p>
                    </div>
                    <div
                        className="absolute text-6xl cursor-pointer top-12 right-0"
                        onClick={() => {
                            closeNewsModal();
                        }}
                    >
                        X
                    </div>
                </div>

                <div className="relative w-[90%] h-[65%] flex bg-slate-200">
                    <div className="w-[60%] h-[40%] bg-red-200">asd</div>
                    <div className="w-[40%] bg-blue-200">asd</div>
                </div>
            </div>
        </div>
    );
}
