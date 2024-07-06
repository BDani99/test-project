export function getYesterday() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return formatDate(yesterday);
}

export function getMaxToDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
        month = `0${month}`;
    }

    if (day < 10) {
        day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
}

export function calculateDateDifference(fromDate, toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

export function onDateChange(fromDate, toDate, maxToDate, setInternalFromDate, setInternalToDate, emit) {
    if (new Date(toDate) > new Date()) {
        setInternalToDate(maxToDate);
    } else {
        setInternalToDate(toDate);
    }
    setInternalFromDate(fromDate);
    emit("fetch-data", fromDate, toDate);
}


export function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
}



