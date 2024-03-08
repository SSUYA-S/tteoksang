import { useState } from 'react';
import GameStartComponent from '../components/GameStartComponent';
import GameComponent from '../components/GameComponent';

export default function MainPage() {
    const [startFlag, setStartFlag] = useState<boolean>(false);
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
