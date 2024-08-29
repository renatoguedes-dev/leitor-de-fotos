function getMeasureMonth(date: string) {
    const monthAsNumber = parseInt(date.split("-")[1]);
    let monthIsValid = true;
    if (monthAsNumber < 0 || monthAsNumber > 12) {
        monthIsValid = false;
    }
    const measureMonth = date.split("-")[1];

    return { measureMonth, monthIsValid };
}

export default getMeasureMonth;
