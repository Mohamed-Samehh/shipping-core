# Performance characteristics

shipping-core targets sub-millisecond service operations for the in-memory
store. The structure of `MemoryStore<T>` makes most operations O(1) and a
few O(log n) or O(n).

## Big-O reference

| Operation | Time | Space |
|-----------|------|-------|
| `get(id)` / `has(id)` / `tryGet(id)` | O(1) | O(1) |
| `store(entity)` -- new entity         | O(k) where k = index count | O(1) |
| `store(entity)` -- update             | O(k) (unindex + reindex)   | O(1) |
| `remove(id)`                          | O(k)                       | O(1) |
| `findByIndex(name, key)`              | O(m) where m = matches     | O(m) |
| `list(options)`                       | O(n) (scan + optional sort) | O(n) |
| `listAll(filter)`                     | O(n)                       | O(n) |
| `count(filter)`                       | O(n)                       | O(1) |

## Filter scans

Most service-level queries pass through `list()` or `listAll()`. These
scan the whole entity set; for collections beyond ~10k rows, prefer the
indexed `findByIndex()` lookup or push the filter onto a real database.

## Index maintenance

Each registered index costs one Map per index plus one Set per distinct
key. The memory cost is bounded by `O(n)` per index. Index maintenance
on `store()` is O(1) per index since each accessor returns at most one
key per entity.

## Audit log size

The audit log grows monotonically (one row per mutation). Production
deployments are expected to evict rows older than the retention window;
the in-memory implementation does not do this automatically.

## Cache helpers

`lib/cache.LruCache` and `lib/cache.TtlCache` are O(1) for `get`/`set`
amortised. The LRU cache uses Map's insertion-order property; the TTL
cache uses a Date.now() comparison on read.

## Concurrency

The library is single-threaded. The `lib/concurrency` primitives
(`Semaphore`, `Mutex`, `KeyedMutex`, `parallelLimit`) are co-operative
and only matter when interleaving async work. Synchronous service calls
are inherently serialized.
