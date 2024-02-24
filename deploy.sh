#!/bin/bash

# This generates a unique migration name
generate_migration_name() {
  timestamp=$(date +"%Y%m%d%H%M%S")
  # Combine with a prefix
  migration_name="init_postgres_$timestamp"
  echo "$migration_name"
}

# Run Prisma commands
echo "Generating Prisma client..."
npx prisma generate

echo "Pushing changes to database..."
npx prisma db push

# Generating a unique migration name
migration_name=$(generate_migration_name)

echo "Running database migrations..."
npx prisma migrate dev --name "$migration_name"

# Run yarn build
echo "Building the project..."
yarn build

echo "Deployment script completed."
