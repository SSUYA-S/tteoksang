import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginPage() {
    const navigate = useNavigate();
    useEffect(() => {
        console.log('Hello');
    }, []);

    return (
        <>
            <h1>Hello</h1>
        </>
    );
}
