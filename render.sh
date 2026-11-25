#!/bin/bash
# usage: ./render.sh still <Comp> out.png [frame]   (cloud helper; on Andrew's PC drop --browser-executable)
EXTRA=""; [ -x /opt/pw-browsers/chromium ] && EXTRA="--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing"
npx remotion "$@" $EXTRA --gl=angle --no-sandbox
