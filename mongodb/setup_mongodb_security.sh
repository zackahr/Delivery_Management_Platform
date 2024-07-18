#!/bin/bash

# Variables
MONGO_CONF="/etc/mongod.conf.orig"
SSL_DIR="/etc/ssl/mongodb"
PEM_FILE="$SSL_DIR/mongodb.pem"
CERT_KEY="$SSL_DIR/mongodb-cert.key"
CERT_CRT="$SSL_DIR/mongodb-cert.crt"
BACKUP_SCRIPT="/usr/local/bin/mongodb_backup.sh"
ADMIN_USER="admin"
ADMIN_PASS="Lucian@12ZZ"
BIND_IPS="127.0.0.1,104.248.165.56"

# Step 1: Create SSL Directory
mkdir -p $SSL_DIR

# Step 2: Generate Self-Signed Certificate if not exist
if [ ! -f "$PEM_FILE" ]; then
    openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out $CERT_CRT -keyout $CERT_KEY
    cat $CERT_KEY $CERT_CRT > $PEM_FILE
    chmod 600 $PEM_FILE
    echo "Self-signed certificate generated."
else
    echo "Self-signed certificate already exists."
fi

# Step 3: Verify Certificate Existence
if [ -f "$PEM_FILE" ]; then
    echo "Certificate file exists: $PEM_FILE"
else
    echo "Certificate file does not exist: $PEM_FILE"
    exit 1  # Exit script if certificate file is missing
fi

# Step 4: Configure MongoDB
if ! grep -q "authorization: enabled" $MONGO_CONF; then
    echo "security:" >> $MONGO_CONF
    echo "  authorization: enabled" >> $MONGO_CONF
    echo "net:" >> $MONGO_CONF
    echo "  bindIp: $BIND_IPS" >> $MONGO_CONF
    echo "  ssl:" >> $MONGO_CONF
    echo "    mode: requireSSL" >> $MONGO_CONF
    echo "    PEMKeyFile: $PEM_FILE" >> $MONGO_CONF
    echo "MongoDB configuration updated."
else
    echo "MongoDB configuration already contains security settings."
fi

# Step 5: Restart MongoDB Service
systemctl restart mongod

# Step 6: Check if Administrative User Exists and Create if Not
USER_EXISTS=$(mongosh --quiet --eval "db.getSiblingDB('admin').getUser('$ADMIN_USER')" | grep -c null)

if [ $USER_EXISTS -eq 1 ]; then
    echo "Admin user does not exist. Creating admin user."
    mongosh <<EOF
use admin
db.createUser({
  user: "admin",
  pwd: "Lucian@12ZZ",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
})
EOF
else
    echo "Admin user already exists. Skipping user creation."
fi

# Step 7: Create Backup Script
echo "#!/bin/bash" > $BACKUP_SCRIPT
echo "TIMESTAMP=\$(date +%F)" >> $BACKUP_SCRIPT
echo "BACKUP_DIR=\"/usr/local/bin/\$TIMESTAMP\"" >> $BACKUP_SCRIPT
echo "mkdir -p \"\$BACKUP_DIR\"" >> $BACKUP_SCRIPT
echo "mongodump --out \"\$BACKUP_DIR\"" >> $BACKUP_SCRIPT

# Step 8: Make Backup Script Executable
chmod +x $BACKUP_SCRIPT

# Step 9: Schedule Backup Script with Cron
(crontab -l ; echo "* * * * * $BACKUP_SCRIPT") | crontab -

# Step 10: Confirmation Message
echo "MongoDB security setup completed successfully."

