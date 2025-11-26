class LRUCache {
  constructor(maxEntries = 100, ttlMs = 300000) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
    this.map = new Map();
  }

  _now() {
    return Date.now();
  }

  _isExpired(record) {
    return this._now() > record.expiresAt;
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const record = this.map.get(key);
    
    if (this._isExpired(record)) {
      this.map.delete(key);
      return null;
    }
    
    // Move to most recently used
    this.map.delete(key);
    this.map.set(key, record); 
    
    return record.value;
  }

  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    
    // Evict least recently used
    while (this.map.size >= this.maxEntries) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
    
    this.map.set(key, { value, expiresAt: this._now() + this.ttlMs, addedAt: this._now() });
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  keys() {
    return Array.from(this.map.keys());
  }

  size() {
    return this.map.size;
  }
}

module.exports = LRUCache;
