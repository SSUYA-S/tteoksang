import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { themeState } from '../../util/counter-slice';

interface CircularTimerProps {
    duration: number;
    ingameTime: string;
    setTurnTimer: React.Dispatch<React.SetStateAction<number>>;
    turnStartTime: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
    duration,
    ingameTime,
    setTurnTimer,
    turnStartTime,
}) => {
    const [timer, setTimer] = useState<number>(duration);
    const [percent, setPercent] = useState<number>(100);
    useEffect(() => {
        setTimer(duration - turnStartTime);
        setPercent(100);
        setTurnTimer(duration);
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => {
                let newTimer = prevTimer - 1;
                const newPercent = (newTimer / duration) * 100;
                setPercent(newPercent >= 0 ? newPercent : 0);

                //배경 바꾸기 (오토여야함)
                // console.log(newTimer);
                setTurnTimer(newTimer);

                if (newTimer <= 0) {
                    newTimer = duration;
                    setPercent((newTimer / duration) * 100);
                }
                return newTimer;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [duration, ingameTime]);

    const timerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        position: 'relative',
        background: `conic-gradient(
      rgba(255, 255, 255, 0) 0% ${percent}%, 
      #ffffff ${percent}% 100%
    )`,
        zIndex: '20',
        transform: 'scaleX(-1)',
    };

    const textContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '24px',
        color: '#2c3e50',
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${
            remainingSeconds < 10 ? '0' : ''
        }${remainingSeconds}`;
    };

    return (
        <div style={timerStyle}>
            <div style={textContainerStyle}>{/* {formatTime(timer)} */}</div>
        </div>
    );
};

export default CircularTimer;
