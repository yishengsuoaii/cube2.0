function simplifySecond(seconds) {

    const date = new Date(seconds * 1000);

    return {
        days: String(date.getUTCDate() - 1).padStart(2, '0'),
        hours: String(date.getUTCHours()).padStart(2, '0'),
        minutes: String(date.getUTCMinutes()).padStart(2, '0'),
        seconds: String(date.getUTCSeconds()).padStart(2, '0')
    };

}

function throttle (fn, delay, debounce) {

    let currCall;
    let lastCall = 0;
    let lastExec = 0;
    let timer = null;
    let diff;
    let scope;
    let args;
    let debounceNextCall;

    delay = delay || 0;

    function exec () {
        lastExec = (new Date()).getTime();
        timer = null;
        fn.apply(scope, args || []);
    }

    let cb = function () {
        currCall = (new Date()).getTime();
        scope = this;
        args = arguments;
        let thisDelay = debounceNextCall || delay;
        let thisDebounce = debounceNextCall || debounce;
        debounceNextCall = null;
        diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;

        clearTimeout(timer);

        if (thisDebounce) {
            timer = setTimeout(exec, thisDelay);
        }
        else {
            if (diff >= 0) {
                exec();
            }
            else {
                timer = setTimeout(exec, -diff);
            }
        }

        lastCall = currCall;
    };

    /**
     * Clear throttle.
     * @public
     */
    cb.clear = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    /**
     * Enable debounce once.
     */
    cb.debounceNextCall = function (debounceDelay) {
        debounceNextCall = debounceDelay;
    };

    return cb;
}

function getFormatTime(time) {
    const times = simplifySecond(time < 0 ? 0 : time)

    return [
        times.hours,
        times.minutes,
        times.seconds
    ].join(':')
}

/**
 * 将秒转换为[HH, MM, SS]格式数组
 * @param time
 * @return {array}
 */
function getFormatTimeArr(time) {
    const times = simplifySecond(time < 0 ? 0 : time)

    return [
        times.hours,
        times.minutes,
        times.seconds
    ]
}

/**
 * 将[HH, MM, SS]格式数组转换为秒
 * @param timeArr
 * @return {number}
 */
 function restoreTimeFromTimeArr(timeArr) {
    const time = +timeArr[0] * 3600 + +timeArr[1] * 60 + +timeArr[2]
    return time > 0 ? time : 0
}

/**
 * 将HH:MM:SS格式字符串转换为秒
 * @param timeStr
 * @return {number}
 */
 function restoreOriginalTime(timeStr) {
    const timeArr = timeStr.split(':')
    if (timeArr.length !== 3
        || timeArr[0].length !== 2
        || timeArr[1].length !== 2
        || timeArr[2].length !== 2) {
        return 0
    }
    const time = timeArr[0] * 3600 + timeArr[1] * 60 + timeArr[2]
    return time > 0 ? time : 0
}
