#!/bin/bash
echo
echo This command will show which branch has the latest commit referencing a given staging environment.
echo If a staging environment is not listed, it means it is not currently in use by any active branch.
echo -e "\033[1;31mWarning: this command will not show information about stage-0, unless it appears in the commit message\033[0m"
echo -e "If you have not ran \033[34mgit pull/git fetch\033[0m in a while, you may want to run: \033[34mgit fetch --prune\033[0m"
echo
# 1.  Request remote branches only (GitHub)
# 2.  Remove master from the list (it fails otherwise)
# 3.  Get date, hash and full branch name of latest commit with [stage-x] tag
# 4.  Remove extraneous logs
# 5.  Sort by date desc
# 6.  Keep only commit hash
# 7.  Split output by spaces
# 8.  Get latest part of commit message (assumes [stage-x] tag is the last part), plus date, branch and user
# 9.  Removes the leading truncation string (.. ) in case it exists
# 10. Removes empty lines
# 11. Joins pairs of lines ([stage-x] tag in one line, commit info in the next one)
# 12. Remove ' - stage-' text used for filtering
# 13. Remove origin/ part of branch name
# 14. Remove duplicates of [stage-x] column
git branch -r \
| sed '1d' \
| xargs -n1 git --no-pager log --format="%ct %H %D" --max-count=1 --grep=stage- \
| grep origin/ \
| sort -r \
| cut -d " " -f2 \
| xargs -n2 git --no-pager log --format="%<(11,ltrunc)%B%+ci - %<(30)%an - %D - stage-" --max-count=1 \
| sed 's/^.*\[stage-\([0-9]\).*/[stage-\1]/' \
| grep stage- \
| sed '$!N;s/\n/ - /' \
| sed 's/- stage-//g' \
| sed 's/origin\///g' \
| awk '!seen[$1]++'
