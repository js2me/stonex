#!/bin/bash

set -e
ls -l
git remote rm origin
git remote add origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/kinka.git
git remote set-url origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/kinka.git
git fetch -p
git fetch
git symbolic-ref HEAD refs/heads/${TRAVIS_BRANCH}
git symbolic-ref HEAD
git remote show origin
git status
rm -rf example
yarn build
git add .
git commit -m "build release ${PACKAGE_VERSION} [ci skip]"
git push --set-upstream origin ${TRAVIS_BRANCH}
yarn git-release ${PACKAGE_VERSION}
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
npm whoami
npm publish
git checkout -- .
git push --set-upstream origin ${TRAVIS_BRANCH}
git reset --hard ${ACTUAL_DEV_VERSION}
git push -f origin ${TRAVIS_BRANCH}