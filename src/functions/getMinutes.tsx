export default function getMinutes(time : number) {
    return (time - (time % 60)) / 60;
}