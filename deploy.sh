#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成所有构建
yarn build

# shellcheck disable=SC2006
#template=`cat template.html`

if test -e ./dsWork; then
  echo "dsWork文件夹已就绪"
else
  mkdir ./dsWork
  echo "dsWork文件夹创建完成，已就绪"
fi

# shellcheck disable=SC2006
#head=$(cat templates/head.tpl)
#footer=$(cat templates/footer.tpl)
#
#time=$(date "+%Y%m%d%H%M%S")
# 生成前端插件安装包压缩文件
#tar -zcvf ./dsWork/dsWork-$time.zip ./dist
tar -zcvf ./dsWork/dsWork.zip ./dist

cp ./workday/*.json ./dsWork
cd ./dsWork

#liStr=''

# shellcheck disable=SC2045
# shellcheck disable=SC2006
#for file in `ls -r ./*.zip`;
#do
#  # shellcheck disable=SC2089
#  liStr="$liStr<li><a href=$file>$file</a></li>"
#done

# mark='#mark#'
# shellcheck disable=SC2046
# shellcheck disable=SC2006
# shellcheck disable=SC2016
# echo $template | sed "s~$mark~$liStr~g" > index2.html
#
if test -d .git ; then
    echo "git已就绪"
else
  git init
  git config user.name 'lifuzhao100'
  git config user.email 'fuzhao@datastory.com.cn'
  echo "git init完成，已就绪"
fi

# 发布到自定义域名
# echo 'dsWork.lifuzhao100.fun' > CNAME

git add -A
git commit -m 'deploy'

git push -f git@github.com:lifuzhao100/dsWork.git master:gh-pages

echo "deploy 完成"
