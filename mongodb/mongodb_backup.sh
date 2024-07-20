#!/bin/bash

# Variables
TIMESTAMP=$(date +%F)
BACKUP_DIR="/data/backup/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# Backup the adilapp database
mongodump --db adilapp --out "$BACKUP_DIR"

# Restore the backup to adilappBackup database
mongorestore --drop --nsFrom="adilapp.*" --nsTo="adilappBackup.*" "$BACKUP_DIR/adilapp"

# Optional: Remove backups older than 7 days
find /data/backup/ -type d -mtime +7 -exec rm -rf {} \;

