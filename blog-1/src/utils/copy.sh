#!/bin/sh
cd /Users/chenjia/code/blog/blog-1/logs
cp access.log $(date +%y-%m-%d).access.log
echo "" > access.log