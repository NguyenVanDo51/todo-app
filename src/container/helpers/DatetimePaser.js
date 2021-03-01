export function PaserDatetimeLocalInput(date = new Date()) {
    return `${date.getFullYear()}-${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth()}-${
        Number(date.getDate()) < 9 ? `0${date.getDate()}` : date.getDate()
    }T${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
}

export function PaserDatetime_H_M_D_M_Y(date = new Date()) {
    return `${date.getHours() < 10 ? `0${ date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${
        Number(date.getDate()) < 9 ? `0${date.getDate()}` : date.getDate()
    }/${date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth()}/${date.getFullYear()}`;
}
