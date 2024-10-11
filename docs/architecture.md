# Architecture

The shipping-core library is organised in concentric rings. Inner rings have
no dependencies on outer rings.

```
api/  ->  services/  ->  repositories/  ->  domain/  ->  lib/
```

- **lib** is dependency-free utility code (clock, id, hash, money, etc.).
- **domain** is the entity schemas + predicates. No I/O, no side-effects.
- **repositories** are in-memory stores with secondary indexes. They wrap
  the domain entities and own primary lookup + indexed lookup.
- **services** are the only writers. They depend on repositories + the
  audit service and orchestrate multi-step business operations.
- **api** is the HTTP plumbing. It depends only on `services` and the
  `lib` utilities -- never on repositories directly.

## Adding a new entity

1. Add the schema + type + parse() in `src/domain/<entity>.ts`.
2. Add an in-memory repository in `src/repositories/<entity>-repository.ts`.
3. Add a service in `src/services/<entity>-service.ts` and export from
   the public barrel in `src/index.ts`.
4. Add tests under `tests/services/<entity>-service.test.ts`.

## Persistence

The default repositories are in-memory. Production callers swap them for a
SQL or document-store implementation that satisfies the same interface --
`tryGet(id)`, `store(entity)`, `list(...)`, `count(...)` etc.
