#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成所有构建
#yarn build
## shellcheck disable=SC2182
## shellcheck disable=SC2006
template=`cat ./template.html`

if test -e ./staticServer; then
  echo "staticServer文件夹已就绪"
else
  mkdir ./staticServer
  echo "staticServer文件夹创建完成，已就绪"
fi

time=$(date "+%Y%m%d%H%M%S")
# 生成前端插件安装包压缩文件
tar -zcvf ./staticServer/dsWork-$time.zip ./dist

cd ./staticServer

# shellcheck disable=SC2045
# shellcheck disable=SC2006
for file in `ls -r ./*.zip`;
do
  liStr="${liStr}<li>${file}</li>"
done

# shellcheck disable=SC2006
result=`printf "$template" $liStr`
echo "$result" > ./index.html

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

git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
