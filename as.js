// function miniMaxSum(arr) {
//     let iTotal = arr.length;

//     arr.sort((a, b) => a - b);
//     let min = arr.slice(0, iTotal - 1).reduce((acc, curr) => acc + curr, 0);
//     let max = arr.slice(1, iTotal).reduce((acc, curr) => acc + curr, 0);

//     console.log(min, max);
// }

// miniMaxSum([1, 2, 3, 4, 5]); // 10 14

function timeConversion(s) {
    let sHour = s.slice(0, 2);
    let sMinSec = s.slice(2, 8);
    let sAmPm = s.slice(8, 10);

    if (sAmPm === 'AM' && sHour === '12') {
        sHour = '00';
    } else if (sAmPm === 'PM' && sHour !== '12') {
        sHour = parseInt(sHour) + 12;
    }

    console.log(`${sHour}${sMinSec}`);
}


timeConversion('09:05:45PM'); // 19:05:45