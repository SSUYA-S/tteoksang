import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login } from '../api/auth';
import axios from 'axios';

type startType = {
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function GameStartComponent(props: startType) {
    const [loginFlag, setLoginFlag] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [audio, setAudio] = useState(
        new Audio('/src/assets/bgm/start_theme_bgm.mp3')
    );
    const bgmSetting = useSelector((state: any) => state.reduxFlag.bgmFlag);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);

    const toggle = () => setPlaying(bgmSetting);

    const onClickLogin = () => {
        // axios
        //     .get('http://localhost:5173/api/oauth2/authorization/google')
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        // login()
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        setLoginFlag(true);
    };
    const onReady = () => {
        audio.pause();
        props.setStartFlag(true);
    };

    const loginElement = () => {
        if (loginFlag) {
            return (
                <div>
                    <img
                        className="my-3 cursor-pointer"
                        src="/src/assets/images/etc/btn-game-resume.png"
                        alt=""
                        onClick={() => {
                            onReady();
                        }}
                    />
                    <img
                        className="my-3 cursor-pointer"
                        src="/src/assets/images/etc/btn-game-new.png"
                        alt=""
                        onClick={() => {
                            onReady();
                        }}
                    />
                </div>
            );
        } else {
            return (
                <>
                    <div
                        className="bg-white border border-gray-300 rounded-full flex items-center justify-center my-24 px-4 py-2 text-2xl font-bold cursor-pointer hover:bg-slate-100"
                        onClick={() => {
                            toggle();
                            onClickLogin();
                        }}
                    >
                        <img
                            className="w-16 h-16"
                            src="/src/assets/images/etc/crop-apple.png"
                            alt=""
                        />
                        <p className="px-2">Sign in with Google</p>
                    </div>
                    <a href="http://localhost:5173/api/oauth2/authorization/google?redirect_uri='http://localhost:5173/login/oauth2/code/google&response_type=code'">
                        <img
                            className="w-16 h-16"
                            src="/src/assets/images/etc/crop-apple.png"
                            alt=""
                        />
                        <p className="px-2">Sign in with Google</p>
                    </a>
                </>
            );
        }
    };
    return (
        <section
            className="relative w-full h-full flex flex-col justify-center items-center"
            style={{
                backgroundImage:
                    'url(/src/assets/images/background/bg-start.png)',
            }}
        >
            <div className="absolute flex flex-col justify-center items-center top-[4%] right-[2%]">
                <img
                    className="relative my-2"
                    src="/src/assets/images/icon/ui-icon-ranking.png"
                    alt=""
                />
                <img
                    className="relative my-8"
                    src="/src/assets/images/icon/ui-icon-mypage.png"
                    alt=""
                />
                <div>
                    <button onClick={toggle}>
                        {playing ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <img src="/src/assets/images/etc/text-start-title.png" alt="" />
                <img
                    className="my-8"
                    src="/src/assets/images/etc/text-start-content.png"
                    alt=""
                />

                {loginElement()}
            </div>
        </section>
    );
}
