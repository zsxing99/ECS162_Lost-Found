export default function dateParser(rowData) {
    let temp = new Date(rowData).toDateString().split(" ").slice(1, 3);
    if (temp[1][0] === '0') {
        temp[1] = temp[1][1];
    }
    temp = temp.join(" ");
    if (temp[temp.length - 1] === '1') {
        temp += 'st';
    } else if (temp[temp.length - 1] === '2') {
        temp += 'nd';
    } else if (temp[temp.length - 1] === '3') {
        temp += 'rd';
    } else {
        temp += 'th';
    }
    return temp;
}