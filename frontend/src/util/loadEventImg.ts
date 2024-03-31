export function loadEventImg(eventName: string) {
    switch (eventName) {
        case '폭우':
            return '/src/assets/images/event/heavy rain.webp';
        case '폭염':
            return '/src/assets/images/event/heatwave.webp';
        case '폭설':
            return '/src/assets/images/event/heavy snow.webp';
        case '한파':
            return '/src/assets/images/event/cold wave.webp';
        case '가뭄':
            return '/src/assets/images/event/drought.webp';
        case '우박':
            return '/src/assets/images/event/hail.webp';
        case '풍작':
            return '/src/assets/images/event/bumper crop.webp';
        case '흉작':
            return '/src/assets/images/event/bad harvest.webp';
        case '사회이슈':
            return '/src/assets/images/event/society issue.webp';
        default:
            return '/src/assets/images/event/society issue.webp';
    }
}
