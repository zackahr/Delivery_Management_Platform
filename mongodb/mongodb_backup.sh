#!/bin/bash

# Variables
TIMESTAMP=$(date +%F)
BACKUP_DIR="/data/backup/$TIMESTAMP"
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="Lucian12ZZ"
MONGO_HOST="localhost"
MONGO_PORT="27017"
DB_NAME="adilapp"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup the adilapp database with authentication
mongodump --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db $DB_NAME --out "$BACKUP_DIR"

# Restore the backup to adilappBackup database with authentication
mongorestore --host $MONGO_HOST --port $MONGO_PORT --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --drop --nsFrom="${DB_NAME}.*" --nsTo="adilappBackup.*" "$BACKUP_DIR/$DB_NAME"

# Optional: Remove backups older than 7 days
find /data/backup/ -type d -mtime +7 -exec rm -rf {} \;

