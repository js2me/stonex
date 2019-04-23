#!/bin/bash

set -e
ls -l
git remote rm origin
git remote add origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/stonex.git
git remote set-url origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/stonex.git
git fetch -p
git fetch
git symbolic-ref HEAD refs/heads/release
git symbolic-ref HEAD
git remote show origin
rm -rf example
yarn build
git add .
echo "git status"
git status
git commit -m "build release ${PACKAGE_VERSION} [ci skip]"
git push --set-upstream origin release
yarn git-release ${PACKAGE_VERSION}
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
npm whoami
npm publish
git checkout -- .
git push --set-upstream origin release
git reset --hard ${ACTUAL_DEV_VERSION}
git push -f origin release
