#!/bin/bash
# Starts Studio CRM and opens it in your browser (Linux; macOS uses "Start Studio CRM.command").
# Keep this terminal open while you use the CRM. Ctrl+C stops it.
cd "$(dirname "$0")" || exit 1

NODE=./runtime/node
[ -x "$NODE" ] || NODE=node
if ! "$NODE" --version > /dev/null 2>&1; then
  echo "Node.js was not found."
  echo "Download the ready-to-run Studio CRM for your system, or install Node.js 22 or newer from https://nodejs.org/"
  read -r -p "Press Enter to close."
  exit 1
fi

if [ ! -f node_modules/better-sqlite3/build/Release/better_sqlite3.node ]; then
  echo "First start: installing. This takes a minute and needs the internet once."
  npm install --no-audit --no-fund || { read -r -p "The install failed. Press Enter to close."; exit 1; }
fi

export STUDIO_CRM_OPEN=1
while :; do
  # An update from Settings stops the CRM with code 75: put the new version in place, then start again.
  if [ -f .update/ready ]; then
    echo "Installing the update..."
    cp .update/new/runtime/node .update/node && .update/node .update/new/scripts/apply-update.cjs
  fi
  "$NODE" server.js
  [ $? -eq 75 ] || break
  export STUDIO_CRM_OPEN=
done
