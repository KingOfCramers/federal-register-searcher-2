const multiQueue = length => {
    length = isNaN(length) || length < 1 ? 1 : length;
    const q = Array.from({ length }, () => Promise.resolve());
    let index = 0;
    const add = fn => {
        index = (index + 1) % length;
        return q[index] = q[index].then(fn);
    };
    return add;
};

const limiter = multiQueue(10);

module.exports = limiter;