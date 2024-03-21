import { MouseEventHandler, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeNickname } from '../../api/user';
import { httpStatusCode } from '../../util/http-status';
import { userNicknameState } from '../../util/myprofile-slice';
import {Event} from "../../type/types.ts";

interface PropType {
    closeModal: MouseEventHandler<HTMLDivElement>;
    nickName: string;
}

export default function NicknameChangeModal(props: PropType) {
    const [nickName, setNickName] = useState<string>(props.nickName);

    const updateName = (event: Event) => {
        setNickName(event.target.value);
    };

    const dispatch = useDispatch();

    const sendChangeRequest = () => {
        changeNickname(nickName)
            .then((res) => {
                if (res.status === httpStatusCode.OK) {
                    dispatch(userNicknameState(nickName));
                    console.log('Success');
                } else {
                    console.log('Fail');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="absolute w-[60%] h-[50%] color-text-textcolor border-[0.2vw] color-border-brown1 color-bg-main z-50 animation-modal p-[1vw] flex flex-col justify-around items-center">
                <div className="w-[90%] flex justify-start">
                    <h1 className="text-[3vw]">닉네임 변경</h1>
                </div>
                <input
                    type="text"
                    className="w-[90%] h-[30%] text-[2vw] p-[1vw]"
                    value={nickName}
                    onChange={updateName}
                />
                <div
                    className="text-[2vw] w-[30%] h-[30%] bg-black text-white mt-[1vh] flex justify-center items-center cursor-pointer"
                    onClick={sendChangeRequest}
                >
                    변경하기
                </div>
                <div
                    className="absolute text-[1.3vw] flex items-center justify-center text-white top-[0.2vw] right-[0.2vw] w-[3vw] h-[3vw] border-[0.2vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer"
                    onClick={props.closeModal}
                >
                    X
                </div>
            </div>
        </>
    );
}
