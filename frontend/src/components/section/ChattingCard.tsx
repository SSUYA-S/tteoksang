import { Chat } from '../../type/types';

interface Props {
    chat: Chat;
}

export default function ChattingCard(props: Props) {
    return (
        <div className="w-[90%] h-fit flex my-[0.5vw] rounded p-[0.2vw]">
            <div className="relative w-[14%] aspect-square">
                <img
                    className="absolute w-[4vw] h-[4vw] object-cover"
                    src={`/src/assets/images/profile/icon (${props.chat.profileIconId}).png`}
                    alt=""
                    style={{ aspectRatio: 1 / 1 }}
                />
                <img
                    className="absolute w-[4vw] h-[4vw] object-cover"
                    src={`/src/assets/images/profile/frame (${props.chat.profileFrameId}).png`}
                    alt=""
                    style={{ aspectRatio: 1 / 1 }}
                />
            </div>
            <div className="relative flex flex-col w-[80%] h-fit">
                <div className="text-[1.6vw] h-[30%] break-all flex justify-start items-center pl-[0.5vw] text-start color-bg-sublight text-white rounded-tr-[0.8vw]">
                    <p>{props.chat.userNickname}</p>
                </div>
                <div className="text-[1.4vw] break-all overflow-y-auto flex justify-start items-center pl-[0.5vw] text-start bg-white border-[0.2vw] color-border-sublight rounded-b-[0.6bw]">
                    <p>{props.chat.message}</p>
                </div>
            </div>
        </div>
    );
}
