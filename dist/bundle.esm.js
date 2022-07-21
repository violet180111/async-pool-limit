/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function scheduler(options) {
    var limit = options.limit, values = options.values, pCtor = options.pCtor, cb = options.cb, _a = options.cur, cur = _a === void 0 ? 0 : _a, _b = options.pool, pool = _b === void 0 ? new Set() : _b;
    if (!Array.isArray(values)) {
        throw new TypeError('values must be a array');
    }
    if (typeof pCtor !== 'function') {
        throw new TypeError('pCtor must be a function');
    }
    var final = function () { return 'Tasks Ended!'; };
    if (cur >= values.length) {
        return pool.size ? Promise.race(pool).then(final).catch(final) : Promise.resolve('Tasks Ended!');
    }
    var execute = function (v) {
        var p = Promise.resolve(pCtor(v));
        var clean = function (res) {
            cb === null || cb === void 0 ? void 0 : cb(res);
            pool.delete(p);
        };
        pool.add(p);
        p.then(clean).catch(clean);
    };
    while (pool.size < limit && values[cur]) {
        execute(values[cur++]);
    }
    if (limit > values.length) {
        return Promise.all(pool).then(final).catch(final);
    }
    var next = function () { return scheduler(__assign(__assign({}, options), { cur: cur, pool: pool })); };
    return Promise.race(pool).then(next).catch(next);
}

export { scheduler as default };

if(typeof window !== 'undefined') {
  window._Dry_VERSION_ = '1.0.0'
}
