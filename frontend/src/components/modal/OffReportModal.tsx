// import { useEffect, useRef, useState } from 'react';
// import RentFeeModal from './RentFeeModal';
// import { Title, Event, Product, OfflineReportType } from '../../type/types';
// import { useSelector } from 'react-redux';
// import TitleChangeModal from './TitleChangeModal';
// import { Client } from '@stomp/stompjs';

// //dummy data(test 후 비활성화 필요)
// import Off from '../../dummy-data/report/offline.json';

// interface Prop {
//     titleList: Title[];
//     eventList: Event[];
//     productList: Product[];
//     setIsOffReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
//     webSocketId: string;
//     webSocketClient: Client;
//     offReport: OfflineReportType;
//     setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
// }

export default function OffReportModal(props: Prop) {
    // const [mode, setMode] = useState<number>(0);
    // const [year, setYear] = useState<number>(0);
    // const [season, setSeason] = useState<string>('봄');
    // const [eventDescription, setEventDescription] = useState<string>('');
    // const [cropName, setCropName] = useState<string>('');
    // const [cropSeason, setCropSeason] = useState<string>('');

    // const eventDescRef = useRef<HTMLDivElement>(null);
    // const cropDescRef = useRef<HTMLDivElement>(null);

    // //test 종료 후 이거 풀어
    // // const Off = props.qtrReport;

    // /**이벤트 이미지 호버링하면 출력 */
    // const hoverEventImg = (eventId: number) => {
    //     setEventDescription(eventId + '이벤트 발동');
    //     if (eventDescRef.current) {
    //         eventDescRef.current.style.opacity = '100';
    //         eventDescRef.current.style.transition = 'linear 0.5s';
    //         eventDescRef.current.style.zIndex = '30';
    //     }
    // };

    // /**이벤트 이미지 호버링 끝나면 출력 */
    // const endHoverEvent = () => {
    //     if (eventDescRef.current) {
    //         eventDescRef.current.style.opacity = '0';
    //         eventDescRef.current.style.transition = 'linear 0.5s';
    //         eventDescRef.current.style.zIndex = '-20';
    //     }
    // };

    // /**작물 이미지 호버링 시 출력 */
    // const hoverCropImg = (cropId: number) => {
    //     const crop: Product = props.productList[cropId - 1];
    //     setCropName(crop.productName);
    //     switch (crop.productType) {
    //         case 'SPRING':
    //             setCropSeason('봄');
    //             break;
    //         case 'SUMMER':
    //             setCropSeason('여름');
    //             break;
    //         case 'FALL':
    //             setCropSeason('가을');
    //             break;
    //         case 'WINTER':
    //             setCropSeason('겨울');
    //             break;
    //         case 'ALL':
    //             setCropSeason('연중 내내');
    //             break;
    //     }
    //     if (cropDescRef.current) {
    //         cropDescRef.current.style.opacity = '100';
    //         cropDescRef.current.style.transition = 'linear 0.5s';
    //         cropDescRef.current.style.zIndex = '30';
    //     }
    // };

    // /**작물 이미지 호버링 끝나면 출력 */
    // const endHoverCrop = () => {
    //     if (cropDescRef.current) {
    //         cropDescRef.current.style.opacity = '0';
    //         cropDescRef.current.style.transition = 'linear 0.5s';
    //         cropDescRef.current.style.zIndex = '-20';
    //     }
    // };

    // //title 가져오기
    // const titleId = useSelector(
    //     (state: any) => state.reduxFlag.myProfileSlice.title
    // );

    // /**rentFeeModal에서 확인 누르면 보고서 보여지도록 만들기 */
    // const showReport = () => {
    //     setMode(1);
    // };

    // useEffect(() => {
    //     /**날짜 계산 */
    //     const turn = Off.turn - 91;
    //     setYear(Math.floor((turn + 60) / 360));
    //     const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
    //     if (month === 3) {
    //         setSeason('봄');
    //     } else if (month === 6) {
    //         setSeason('여름');
    //     } else if (month === 9) {
    //         setSeason('가을');
    //     } else {
    //         setSeason('겨울');
    //     }
    // }, []);

    // /**파산 시 게임 종료 */
    // const endGame = () => {
    //     const webSocketId = props.webSocketId;
    //     const client = props.webSocketClient;

    //     //게임 포기 요청 보내기(webSocket)
    //     client.publish({
    //         destination: `/app/private/${webSocketId}`,
    //         body: JSON.stringify({
    //             type: 'GIVEUP_GAME',
    //             body: {},
    //         }),
    //     });

    //     //웹소켓 통신 비활성화
    //     client.publish({
    //         destination: `/app/private/${webSocketId}`,
    //         body: JSON.stringify({
    //             type: 'QUIT_GAME',
    //             body: {},
    //         }),
    //     });
    //     client.deactivate();

    //     //메인 화면으로 나가기
    //     props.setStartFlag(false);
    // };

    return <></>;
}
