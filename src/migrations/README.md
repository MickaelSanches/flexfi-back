# Migrations

This directory contains database migration files used to manage schema changes over time.

## Purpose
- Version control database schema
- Apply incremental changes to database structure
- Track schema evolution
- Enable rollbacks if needed
- Support consistent database setup across environments

## Migration Generation
Migrations can be generated using TypeORM CLI:

```bash
npm run typeorm migration:generate -- -n MigrationName
```

## Expected Files
- Timestamped migration files (e.g., `1624512345678-CreateUserTable.ts`)
- Each migration contains `up` and `down` methods for applying and reverting changes 