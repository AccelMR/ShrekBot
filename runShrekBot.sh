#!/bin/bash
#
echo "Starting Shrek Bot...."
SCRIPT_PATH=`readlink -f "$0"`
DIR=`dirname "$SCRIPT_PATH"`
#
FULL_DIR="${DIR}/src/main.ts"
#
#forever start -v -c ts-node ${FULL_DIR}  >> 
LOG="${DIR}/log/init.log"
date >> LOG
ts-node ${FULL_DIR} >> LOG
echo "Command Executed" &
