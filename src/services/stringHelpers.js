export const truncateString = (text, length, clamp) => {
    let txt = text || '';
    let cl = clamp || '...';
    let l = length || 100;
    let t = txt.length > l ? txt.substring(0, l) + cl : txt;
    return t;
};

export const fixBrokenHtml = string => {
    return new DOMParser().parseFromString(string, 'text/html').body.innerHTML;
};

export const searchInWord = (keyword, word) => {
    return word.search(new RegExp(keyword, 'i')) !== -1;
};

export const constructQueryString = queryItems => {
    return queryItems
        .filter(item => item.value)
        .map(item => `${item.name}=${item.value}`)
        .join('&');
};

// export const fixHtmlImageSource = html => {
//     let element = document.createElement('div');
//     element.innerHTML = html;
//     let imgSrcUrls = element.getElementsByTagName('img');

//     for (let i = 0; i < imgSrcUrls.length; i++) {
//         let urlValue = imgSrcUrls[i].getAttribute('src');
//         if (urlValue) {
//             imgSrcUrls[i].setAttribute('src', imageLink(urlValue));
//         }
//     }
//     return element.outerHTML;
// };

export const stringToArrayStructure = (str, delimiter = ',') => {
    return str.split(delimiter).map(item => String(item).trim());
};

export const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
export function dateToIsoConverter(date) {
    return date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
}
