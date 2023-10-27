#!/bin/bash

pusher-fake -i $PUSHER_APP_ID --socket-host 0.0.0.0 --socket-port $PUSHER_WS_PORT --web-host 0.0.0.0 --web-port $PUSHER_PORT -k $PUSHER_APP_KEY -s $PUSHER_APP_SECRET
