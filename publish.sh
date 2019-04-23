#!/bin/bash

set -e
export PUBLISH_BRANCH=travis-release-${PACKAGE_VERSION}
git remote rm origin
git remote add origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/stonex.git
git remote set-url origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/stonex.git
git checkout -b ${PUBLISH_BRANCH}
git symbolic-ref HEAD refs/heads/${PUBLISH_BRANCH}
rm -rf example
yarn build
git add .
echo "git status"
git status
git commit -m "build release ${PACKAGE_VERSION} [ci skip]"
git push --set-upstream origin ${PUBLISH_BRANCH}
yarn git-release ${PACKAGE_VERSION}
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
npm whoami
npm publish
git checkout -- .
git push --set-upstream origin ${PUBLISH_BRANCH}
git reset --hard ${ACTUAL_DEV_VERSION}
git push -f origin ${PUBLISH_BRANCH}
