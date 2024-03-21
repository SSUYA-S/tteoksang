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
import { ChecksumList, NewChecksum } from '../type/types';
import { AxiosResponse } from 'axios';
import { createMD5 } from '../util/createMD5';
import { deleteResourceAPICacheKey } from '../util/controllServiceWorker';

export default function MainPage() {
    const [startFlag, setStartFlag] = useState<boolean>(false);
    const [checkSumData, setCheckSumData] = useState<ChecksumList>({
        checksumList: [],
    });
    const [newCheckSumData, setNewCheckSumData] = useState<NewChecksum>({
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
    useEffect(() => {
        const loadChecksumAPI = async () => {
            await resourceChecksum().then((res) => {
                setCheckSumData(res.data);
            });
        };
        loadChecksumAPI();
    }, []);

    useEffect(() => {
        if (checkSumData.checksumList.length > 0) {
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
            console.log(checkSumData);
            Promise.all(resourceCall).then((result) => {
                result.map((item) => {
                    const objectKey = Object.keys(item.data);
                    console.log(item.data);
                    const hashMD5 = createMD5(JSON.stringify(item.data));
                    changeNewChecksum(objectKey.toString(), hashMD5);

                    console.log(hashMD5);
                });
                compareChecksum();
            });
        }
    }, [checkSumData]);
    const changeNewChecksum = (key: string, value: string) => {
        if (key.length >= 4) {
            key = key.slice(0, -4);
        }
        setNewCheckSumData((prev) => {
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
        console.log(checkSumData);
        if (
            checkSumData.checksumList[0].checksumValue !==
            newCheckSumData.achievement
        ) {
            deleteResourceAPICacheKey('achievement');
            console.log('achievement 재요청을 보내겠습니다');
            resourceAchievement();
        }
        if (
            checkSumData.checksumList[1].checksumValue !== newCheckSumData.event
        ) {
            deleteResourceAPICacheKey('event');
            console.log('event 재요청을 보내겠습니다');
            resourceEvent();
        }
        if (
            checkSumData.checksumList[2].checksumValue !== newCheckSumData.infra
        ) {
            deleteResourceAPICacheKey('infra');
            console.log('infra 재요청을 보내겠습니다');
            resourceInfra();
        }
        if (
            checkSumData.checksumList[3].checksumValue !==
            newCheckSumData.messageType
        ) {
            deleteResourceAPICacheKey('messageType');
            console.log('messageType 재요청을 보내겠습니다');
            resourceMessageType();
        }
        if (
            checkSumData.checksumList[4].checksumValue !==
            newCheckSumData.product
        ) {
            deleteResourceAPICacheKey('product');
            console.log('product 재요청을 보내겠습니다');
            resourceProduct();
        }
        if (
            checkSumData.checksumList[5].checksumValue !==
            newCheckSumData.profileFrame
        ) {
            deleteResourceAPICacheKey('profileFrame');
            console.log('profileFrame 재요청을 보내겠습니다');
            resourceProfileFrame();
        }
        if (
            checkSumData.checksumList[6].checksumValue !==
            newCheckSumData.profileIcon
        ) {
            deleteResourceAPICacheKey('profileIcon');
            console.log('profileIcon 재요청을 보내겠습니다');
            resourceProfileIcon();
        }
        if (
            checkSumData.checksumList[7].checksumValue !== newCheckSumData.theme
        ) {
            deleteResourceAPICacheKey('theme');
            console.log('theme 재요청을 보내겠습니다');
            resourceTheme();
        }
        if (
            checkSumData.checksumList[8].checksumValue !== newCheckSumData.title
        ) {
            deleteResourceAPICacheKey('title');
            console.log('title 재요청을 보내겠습니다');
            resourceTitle();
        }
    };

    return (
        <section className="w-full h-full">
            {!startFlag ? (
                <GameStartComponent setStartFlag={setStartFlag} />
            ) : (
                <GameComponent />
            )}
        </section>
    );
}
