export const getFormattedDate = (date: Date): string => {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    return `${date.getFullYear()}-${month}-${day}`;
}