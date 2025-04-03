import { fromEvent } from 'rxjs';
import { interval, timer } from 'rxjs';
import { buffer } from 'rxjs/operators';

// Codigo hacho con revisión de copilot para arreglar bugs y dudas concepuales de los contenidos

document.addEventListener("DOMContentLoaded", () => {
    let remaining_time = 30;
    const cron = document.getElementById("cron");
    const button = document.getElementById("myButton");
    const start = document.getElementById("start");

    start.addEventListener("click", async () => {
        const source = interval(1000);
        const subscribe = source.subscribe(val => {
            remaining_time--;
            cron.innerText = remaining_time;
            if (remaining_time <= 0) {
                subscribe.unsubscribe();
            }
        });
        start.style.visibility = "hidden";
        
        const clicks = fromEvent(button, 'click');
        let times = [];
        await newTime(clicks, button, times);
    });

    button.addEventListener("click", () => changePosition(button));
});

async function newTime(clicks, button, times) {
    if (document.getElementById("cron").innerText <= 0) {
        return showResult(times);
    } else {
        const randomTime = Math.random() * 4 + 1;
        
        await new Promise (() => {
            setTimeout(() => {
                button.style.visibility = "visible";
                const time = timer(0, 10).pipe(
                    buffer(clicks)
                );
                const subscription = time.subscribe(val => {
                    console.log(`Reaction in: ${val.length / 100} seconds`);
                    subscription.unsubscribe();
                    button.style.visibility = "hidden";
                    times.push(val.length / 100);
                    return newTime(clicks, button, times);
                });
            }, randomTime * 1000);
        });
    }
}

const changePosition = (button) => {
    const windowWidth = 900;
    const windowHeight = 600;

    const randomX = Math.floor(Math.random() * (windowWidth - button.offsetWidth));
    const randomY = Math.floor(Math.random() * (windowHeight - button.offsetHeight));

    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
};

function getAverage(arr) {
    if (arr.length === 0)
        return 0;
    const sum = arr.reduce((acum, value) => acum + value, 0);
    return sum / arr.length;
}

const showResult = (times) => {
    const avarage = getAverage(times);
    document.getElementById("avarage").innerText = avarage.toFixed(2);
    document.getElementById("result").style.visibility = "visible";
}













