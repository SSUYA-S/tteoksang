import { Title } from '../../type/types';

interface Prop {
    titleInfo: Title;
    clickAction: (id: number) => void;
}

export default function TitleCard(props: Prop) {
    const titleInfo = props.titleInfo;
    return (
        <div
            className="w-[90%] h-[8vw] flex justify-start items-center"
            onClick={() => props.clickAction(titleInfo.titleId)}
        >
            {titleInfo.titleId !== 1 ? (
                <img
                    className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover rounded-full"
                    src={`/src/assets/images/title/title (${titleInfo.titleId}).png`}
                ></img>
            ) : (
                <div className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex justify-center items-center">
                    <p>칭호 없음</p>
                </div>
            )}

            <div className="text-[1.5vw]">{titleInfo.titleName}</div>
        </div>
    );
}
