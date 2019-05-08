let seed = Math.random();
let seedStack = [seed];
let debugSeed = 1.1596787388606669;

function nextSeed() {
	if (DEBUG) {
		return debugSeed++;
	}
	let next = ++seed;
	seedStack.push(next);
	return next;
}

function rand(n, m) {
    if (!m) return Math.floor(random() * n);
    return Math.floor(n + (1 + m - n) * random());
}

function random() {
	let seed = nextSeed();
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
