#!/bin/bash

echo "Starting Pusher-Faker..."
pusher-fake -i ${PUSHER_APP_ID:-123456} --socket-host 0.0.0.0 --socket-port ${PUSHER_WS_PORT:-45449} --web-host 0.0.0.0 --web-port ${PUSHER_PORT:-8888} -k ${PUSHER_APP_KEY:-centralakey} -s ${PUSHER_APP_SECRET:-centralsecret} &

echo "Starting application..."
rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0' &

wait -n

exit $?
