import { SetStateAction, useEffect, useState } from 'react';

import { Article } from '../../type/types';

type NewsType = {
    newsPublishTurn: number;
    newsArticleList: Article[];
    newsFlag: boolean;
    setShowNews: React.Dispatch<SetStateAction<boolean>>;
};
export default function NewsModal(props: NewsType) {
    const closeNewsModal = () => {
        props.setShowNews(false);
    };
    const [currentNews, setCurrentNews] = useState<Article[]>([]);
    const [date, setDate] = useState<number>(0);
    let year = Math.floor((date + 60) / 360);
    let month = ((Math.floor(date / 30) + 2) % 12) + 1;
    let day = (date % 30) + 1;

    useEffect(() => {
        // ESC 키를 눌렀을 때 실행할 함수
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setShowNews(false); // ESC 키가 눌리면 컴포넌트를 안 보이게 설정
            }
        };
        console.log('뉴스임미다');
        console.log(props.newsArticleList);
        setDate(props.newsPublishTurn);
        // 컴포넌트가 마운트될 때 keydown 이벤트 리스너 추가
        document.addEventListener('keydown', handleKeyDown);
        setCurrentNews(props.newsArticleList);
        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        console.log('새신문 도착');
        console.log(props.newsArticleList);
        setDate(props.newsPublishTurn);
        setCurrentNews(props.newsArticleList);
    }, [props.newsArticleList]);

    return (
        <div className="absolute w-[70%] h-[95%] animation-modal z-20">
            <div className="h-[15%]"></div>
            <div
                className="relative w-full h-[85%] flex flex-col items-center justify-start text-black rounded-[0.8vw] pb-[2vw]"
                style={{ backgroundColor: '#ececec' }}
            >
                <div className="relative w-[90%] h-[35%] flex flex-col items-center">
                    <p className="h-[50%] text-[4.5vw] flex items-center">
                        NEWSLETTER
                    </p>
                    <div className="w-full h-[50%] flex flex-col items-center">
                        <p className="w-full h-[0.2vw] bg-black"></p>
                        <p className="my-[0.4vw] text-[2.4vw]">
                            {Math.floor((date + 60) / 360)}년{' '}
                            {((Math.floor(date / 30) + 2) % 12) + 1}월{' '}
                            {(date % 30) + 1}일호
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
                    <div className="w-[60%] h-full pe-[0.8vw]">
                        {currentNews.length > 0 ? (
                            <div className="w-full h-[55%]  text-start text-[2vw] overflow-y-scroll">
                                <p className="h-full text-ellipsis overflow-hidden">
                                    {currentNews[0].articleHeadline}
                                </p>
                            </div>
                        ) : (
                            <div className="w-full h-[55%]  text-start text-[2vw]">
                                <p>
                                    계속되는 지각 변동. 조만간 무슨 일이
                                    생길지도???
                                </p>
                            </div>
                        )}
                        {currentNews.length > 1 ? (
                            <div className="w-full h-[45%]  text-start text-[2vw] overflow-y-scroll">
                                <div>{currentNews[1].articleHeadline}</div>
                            </div>
                        ) : (
                            <div className="w-full h-[45%]  text-start text-[2vw]">
                                <div>떡상 주가 계속 상승중.</div>
                            </div>
                        )}
                    </div>
                    <div className="w-[40%] h-full">
                        {currentNews.length > 2 ? (
                            <div className="w-full h-[50%] b text-start text-[2.0vw] overflow-y-scroll">
                                {currentNews[2].articleHeadline}
                            </div>
                        ) : (
                            <div className="w-full h-[50%]  text-start text-[2vw] ">
                                <div>
                                    배추의 움직임이 심상치가 않은걸로 밝혀져
                                </div>
                            </div>
                        )}
                        {currentNews.length > 3 ? (
                            <div className="w-full h-[50%] b text-start text-[2.0vw] overflow-y-scroll">
                                {currentNews[3].articleHeadline}
                            </div>
                        ) : (
                            <div className="w-full h-[50%]  text-start text-[1.8vw] ">
                                <div>
                                    조만간 인기 아이돌 ㅇㅇㅇㅇㅇ의 데뷔가
                                    이루어질것으로 보여
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
