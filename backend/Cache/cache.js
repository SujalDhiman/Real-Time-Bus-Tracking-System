const cache = new Map();

setInterval(() => cache.clear(), 1000*60)

export {cache}