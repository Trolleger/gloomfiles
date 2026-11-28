#!/usr/bin/env bash
# usage: add_lesson.sh <area> <lesson text> <source>
set -euo pipefail
cd "$(dirname "$0")/.."
area="${1:?area}"; text="${2:?lesson}"; src="${3:-unspecified}"
d=$(date -u +%F)
n=$(( $(grep -cE '^[0-9]+\. ' LESSONS.md) + 1 ))
printf '%s. [%s] %s (%s, %s)\n' "$n" "$area" "$text" "$src" "$d" >> LESSONS.md
IFS=. read -r a b c < VERSION; v="$a.$b.$((c+1))"; echo "$v" > VERSION
printf '\n## %s (%s)\n- Lesson %s [%s]: %s\n' "$v" "$d" "$n" "$area" "$text" > .cl.tmp
# insert new entry after the header line (line 3)
{ head -n 1 CHANGELOG.md; cat .cl.tmp; tail -n +2 CHANGELOG.md; } > .cl.new && mv .cl.new CHANGELOG.md; rm -f .cl.tmp
echo "Added lesson $n, version $v"
M=/mnt/project-files/shorts/skills/gloom-animated-shorts
if [ -d /mnt/project-files/shorts/skills ]; then mkdir -p "$M" && cp -r ./* "$M"/ && echo "Mirrored to $M"; fi
echo "Next: git commit + push, then propose_skills edit for gloom-files-visuals/script."
