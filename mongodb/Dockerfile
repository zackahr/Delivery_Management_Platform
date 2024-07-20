FROM mongo:latest

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy the backup script into the container
COPY mongodb_backup.sh /usr/local/bin/mongodb_backup.sh

# Copy the cron configuration file
COPY mongo-cron /etc/cron.d/mongo-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/mongo-cron

# Apply cron job
RUN crontab /etc/cron.d/mongo-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Make the backup script executable
RUN chmod +x /usr/local/bin/mongodb_backup.sh

# Start cron service and MongoDB
CMD cron && tail -f /var/log/cron.log & mongod --auth --bind_ip_all

