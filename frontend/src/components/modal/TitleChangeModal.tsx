import { useEffect, useState } from 'react';
import { QuarterReportType, Title } from '../../type/types';
import { useSelector } from 'react-redux';
import { checkMyTitle } from '../../api/user';
import { httpStatusCode } from '../../util/http-status';
import TitleCard from '../section/TitleCard';
import { Client } from '@stomp/stompjs';

interface Prop {
    setMode: React.Dispatch<React.SetStateAction<number>>;
    titleList: Title[];
    webSocketId: string;
    webSocketClient: Client;
}

export default function TitleChangeModal(props: Prop) {
    //title 가져오기
    const titleId = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.title
    );

    const [acquired, setAcquired] = useState<Title[]>([]);

    useEffect(() => {
        checkMyTitle().then((res) => {
            if (res.status === httpStatusCode.OK) {
                const newList: Title[] = [];

                // res.data.acquiredTitleList.map((titleId: number) => {
                //     newList.push(props.titleList[titleId - 1]);
                // });
                // setAcquired(newList);

                //test
                const testMap = [1, 3, 4];
                testMap.map((id: number) => {
                    newList.push(props.titleList[id - 1]);
                });
                console.log(newList);
                setAcquired(newList);
            }
        });
    }, [props.titleList]);

    /**아무것도 안하는 함수 */
    const nothing = (id: number) => {
        return;
    };

    const changeName = (id: number) => {
        //websocket요청 보내기
        //메시지 전송
        if (props.webSocketClient.connected) {
            props.webSocketClient.publish({
                destination: `/app/private/${props.webSocketId}`,
                body: JSON.stringify({
                    type: 'CHANGE_TITLE',
                    body: {
                        titleId: id,
                    },
                }),
            });
            props.setMode(1);
        }
    };

    return (
        <div className="relative w-[40%] h-[60%] border-[0.5vw] color-border-subbold bg-white z-10 cursor-pointer">
            <div className="w-full h-full flex flex-col justify-between items-center">
                <TitleCard
                    titleInfo={props.titleList[titleId - 1]}
                    clickAction={nothing}
                />
                <div className="w-[90%] h-[0.5vh] color-bg-subbold"></div>
                <div className="w-full h-[70%] overflow-y-auto flex flex-col items-center">
                    {acquired.map((title) => {
                        return (
                            <TitleCard
                                titleInfo={title}
                                clickAction={changeName}
                            />
                        );
                    })}
                </div>
            </div>
            <div
                className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                onClick={() => {
                    props.setMode(1);
                }}
            >
                X
            </div>
        </div>
    );
}
