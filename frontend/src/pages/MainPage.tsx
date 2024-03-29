import { useEffect, useState } from 'react';
import GameStartComponent from '../components/GameStartComponent';
import GameComponent from '../components/GameComponent';
import {
    resourceAchievement,
    resourceChecksum,
    resourceEvent,
    resourceInfra,
    resourceMessageType,
    resourceProduct,
    resourceProfileFrame,
    resourceProfileIcon,
    resourceTheme,
    resourceTitle,
} from '../api/resource';
import {
    AchievementList,
    ChecksumList,
    InitialData,
    NewChecksum,
} from '../type/types';
import { AxiosResponse } from 'axios';
import { createMD5 } from '../util/createMD5';
import { deleteResourceAPICacheKey } from '../util/controllServiceWorker';

export default function MainPage() {
    const [startFlag, setStartFlag] = useState<boolean>(false);
    const [checksumData, setChecksumData] = useState<ChecksumList>({
        checksumList: [],
    });
    const [newChecksumData, setNewChecksumData] = useState<NewChecksum>({
        achievement: '',
        event: '',
        infra: '',
        messageType: '',
        product: '',
        profileFrame: '',
        profileIcon: '',
        theme: '',
        title: '',
    });
    const [achievement, setAchievement] = useState<AchievementList>();
    const [initialData, setInitialData] = useState<InitialData>({
        achievementList: [],
        titleList: [],
        themeList: [],
        productList: [],
        eventList: [],
        infraList: {
            warehouseInfoList: [],
            brokerInfoList: [],
            vehicleInfoList: [],
        },
        messageTypeList: [],
        profileIconList: [],
        profileFrameList: [],
    });
    useEffect(() => {
        const loadChecksumAPI = async () => {
            await resourceChecksum().then((res) => {
                setChecksumData(res.data);
            });
        };
        loadChecksumAPI();
    }, []);

    useEffect(() => {
        const resourceCall = [
            resourceAchievement(),
            resourceEvent(),
            resourceInfra(),
            resourceMessageType(),
            resourceProduct(),
            resourceProfileFrame(),
            resourceProfileIcon(),
            resourceTheme(),
            resourceTitle(),
        ];
        Promise.all(resourceCall).then((result) => {
            result.map((item) => {
                const objectKey = Object.keys(item.data);
                // console.log(item.data);

                // 데이터 저장
                pushInitialData(objectKey.toString(), item);
                const hashMD5 = createMD5(JSON.stringify(item.data));
                changeNewChecksum(objectKey.toString(), hashMD5);

                // console.log(hashMD5);
            });
        });
    }, [checksumData]);

    useEffect(() => {
        if (
            newChecksumData.achievement !== '' &&
            newChecksumData.event !== '' &&
            newChecksumData.infra !== '' &&
            newChecksumData.messageType !== '' &&
            newChecksumData.product !== '' &&
            newChecksumData.profileFrame !== '' &&
            newChecksumData.profileIcon !== '' &&
            newChecksumData.theme !== '' &&
            newChecksumData.title !== ''
        ) {
            compareChecksum();
        }
    }, [newChecksumData]);

    useEffect(() => {
        console.log(initialData);
    }, [initialData]);

    const changeNewChecksum = (key: string, value: string) => {
        if (key.length >= 4) {
            key = key.slice(0, -4);
        }
        setNewChecksumData((prev) => {
            let newHash = { ...prev };
            if (
                key === 'achievement' ||
                key === 'event' ||
                key === 'infra' ||
                key === 'messageType' ||
                key === 'product' ||
                key === 'profileFrame' ||
                key === 'profileIcon' ||
                key === 'theme' ||
                key === 'title'
            ) {
                newHash[key] = value;
            }
            return newHash;
        });
    };

    const compareChecksum = () => {
        if (
            checksumData.checksumList[0].checksumValue !==
            newChecksumData.achievement
        ) {
            deleteResourceAPICacheKey('achievement');
            console.log('achievement 재요청을 보내겠습니다');
            resourceAchievement().then((res) => {
                pushInitialData('achievementList', res);
            });
        }
        if (
            checksumData.checksumList[1].checksumValue !== newChecksumData.event
        ) {
            deleteResourceAPICacheKey('event');
            console.log('event 재요청을 보내겠습니다');
            resourceEvent().then((res) => {
                pushInitialData('eventtList', res);
            });
        }
        if (
            checksumData.checksumList[2].checksumValue !== newChecksumData.infra
        ) {
            deleteResourceAPICacheKey('infra');
            console.log('infra 재요청을 보내겠습니다');
            resourceInfra().then((res) => {
                pushInitialData('infraList', res);
            });
        }
        if (
            checksumData.checksumList[3].checksumValue !==
            newChecksumData.messageType
        ) {
            deleteResourceAPICacheKey('message-type');
            console.log('messageType 재요청을 보내겠습니다');
            resourceMessageType().then((res) => {
                pushInitialData('messageTypeList', res);
            });
        }
        if (
            checksumData.checksumList[4].checksumValue !==
            newChecksumData.product
        ) {
            deleteResourceAPICacheKey('product');
            console.log('product 재요청을 보내겠습니다');
            resourceProduct().then((res) => {
                pushInitialData('productList', res);
            });
        }
        if (
            checksumData.checksumList[5].checksumValue !==
            newChecksumData.profileFrame
        ) {
            deleteResourceAPICacheKey('profile-frame');
            console.log('profileFrame 재요청을 보내겠습니다');
            resourceProfileFrame().then((res) => {
                pushInitialData('profileFrameList', res);
            });
        }
        if (
            checksumData.checksumList[6].checksumValue !==
            newChecksumData.profileIcon
        ) {
            deleteResourceAPICacheKey('profile-icon');
            console.log('profileIcon 재요청을 보내겠습니다');
            resourceProfileIcon().then((res) => {
                pushInitialData('profileIconList', res);
            });
        }
        if (
            checksumData.checksumList[7].checksumValue !== newChecksumData.theme
        ) {
            deleteResourceAPICacheKey('theme');
            console.log('theme 재요청을 보내겠습니다');
            resourceTheme().then((res) => {
                pushInitialData('themeList', res);
            });
        }
        if (
            checksumData.checksumList[8].checksumValue !== newChecksumData.title
        ) {
            deleteResourceAPICacheKey('title');
            console.log('title 재요청을 보내겠습니다');
            resourceTitle().then((res) => {
                pushInitialData('titleList', res);
            });
        }
    };
    const pushInitialData = (key: string, res: AxiosResponse<any, any>) => {
        setInitialData((prev) => ({
            ...prev,
            [key]: Object.values(res.data)[0],
        }));
    };

    return (
        <section className="w-full h-full">
            {!startFlag ? (
                <GameStartComponent
                    setStartFlag={setStartFlag}
                    achievementData={initialData.achievementList}
                    titleData={initialData.titleList}
                    profileFrameData={initialData.profileFrameList}
                    profileIconData={initialData.profileIconList}
                />
            ) : (
                <GameComponent
                    initialData={initialData}
                    setStartFlag={setStartFlag}
                />
            )}
        </section>
    );
}
