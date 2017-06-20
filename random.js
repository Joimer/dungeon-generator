var seed = Math.random();
var seedStack = [seed];
var debug = false;
var debugSeedPos = 0;
var debugSeeds = [0.3381843762807184];
var debugSeed = 1.9767883843490351;
var debugSeed = 1.5988863916841742;
var debugSeed = 1.1596787388606669;

function nextSeed() {
	if (debug) {
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
