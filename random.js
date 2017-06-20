var seed = Math.random();
var seedStack = [seed];
var debugSeed = 1.1596787388606669;

function nextSeed() {
	if (DEBUG) {
		return debugSeed++;
	}
	var next = ++seed;
	seedStack.push(next);
	return next;
}

function rand(n, m) {
    if (!m) return Math.floor(random(seed) * n);
    return Math.floor(n + (1 + m - n) * random(seed));
}

function random(seed) {
	var seed = nextSeed();
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}
