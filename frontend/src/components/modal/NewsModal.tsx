import { SetStateAction, useEffect } from 'react';

// import newsData from '../../dummy-data/article.json';
import { Article } from '../../type/types';

type NewsType = {
    setNewsFlag: React.Dispatch<SetStateAction<boolean>>;
    newsPublishTurn: number;
    articleList: Article[];
    newsReceived: (turn: number, articleList: Article[]) => void;
};
export default function NewsModal(props: NewsType) {
    const closeNewsModal = () => {
        props.setNewsFlag(false);
    };

    const date = props.newsPublishTurn;
    const year = Math.floor((date + 60) / 360);
    const month = ((Math.floor(date / 30) + 2) % 12) + 1;
    const day = (date % 30) + 1;

    const articleList = props.articleList;

    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setNewsFlag(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="absolute w-[70%] h-[95%] animation-modal ">
            <div className="h-[15%]"></div>
            <div
                className="relative w-full h-[85%] flex flex-col items-center justify-start text-black rounded-[0.8vw]"
                style={{ backgroundColor: '#ececec' }}
            >
                <div className="relative w-[90%] h-[35%] flex flex-col items-center">
                    <p className="h-[50%] text-[4.5vw] flex items-center">
                        NEWSLETTER
                    </p>
                    <div className="w-full h-[50%] flex flex-col items-center">
                        <p className="w-full h-[0.2vw] bg-black"></p>
                        <p className="my-[0.4vw] text-[2.4vw]">
                            {year}년 {month}월 {day}일호
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
                            <p>{articleList[0].articleHeadline}</p>
                        </div>
                        <div className="w-full h-[40%]  text-start text-[2vw]">
                            <div>{articleList[1].articleHeadline}</div>
                        </div>
                    </div>

                    <div className="w-[40%] h-[90%] b text-start text-[2.4vw]">
                        {articleList[2].articleHeadline}
                    </div>
                </div>
            </div>
        </div>
    );
}
