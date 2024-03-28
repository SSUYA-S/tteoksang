interface WarningProps {
    handleOK: () => Promise<void>;
    handleCancel: () => void;
    message: string;
    cancelMessage: string;
    okMessage: string;
}

export default function WarningModal(props: WarningProps) {
    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full z-[60] bg-black bg-opacity-70"></div>
            <div className="absolute w-[60%] h-[40%] top-[30%] left-[20%] color-bg-main color-border-subbold border-[0.2vw] z-[70] flex flex-col justify-around">
                <div className="h-[30%] text-[3vw] color-text-textcolor">
                    {props.message}
                </div>
                <div className="h-[30%] flex justify-around">
                    <div
                        className="w-[40%] h-full color-border-subbold color-text-subbold border-[0.2vw] text-[2vw] flex justify-center items-center"
                        onClick={props.handleCancel}
                    >
                        {props.cancelMessage}
                    </div>
                    <div
                        className="w-[40%] h-full color-bg-subbold color-text-main text-[2vw] flex justify-center items-center"
                        onClick={props.handleOK}
                    >
                        {props.okMessage}
                    </div>
                </div>
            </div>
        </>
    );
}
