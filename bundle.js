(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
const invChiSquareCDF = require('./invChiSquareCDF.js');
const invRegLowGamma = require('./invRegLowGamma.js');
const logGamma = require('./logGamma.js');
const regLowGamma = require('./regLowGamma.js');

module.exports = {
  invChiSquareCDF: (probability, degreeOfFreedom)=>invChiSquareCDF(probability, degreeOfFreedom),
  invRegLowGamma: (p, a)=>invRegLowGamma(p, a),
  logGamma: (x)=>logGamma(x),
  regLowGamma: (a, x)=>regLowGamma(a, x),
};

},{"./invChiSquareCDF.js":3,"./invRegLowGamma.js":4,"./logGamma.js":5,"./regLowGamma.js":6}],3:[function(require,module,exports){
const invRegLowGamma = require('./invRegLowGamma.js');

module.exports = function invChiSquareCDF(probability, degreeOfFreedom) {
    if(isNaN(probability)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "probability" is not an number.');
    } else if(isNaN(degreeOfFreedom)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "degreeOfFreedom" is not an number.');
    } else if (probability >= 1 || probability <= 0) {
        throw new Error('The number in param "probability" must lie in the interval [0 1].');
    } else if (degreeOfFreedom <= 0) {
        throw new Error('The number in param "degreeOfFreedom" must be greater than 0.');
    }

    return 2 * invRegLowGamma(probability, 0.5 * degreeOfFreedom);
};

},{"./invRegLowGamma.js":4}],4:[function(require,module,exports){
const logGamma = require('./logGamma.js');
const regLowGamma = require('./regLowGamma.js');

module.exports = function invRegLowGamma(p, a) {
    if(isNaN(p)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "p" is not an number.');
    } else if(isNaN(a)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param "a" is not an number.');
    } else if (p >= 1) {
        return Math.max(100, a + 100 * Math.sqrt(a));
    } else if (p <= 0) {
        return 0;
    }

    let a1 = a - 1;
    let EPS = 1e-8;
    let gln = logGamma(a);
    let inverseRegLowGamma;
    let err;
    let t;
    let u;
    let pp;
    let lna1;
    let afac;

    if (a > 1) {
        lna1 = Math.log(a1);
        afac = Math.exp(a1 * (lna1 - 1) - gln);
        pp = (p < 0.5) ? p : 1 - p;
        t = Math.sqrt(-2 * Math.log(pp));
        inverseRegLowGamma = (2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t;
        if (p < 0.5)
        inverseRegLowGamma = -inverseRegLowGamma;
        inverseRegLowGamma = Math.max(1e-3,
        a * Math.pow(1 - 1 / (9 * a) - inverseRegLowGamma / (3 * Math.sqrt(a)), 3));
    } else {
        t = 1 - a * (0.253 + a * 0.12);
        if (p < t)
        inverseRegLowGamma = Math.pow(p / t, 1 / a);
        else
        inverseRegLowGamma = 1 - Math.log(1 - (p - t) / (1 - t));
    }

    for(let j = 0; j < 12; j++) {
        if (inverseRegLowGamma <= 0)
        return 0;
        err = regLowGamma(a, inverseRegLowGamma) - p;
        if (a > 1)
        t = afac * Math.exp(-(inverseRegLowGamma - a1) + a1 * (Math.log(inverseRegLowGamma) - lna1));
        else
        t = Math.exp(-inverseRegLowGamma + a1 * Math.log(inverseRegLowGamma) - gln);
        u = err / t;
        inverseRegLowGamma -= (t = u / (1 - 0.5 * Math.min(1, u * ((a - 1) / inverseRegLowGamma - 1))));
        if (inverseRegLowGamma <= 0)
        inverseRegLowGamma = 0.5 * (inverseRegLowGamma + t);
        if (Math.abs(t) < EPS * inverseRegLowGamma)
        break;
    }

    return inverseRegLowGamma;
};

},{"./logGamma.js":5,"./regLowGamma.js":6}],5:[function(require,module,exports){
module.exports = function logGamma(x) {
    if(x===1 || x===2) {
        return 0;
    } else if(x===0) {
        return Infinity;
    } else if(isNaN(x)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error(`The value is not a number.`);
    } else if(x<0) {
        throw new Error(`The value is a negative number.`);
    }

    // Lanczos approximation
    const cof = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5,
    ];
    let ser = 1.000000000190015;

    let xx;
    let y;
    let tmp;
    tmp = (y = xx = x) + 5.5;
    tmp -= (xx + 0.5) * Math.log(tmp);

    cof.map((approximation)=>{
        ser += approximation / ++y;
    });

    return Math.log(2.5066282746310005 * ser / xx) - tmp;
};

},{}],6:[function(require,module,exports){
const logGamma = require('./logGamma.js');

module.exports = function regLowGamma(a, x) {
    if(isNaN(a)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param a is not a number.');
    } else if(isNaN(x)) {
        // TODO fix: booleans and strings like '123' will not fall here.
        throw new Error('The value in param x is not a number.');
    } else if(a <= 0) {
        throw new Error('The number in param a is equal or less tham 0.');
    } else if(x<0) {
        throw new Error('The number in param x is a negative number.');
    }

    const logGammaOfA = logGamma(a);
    let b = x + 1 - a;
    let c = 1 / 1.0e-30;
    let d = 1 / b;
    let h = d;
    let i = 1;
    const maxOfIterationsForA = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17);

    if (x < a + 1) {
        let sum = 1 / a;
        let del = sum;
        for (let ap = a; i <= maxOfIterationsForA; i++) {
            sum += del *= x / ++ap;
        }
        return (sum * Math.exp(-x + a * Math.log(x) - (logGammaOfA)));
    }

    let an;
    for (; i <= maxOfIterationsForA; i++) {
        an = -i * (i - a);
        b += 2;
        d = an * d + b;
        c = b + an / c;
        d = 1 / d;
        h *= d * c;
    }

    return (1 - h * Math.exp(-x + a * Math.log(x) - (logGammaOfA)));
};

},{"./logGamma.js":5}],7:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":8,"./lib/tychei":9,"./lib/xor128":10,"./lib/xor4096":11,"./lib/xorshift7":12,"./lib/xorwow":13,"./seedrandom":14}],8:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],9:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],10:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],11:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],12:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],13:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],14:[function(require,module,exports){
/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

// Detect the global object, even if operating in strict mode.
// http://stackoverflow.com/a/14387057/265298
var global = (0, eval)('this'),
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
} else {
  // When included as a plain script, set up Math.seedrandom global.
  math['seed' + rngname] = seedrandom;
}


// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":1}],15:[function(require,module,exports){
const designChart = require('./design-chart');

//Classe responsavel por criar as linhas utilizadas nos gráficos
class Charts {

    static createLineChart(labels, series, chartId) {

        // definindo parte transiente do grafico
        const transient = designChart.red_dataset;
        transient.data = series.transient;
        transient.label = 'transient';

        // definindo parte não transiente do grafico
        const normal = designChart.blue_dataset;
        normal.data = series.normal;
        normal.label = 'normal';

        const datasets = [transient, normal]

        var ctx = document.getElementById(chartId);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: designChart.chartOptions
        });
    }
}

module.exports = Charts;
},{"./design-chart":16}],16:[function(require,module,exports){
//Codigo apenas contendo informacoes visuais de exibicao e estilizacao
//dos graficos
module.exports = {
    red_dataset: {
        label: "",
        lineTension: 0.3,
        backgroundColor: "rgba(236, 100, 75, 0.05)",
        borderColor: "rgba(236, 100, 75, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(236, 100, 75, 1)",
        pointBorderColor: "rgba(236, 100, 75, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "yellow",
        pointHitRadius: 10,
        pointBorderWidth: 1,
        data: null,
    },
    blue_dataset: {
        label: "",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "yellow",
        pointHitRadius: 10,
        pointBorderWidth: 1,
        data: null,
    },
    chartOptions: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: true,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    maxTicksLimit: 5,
                    padding: 10,
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
                title: () => {
                    return 'Nq : #Fregueses'
                },
                label: (tooltipItem, chart) => {
                    return tooltipItem.yLabel + ' : ' + tooltipItem.xLabel;
                }
            }
        }
    }
}
},{}],17:[function(require,module,exports){
const Charts = require('./charts');

//Classe responsavel por criacao da tabela com metricas
class Interface {

    // Adiciona uma linha ao final da tabela indicada.
    static addTableRow(tableId, obj) {
        let table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        let newRow = table.insertRow(-1);
        let dataRow = '';
        for (const prop in obj) {
            dataRow += `<td style="text-align: center">${obj[prop]}</td>`
        }
        newRow.innerHTML = dataRow;
    }

    // Retorna o valor dos inputs do html. Caso tenha algum erro, retorna valores padrao [FCFS, 0.2, 3200, 1000].
    static getInputValues() {
        const inputDisciplina = document.getElementById('input-disciplina');
        const inputDisciplinaValue = inputDisciplina.options[inputDisciplina.selectedIndex].value;
        const inputRhoValue = document.getElementById('input-rho').value;
        const inputRodadasValue = document.getElementById('input-rodadas').value;
        const inputFreguesesValue = document.getElementById('input-fregueses').value;
        const inputTransienteValue = document.getElementById('input-transiente').value;
        

        return {
            'disciplina': inputDisciplinaValue || 'FCFS',
            'rho': inputRhoValue || 0.2,
            'rodadas': inputRodadasValue || 3200,
            'fregueses': inputFreguesesValue || 1000,
            'transiente': inputTransienteValue || 15000
        }
    }

    // Limpa conteudo da tabela indicada.
    static clearTable(tableId) {
        document.getElementById(tableId).getElementsByTagName('tbody')[0].innerHTML = "";
    }
  

    //Preenche tabela de metricas por rodada
    //Nessa funcao foi estabelecido um teto para elementos na tabela, para que nao se perdesse
    //muito tempo renderizando muitos dados. O limite de dados na tabela e 100 linhas.
    static fillMetricasTable(stats, numeroRodadas) {
	let limiteRodadasBase = 50;
	let passo = numeroRodadas <= limiteRodadasBase*2 ? 1 : Math.trunc(numeroRodadas/limiteRodadasBase);
	console.log(passo);
        for (let i = 0; i < stats.perRound.length; i+=passo) {
            const s = stats.perRound[i];
            // ordem no html: round, (avg e var)(x, w, t, nq)
            let statsValues = [s.round, s.X.avg, s.X.var, s.W.avg, s.W.var, s.T.avg, s.T.var, s.Nq.avg, s.Nq.var];
            this.addTableRow('metricas-table', statsValues);
        }
    }

    // Cria grafico canvas com parte transiente
    static createLineChart(nTotal, dataPerTime, nPoints, chartId, chartAreaId) {
        
        // remove canvas antigo
        let oldcanv = document.getElementById(chartId);
        let canvarea = document.getElementById(chartAreaId);
        canvarea.removeChild(oldcanv);

        // cria canvas novo
        let newcanv = document.createElement('canvas');
        newcanv.id = chartId;
        canvarea.appendChild(newcanv);

        let labelArray = [];
        let interval = nTotal / nPoints;

        for (let i = 0; i < nPoints; i++) {
            labelArray[i] = i * interval;
        }

        const transientPoints = Math.round(nPoints / 7);

        Charts.createLineChart(
            labelArray, {
                // 'transient': dataPerTime.slice(0, transientPoints),
                'transient': null,
                // 'normal': Array(transientPoints - 1).fill(null).concat(dataPerTime.slice(transientPoints, nPoints))
                'normal': dataPerTime
            },
            chartId
        );
    }


    // Preenche tabela de Intervalo de confianca
    // ordem no html: parametro, tipo, precisao, centro, [ic]
    static fillICTable(stats) {
        // E[W]
        let ictEW = stats.W.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[W]',
                't-student',
                `${(ictEW.precision).toFixed(2)}%`,
                `${(ictEW.high+ictEW.low)/2}`,
                `Entre <b>${ictEW.high}</b> e <b>${ictEW.low}</b>`,
            ],
        )
        // Var[W] tstudent
        let ictVW = stats.vW.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W]',
                't-student',
                `${(ictVW.precision).toFixed(2)}%`,
                `${(ictVW.high+ictVW.low)/2}`,
                `Entre <b>${ictVW.high}</b> e <b>${ictVW.low}<b>`,
            ],
        )
        // Var[W] chi2
        let icc2VW = stats.vW.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[W]',
                'chi²',
                `${(icc2VW.precision).toFixed(2)}%`,
                `${(icc2VW.high+icc2VW.low)/2}`,
                `Entre <b>${icc2VW.high}</b> e <b>${icc2VW.low}</b>`,
            ],
        )
        // E[Nq]
        let ictENq = stats.Nq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'E[Nq]',
                't-student',
                `${(ictENq.precision).toFixed(2)}%`,
                `${(ictENq.high+ictENq.low)/2}`,
                `Entre <b>${ictENq.high}</b> e <b>${ictENq.low}</b>`,
            ],
        )
        // Var[Nq] tstudent
        let ictVNq = stats.vNq.getTStudentConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq]',
                't-student',
                `${(ictVNq.precision).toFixed(2)}%`,
                `${(ictVNq.high+ictVNq.low)/2}`,
                `Entre <b>${ictVNq.high}</b> e <b>${ictVNq.low}</b>`,
            ],
        )
        // Var[Nq] chi2
        let icc2VNq = stats.vNq.getChi2ConfidenceInterval();
        this.addTableRow('ic-table',
            [
                'Var[Nq]',
                'chi²',
                `${icc2VNq.precision.toFixed(2)}%`,
                `${(icc2VNq.high+icc2VNq.low)/2}`,
                `Entre <b>${icc2VNq.high}</b> e <b>${icc2VNq.low}</b>`,
            ],
        )
    }
}

module.exports = Interface;

},{"./charts":15}],18:[function(require,module,exports){
const seedrandom = require('seedrandom');
const chi2inv = require('inv-chisquare-cdf');
const random = seedrandom('semente');
//Classe contendo funções úteis para o programa
module.exports = {

    //Função que retorna um número aleatório exponencial
    getRandomExp: (rate) => {
        return -Math.log(1 - random()) / rate;
    },

    getDeterministic: (rate) => {
        return 1/rate;
    },

    alternate: (values) => {
        let i = -1;
        return (rate) => {
            while (true) {
                i += 1;
                if (i >= values.length) {
                    i = 0;
                }
                return values[i];
            }
        };
    },

    
    getInverseChiSquaredCDF(probability, degreeOfFreedom) {
        return chi2inv.invChiSquareCDF(probability, degreeOfFreedom);
    }
};

},{"inv-chisquare-cdf":2,"seedrandom":7}],19:[function(require,module,exports){
//Classe representando uma First Come First Served
class FCFSQueue {

    //Fila inicializada vazia
    constructor() {
        this.queue = [];
    }

    //Coloca um fregues na fila
    put(elt) {
        return this.queue.unshift(elt);
    }

    //Olha o ultimo fregues da fila.
    peek() {
        return this.queue[this.queue.length - 1];
    }

    //Retira o proximo fregues a ser atendido.
    get() {
        return this.queue.pop();
    }

    //Retorna o tamanho da fila
    length() {
        return this.queue.length;
    }
}

module.exports = FCFSQueue;
},{}],20:[function(require,module,exports){
//Classe representando uma Last Come First Served
class LCFSQueue {

    //Fila inicializada vazia
    constructor() {
        this.queue = [];
    }

    //Coloca um fregues na fila
    put(elt) {
        return this.queue.push(elt);
    }

    //Olha o ultimo fregues da fila. No caso o proximo a ser atendido.
    peek() {
        return this.queue[0];
    }

    //Retira o proximo fregues a ser atendido.
    get() {
        return this.queue.pop();
    }

    //Retorna o tamanho da fila
    length() {
        return this.queue.length;
    }
}

module.exports = LCFSQueue;

},{}],21:[function(require,module,exports){
const utils = require('../Helpers/utils');

class ArrivalGenerator {
    constructor(rate, distribution = utils.getRandomExp, time = 0) {
        this.rate = rate;
        this.distribution = distribution;
        this.time = time;
    }

    getNext() {
        this.time += this.distribution(this.rate);
        return this.time;
    }
}

module.exports = ArrivalGenerator;

},{"../Helpers/utils":18}],22:[function(require,module,exports){
const utils = require('../Helpers/utils');

class Server {
    constructor(rate, distribution = utils.getRandomExp) {
        this.rate = rate;
        this.distribution = distribution;
        this.exitTime = Infinity;
        this.currentElement = null;
    }

    enter(time, elt) {
        elt.entryTime = time;
        elt.exitTime = time + this.distribution(this.rate);
        this.currentElement = elt;
        this.exitTime = elt.exitTime;
    }

    getState() {
        if (this.currentElement != null) {
            return {
                status: 'full',
                exitTime: this.exitTime,
            };
        } else {
            return {
                status: 'empty'
            };
        }
    }

    getExitTime() {
        return this.exitTime;
    }

    exit() {
        let out = this.currentElement;
        this.currentElement = null;
        this.exitTime = Infinity;

        return out;
    }
}

module.exports = Server;

},{"../Helpers/utils":18}],23:[function(require,module,exports){
const LCFSQueue = require('../Queues/lcfs');
const FCFSQueue = require('../Queues/fcfs');

const StatsCollector = require('../Statistics/stats-collector');

const Server = require('./server');
const ArrivalGenerator = require('./arrival-generator');

const utils = require('../Helpers/utils');

function queueToServer(time, queue, server) {
    let elt = queue.get();
    server.enter(time, elt);
}

function arrivalToQueue(time, queue, round) {
    queue.put({
        round: round,
        arrivalTime: time
    });
}

function exitServer(server) {
    return server.exit();
}

function calcNumberOfPoints(numFregueses, numRodadas) {
    let numPontos = 200;
    if (numFregueses * numRodadas <= numPontos)
        numPontos = numFregueses * numRodadas;
    let intervalo = parseInt((numFregueses * numRodadas) / numPontos, 10);
    numPontos = parseInt((numFregueses * numRodadas) / intervalo, 10);
    return {
        'totalFreguesesGrafico': numFregueses * numRodadas + 1,
        'intervalo': intervalo,
        'numPontos': numPontos
    };
}

function timeToCollect(departuresTotal, intervalo, totalFreguesesGrafico) {
    return (((departuresTotal + 1) % intervalo === 0) && ((departuresTotal + 1) <= (totalFreguesesGrafico)));
}

function colectData(stats, currentTime, wIter, nqIter) {
    wIter.push(stats.rrW.getAverage().toFixed(5));
    nqIter.push(stats.rrNq.getAverage(currentTime).toFixed(5));
}

// elemento: arrivalTime, entryTime, exitTime

module.exports = {
    run: (inputs) => {
        // Inicia com os valores de input
        const numRodadas = inputs.rodadas;
        const numFregueses = inputs.fregueses;
        const numTransiente = inputs.transiente;
        const nrodadas = inputs.rodadas;

        // Determina quantos pontos serão plotados nos gráficos
        let calc = calcNumberOfPoints(numFregueses, numRodadas);

        let nqIter = [];
        let wIter = [];
        let queue = inputs.disciplina === 'FCFS' ? new FCFSQueue() : new LCFSQueue();

        // server exponencial
        let generator = new ArrivalGenerator(inputs.rho);
        let server = new Server(1);

        // server deterministico
        // let generator = new ArrivalGenerator(inputs.rho, utils.getDeterministic);
        // let server = new Server(1, utils.alternate([1.5, 0.1]));


        let stats = new StatsCollector();
        let currentTime = 0;
        let departuresTotal = 0;

        let nextArrival = generator.getNext();

        for (let i = 0; i < nrodadas; i++) {
            let arrivals = 0;
            let departures = 0;

            let queueHead = queue.peek();
            let serverState = server.getState();

            //while (arrivals < 5000) {
            while (departures < numFregueses) {
                if (serverState.status == 'empty') {
                    if (queueHead) { // se servidor esta vazio, e ha alguem na fila
                        //console.log("fila pro servidor", currentTime);
                        let nq = queue.length();
                        queueToServer(currentTime, queue, server);

                        stats.updateQueue(currentTime, nq);

                        queueHead = queue.peek();
                        serverState = server.getState();
                    } else { // servidor e fila vazios
                        //console.log("chegada pra fila - server e fila vazios", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue, i);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    }
                } else { // servidor ocupado
                    if (nextArrival <= serverState.exitTime) {
                        //console.log("chegada pra fila - server ocupado", nextArrival);
                        let nq = queue.length();
                        arrivalToQueue(nextArrival, queue, i);

                        currentTime = nextArrival;

                        stats.updateQueue(currentTime, nq);

                        nextArrival = generator.getNext();
                        queueHead = queue.peek();

                        arrivals += 1;
                    } else {
                        //console.log("saida do servidor", serverState.exitTime);
                        let nq = queue.length();
                        let elt = exitServer(server);

                        currentTime = serverState.exitTime;

                        stats.fromElement(elt, i);
                        stats.updateQueue(currentTime, nq);

                        serverState = server.getState();

                        departures += 1;

                        departuresTotal += 1;

                        if (timeToCollect(departuresTotal, calc.intervalo, calc.totalFreguesesGrafico))
                            colectData(stats, currentTime, wIter, nqIter);
                    }
                }
            }
            // console.log("arrivals", arrivals);
            // console.log("departures", departures);

            stats.nextRound(currentTime);
        }

        let resultado = {
            'stats': stats,
            'nqIter': nqIter,
            'wIter': wIter,
            'numPontos': calc.numPontos,
            'totalId': calc.numPontos * calc.intervalo
        };

        return resultado;
    }
};

},{"../Helpers/utils":18,"../Queues/fcfs":19,"../Queues/lcfs":20,"../Statistics/stats-collector":26,"./arrival-generator":21,"./server":22}],24:[function(require,module,exports){
class ContinuousEstimator {
    constructor(startTime = 0) {
        this.sum = 0;
        this.squareSum = 0;
        this.startTime = startTime;
        this.lastTime = startTime;
    }

    sample(time, value) {
        this.sum += value * (time - this.lastTime);
        this.squareSum += (value ** 2) * (time - this.lastTime);
        this.lastTime = time;
    }

    getAverage(time) {
        if (this.startTime === time) {
            return Infinity;
        }
        return this.sum / (time - this.startTime);
    }

    getVariance(time) {
        if (this.startTime === time) {
            return Infinity;
        }
        return (this.squareSum / (time - this.startTime))
            - (this.sum ** 2) / ((time - this.startTime) ** 2);
    }

    getStdDev() {
        return Math.sqrt(this.getVariance());
    }
}

module.exports = ContinuousEstimator;

},{}],25:[function(require,module,exports){
const Utils = require('../Helpers/utils')

class DiscreteEstimator {
    constructor() {
        this.sum = 0;
        this.squareSum = 0;
        this.n = 0;
    }

    sample(value) {
        this.sum += value;
        this.squareSum += value ** 2;
        this.n += 1;
    }

    getAverage() {
        if (this.n < 1) {
            return Infinity;
        }
        return this.sum / this.n;
    }

    getVariance() {
        if (this.n < 2) {
            return Infinity;
        }
        return (this.squareSum / (this.n - 1)) -
            (this.sum ** 2) / (this.n * (this.n - 1));
    }

    getStdDev() {
        return Math.sqrt(this.getVariance());
    }

    getTStudentConfidenceInterval() {
        let diff = (1.96 * this.getStdDev()) / Math.sqrt(this.n);

        return {
            high: this.getAverage() + diff,
            low: this.getAverage() - diff,
            precision: (diff/this.getAverage())*100,
        }
    }

    getChi2ConfidenceInterval() {
        const alpha = 0.05;
        let chi2Low = Utils.getInverseChiSquaredCDF(1 - (alpha / 2), this.n - 1);
        let chi2Up = Utils.getInverseChiSquaredCDF(alpha / 2, this.n - 1);

        return {
            high: (this.n - 1) * this.getAverage() / chi2Up,
            low: (this.n - 1) * this.getAverage() / chi2Low,
            precision: ((chi2Low - chi2Up) / (chi2Low + chi2Up))*100
        }
    }
}

module.exports = DiscreteEstimator;
},{"../Helpers/utils":18}],26:[function(require,module,exports){
const DiscreteEstimator = require('./discrete-estimator');
const ContinuousEstimator = require('./continuous-estimator');

//Classe responsavel por guardar instancias de estimadores e armazenar as metricas coletadas
class StatsCollector {
    constructor() {
        this.round = 0;
        this.perRound = [];
        this.resetRoundEstimators(0);

        this.rrNq = new ContinuousEstimator();
        this.rrW = new DiscreteEstimator();
        this.initEstimators();
    }

    initEstimators() {
        //Estimadores das medias de cada parametro
        this.X = new DiscreteEstimator();
        this.W = new DiscreteEstimator();
        this.T = new DiscreteEstimator();
        this.Nq = new DiscreteEstimator();

        //Estimadores das variancias de cada parametro
        this.vX = new DiscreteEstimator();
        this.vW = new DiscreteEstimator();
        this.vT = new DiscreteEstimator();
        this.vNq = new DiscreteEstimator();
    }

    saveRoundStats(time) {
        if (time != 0)
            this.perRound.push({
                'round': this.round,
                'X': {
                    'avg': this.rX.getAverage().toFixed(5),
                    'var': this.rX.getVariance().toFixed(5)
                },
                'W': {
                    'avg': this.rW.getAverage().toFixed(5),
                    'var': this.rW.getVariance().toFixed(5)
                },
                'T': {
                    'avg': this.rT.getAverage().toFixed(5),
                    'var': this.rT.getVariance().toFixed(5)
                },
                'Nq': {
                    'avg': this.rNq.getAverage(time).toFixed(5),
                    'var': this.rNq.getVariance(time).toFixed(5)
                }
            });
    }

    resetRoundEstimators(time) {
        //Salvando as metricas de cada rodada antes de resetar(menos no tempo 0 que e a inicializacao)
        this.saveRoundStats(time);

        //Reseta coletores de estatisticas dos rounds
        this.rX = new DiscreteEstimator();
        this.rW = new DiscreteEstimator();
        this.rT = new DiscreteEstimator();
        this.rNq = new ContinuousEstimator(time);
    }

    fromElement(elt, currentRound) {
        if(elt.round == currentRound) {
            this.rX.sample(elt.exitTime - elt.entryTime);
            this.rW.sample(elt.entryTime - elt.arrivalTime);
            this.rT.sample(elt.exitTime - elt.arrivalTime);
    
            this.rrW.sample(elt.entryTime - elt.arrivalTime);
        }
    }

    updateQueue(time, nq) {
        this.rNq.sample(time, nq);
        this.rrNq.sample(time, nq);
    }

    nextRound(time) {
        this.round += 1;

        //Amostras das medias da rodada
        this.X.sample(this.rX.getAverage());
        this.W.sample(this.rW.getAverage());
        this.T.sample(this.rT.getAverage());
        this.Nq.sample(this.rNq.getAverage(time));

        //Amostras das variancias da rodada
        this.vX.sample(this.rX.getVariance());
        this.vW.sample(this.rW.getVariance());
        this.vT.sample(this.rT.getVariance());
        this.vNq.sample(this.rNq.getVariance(time));

        this.resetRoundEstimators(time);
    }
}

module.exports = StatsCollector;

},{"./continuous-estimator":24,"./discrete-estimator":25}],27:[function(require,module,exports){
/*
    Trabalho de AD - MAB515 2019/1
    Leonardo Dagnino
    Silvio Mançano
    Daniel Artine
*/

// Nossas funções de interação com a interface
const interface = require('./Helpers/interface');

// Lógica principal do simulador
const simulator = require('./Simulator/simulator');

function exibeModal() {

    //Promise feita para aguardar a exibição do modal
    //de carregamento antes de executar a lógica do simulador
    return new Promise(function (resolve, reject) {

        document.getElementById('loader').style.display = "block";
        setTimeout(function(){ resolve()}, 100);
    });
}

// Adiciona evento de 'click' no botão de play e executa o simulador.
document.getElementById('run-button').addEventListener('click', () => {
    

    
    exibeModal().then(function(){

        //Pega momento de início de simulação
        let startTime = new Date().getTime();

        //Guarda os resultados da simulação na variável result
        let result = simulator.run(interface.getInputValues());

        //Pega o número de rodadas e guarda para exibição de tabelas
        let input = interface.getInputValues();
        let numeroRodadas = input.rodadas;

        //Pega o momento de finalização de simulação
        let endTime = new Date().getTime();

        //Exibe tempo de simulação
        console.log('tempo simulacao: ', (endTime - startTime) / 1000);

        //Pega momento de início de geração de tabelas com resultados
        startTime = new Date().getTime();

        // Preenche tabela de IC
        interface.clearTable('ic-table');
        interface.fillICTable(result.stats);
        // Preenche tabela de métricas
        interface.clearTable('metricas-table');
        interface.fillMetricasTable(result.stats, numeroRodadas);

        //Adiciona uma última coluna contendo a média das métricas calculadas
        interface.addTableRow('metricas-table', {
            'rodada': `<b>MÉDIA</b>`,
            'X': `<b>${result.stats.X.getAverage().toFixed(5)}</b>`,
            'vX': `<b>${result.stats.vX.getAverage().toFixed(5)}</b>`,
            'W': `<b>${result.stats.W.getAverage().toFixed(5)}</b>`,
            'vW': `<b>${result.stats.vW.getAverage().toFixed(5)}</b>`,
            'T': `<b>${result.stats.T.getAverage().toFixed(5)}</b>`,
            'vT': `<b>${result.stats.vT.getAverage().toFixed(5)}</b>`,
            'Nq': `<b>${result.stats.Nq.getAverage().toFixed(5)}</b>`,
            'vNq': `<b>${result.stats.vNq.getAverage().toFixed(5)}</b>`,
        });

        //Chamada de funções para exibição de gráficos
        interface.createLineChart(result.totalId, result.nqIter, result.numPontos, 'chart-1', 'chart-area-1');
        interface.createLineChart(result.totalId, result.wIter, result.numPontos, 'chart-2', 'chart-area-2');

        //Pega o momento de finalização de exibição de métricas
        endTime = new Date().getTime();

        console.log('tempo renderização: ', (endTime - startTime) / 1000);

        //Desliga o loader
        document.getElementById('loader').style.display = "none";
    })
   
})

},{"./Helpers/interface":17,"./Simulator/simulator":23}]},{},[27]);
