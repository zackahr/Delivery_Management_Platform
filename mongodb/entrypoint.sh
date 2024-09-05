#!/bin/bash

# Start cron service
cron

# Start MongoDB
mongod --auth --bind_ip 0.0.0.0

# Keep the container running
tail -f /var/log/cron.log

