#!/bin/bash
# macOS: double-click to start Studio CRM. The first time, right-click it and choose Open.
cd "$(dirname "$0")" || exit 1
# A downloaded ZIP is quarantined by macOS; clear that for this folder so the bundled files can run.
xattr -dr com.apple.quarantine . 2> /dev/null
exec bash ./start-studio-crm.sh
