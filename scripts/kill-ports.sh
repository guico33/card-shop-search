#!/bin/bash

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 port1 port2 port3 ..."
  exit 1
fi

for PORT in "$@"
do
  PIDS=$(lsof -t -i :$PORT)
  if [ -n "$PIDS" ]; then
    echo "Killing processes using port $PORT: $PIDS"
    kill -9 $PIDS
  else
    echo "No processes found using port $PORT"
  fi
done