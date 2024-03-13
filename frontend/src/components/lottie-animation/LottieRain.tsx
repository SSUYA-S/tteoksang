import { useEffect } from 'react';

export default function LottieRain() {
    useEffect(() => {
        // dotlottie-player 웹 컴포넌트 스크립트 로드
        const script = document.createElement('script');
        script.src =
            'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
        script.type = 'module';
        document.body.appendChild(script);

        return () => {
            // 컴포넌트가 언마운트될 때 스크립트 제거
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="lottie-start-container">
            <dotlottie-player
                src="https://lottie.host/42a23569-5516-43d8-b488-f981722f9235/cG87lhgTBh.lottie"
                background="transparent"
                speed="1"
                style={{ width: '100%', height: '100%' }}
                direction="1"
                playMode="normal"
                loop
                autoplay
            ></dotlottie-player>
        </div>
    );
}
