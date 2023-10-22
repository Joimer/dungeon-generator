let seed = Math.random();
const seedStack = [seed];
let debugSeed = 1.1596787388606669;

export function nextSeed() {
	if (window.DEBUG) {
		return debugSeed++;
	}
	let next = ++seed;
	seedStack.push(next);
	return next;
}

export function rand(n, m) {
    if (!m) return Math.floor(random() * n);
    return Math.floor(n + (1 + m - n) * random());
}

export function random() {
	let seed = nextSeed();
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
