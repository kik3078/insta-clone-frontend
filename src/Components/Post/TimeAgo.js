export default (val) => {
    let current = new Date();
    let previous = Date.parse(val.createdAt);
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + '초 전';
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + '분 전';
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + '시간 전';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + '일 전';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + '달 전';
    }

    else {
        return Math.round(elapsed/msPerYear ) + '년 전';
    }
}