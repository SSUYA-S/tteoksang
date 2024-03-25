import { Chat } from '../../type/types';

interface Props {
    chat: Chat;
}

export default function ChattingCard(props: Props) {
    return (
        <div className="w-[90%] h-[20%] flex color-border-subbold border-[0.2vw] my-[0.5vw] rounded">
            <div className="relative w-[20%] aspect-square">
                <img
                    className="absolute w-full h-full object-cover"
                    src={`/src/assets/images/profile/icon (${props.chat.profileIconId}).png`}
                    alt=""
                    style={{ aspectRatio: 1 / 1 }}
                />
                <img
                    className="absolute w-full h-full object-cover"
                    src={`/src/assets/images/profile/frame (${props.chat.profileFrameId}).png`}
                    alt=""
                    style={{ aspectRatio: 1 / 1 }}
                />
            </div>
            <div className="flex flex-col w-[80%] h-full">
                <div className="text-2xl h-[30%] overflow-y-auto break-all flex justify-start items-center pl-[0.5vw] text-start bg-sky-400 text-white m-[0.2vw] rounded">
                    <p>{props.chat.userNickname}</p>
                </div>
                <div className="text-3xl h-[70%] overflow-y-auto break-all flex justify-start items-center pl-[0.5vw] text-start bg-white m-[0.2vw] rounded">
                    <p>{props.chat.message}</p>
                </div>
            </div>
        </div>
    );
}
