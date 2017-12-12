git branch -r \
| sed '1d' \
| xargs -n1 git --no-pager log --format="%ct %H %D" --max-count=1 --grep=stage- \
| grep origin/ \
| sort -r \
| cut -d " " -f2 \
| xargs -n 2 git --no-pager log --format="%<(11,ltrunc)%B%+ci - %<(50)%D - %an - stage-" --max-count=1 \
| sed 's/\.\. //g' \
| grep stage- \
| sed '$!N;s/\n/ - /' \
| sed 's/- stage-//g' \
| sed 's/origin\///g'
