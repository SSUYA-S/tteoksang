import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
        setLoginFlag(true);
    };
    const onReady = () => {
        audio.pause();
        props.setStartFlag(true);
    };

    const loginElement = () => {
        if (loginFlag) {
            return (
                <div className="w-full h-[30%] flex flex-col items-center justify-center">
                    <div
                        className="w-[100%] h-[45%] cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/etc/btn-game-resume.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            onReady();
                        }}
                    ></div>
                    <div className="h-[10%]"></div>
                    <div
                        className="w-[100%] h-[45%] cursor-pointer"
                        style={{
                            backgroundImage:
                                'url(/src/assets/images/etc/btn-game-new.png)',
                            backgroundSize: 'contain ',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => {
                            onReady();
                        }}
                    ></div>
                </div>
            );
        } else {
            return (
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
            );
        }
    };
    return (
        <section
            className="relative w-full h-full flex flex-col justify-center items-center"
            style={{
                backgroundImage:
                    'url(/src/assets/images/background/bg-start.png)',
                backgroundSize: 'contain ',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute w-[10%] h-[40%] flex flex-col justify-center items-center top-[4%] right-[0%]">
                <div
                    className="w-[50%] h-[30%] cursor-pointer z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-ranking.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div className="h-[5%]" />
                <div
                    className="w-[50%] h-[30%] cursor-pointer z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-mypage.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div className="h-[5%]" />
                <div
                    className="w-[50%] h-[30%] cursor-pointer z-10"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/icon/ui-icon-mypage.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                    onClick={() => {
                        toggle();
                    }}
                >
                    {playing ? 'Pause' : 'Play'}
                </div>
            </div>
            <div className="relative w-full h-[80%] flex flex-col justify-center items-center">
                <div
                    className="w-[100%] h-[50%]"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/etc/text-start-title.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div
                    className="w-[40%] h-[20%]"
                    style={{
                        backgroundImage:
                            'url(/src/assets/images/etc/text-start-content.png)',
                        backgroundSize: 'contain ',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>

                {loginElement()}
            </div>
        </section>
    );
}
