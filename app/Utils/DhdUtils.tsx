// Utils.tsx

export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export const formatTimeUnit = (num: number) => num.toString().padStart(2, '0');

export const getHours = (time: string) => {
    const [hours] = time.split(':');
    return hours;
};

export const getMonthName = (monthNumber: any) => {
    const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
    if (monthNumber > 0) {
        return monthNames[monthNumber - 1];
    } else {
        monthNumber = -monthNumber
        return "闰" + monthNames[monthNumber - 1];
    }
};


export const getChineseHour = (hour: number) => {
    const hoursToChinese = [
        {range: [23, 0], name: '子时'},
        {range: [1, 2], name: '丑时'},
        {range: [3, 4], name: '寅时'},
        {range: [5, 6], name: '卯时'},
        {range: [7, 8], name: '辰时'},
        {range: [9, 10], name: '巳时'},
        {range: [11, 12], name: '午时'},
        {range: [13, 14], name: '未时'},
        {range: [15, 16], name: '申时'},
        {range: [17, 18], name: '酉时'},
        {range: [19, 20], name: '戌时'},
        {range: [21, 22], name: '亥时'},
    ];

    for (const item of hoursToChinese) {
        if (item.range.includes(hour)) {
            return item.name;
        }
    }
    return '未知时辰';
};

export const replaceCommasWithSpaces = (inputString: any) => {
    if (inputString===undefined){
        return ""
    }
    return inputString.replace(/,/g, ' ');
};
