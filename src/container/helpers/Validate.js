/* eslint-disable no-useless-escape */
export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
export function validatePhone(phone) {
    const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return re.test(String(phone));
}

export function validateUrl(url) {
    const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return re.test(String(url));
}

export function validateYoutubeUrl(url) {
    const re = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    return re.test(String(url));
}

// lấy id của video youtube
export function youtubeParser(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
}

// lấy id của video youtube VD: https://zingmp3.vn/bai-hat/Hai-Vi-Sao-Lac-Tra-Ngoc-Hang-Manh-Quynh/ZWAFZ8I7.html
// export function zingMp3Parser(url) {
//     const regExp = /^.*((zingmp3.vn\/)?([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[7].length === 11 ? match[7] : false;
// }
