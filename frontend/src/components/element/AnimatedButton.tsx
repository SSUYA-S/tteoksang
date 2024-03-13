import React, { useState } from 'react';

function AnimatedButton() {
    const [pushActive, setPushActive] = useState(false);

    const handleClick = () => {
        setPushActive(true);
        setTimeout(() => {
            setPushActive(false);
        }, 1000); // 1초 후에 애니메이션 상태를 비활성화합니다.
    };

    return (
        <button
            className={pushActive ? 'animation-push' : ''}
            onClick={handleClick}
        >
            클릭 애니메이션 버튼
        </button>
    );
}

export default AnimatedButton;
