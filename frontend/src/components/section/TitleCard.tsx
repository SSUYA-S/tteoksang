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
            <img
                className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover"
                src={`/src/assets/images/title/title(${titleInfo.titleId}).png`}
            ></img>
            <div className="text-[1.5vw]">{titleInfo.titleName}</div>
        </div>
    );
}
