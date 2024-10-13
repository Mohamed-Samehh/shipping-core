# Persistence: in-memory vs production

Every repository extends `MemoryStore<T>`, which keeps everything in a
single `Map<string, T>` keyed by id, plus secondary indexes for the
queries each service exposes.

To swap in a real backing store, implement an alternative repository class
that satisfies the same surface (`get`, `tryGet`, `store`, `remove`,
`list`, `listAll`, `count`, `findByIndex`) and inject it where the fixture
currently constructs the in-memory variant.

The services depend on the repository *interface*, not the concrete class,
so the swap is transparent to the rest of the library.
