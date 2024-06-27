
export const dateFormat = (ms) => {

    const unixTimestamp = ms; 

    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}.${month}.${day} в ${hours}:${minutes}`
}