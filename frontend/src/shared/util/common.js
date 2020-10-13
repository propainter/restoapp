
export const getPrettyDate = (dateFromBackend) => {
    if(dateFromBackend === 'just now') return dateFromBackend;
    let d = new Date(dateFromBackend);
    return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}
