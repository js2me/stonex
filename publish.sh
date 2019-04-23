#!/bin/bash

ls -l
git remote rm origin
git remote add origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/kinka.git
git remote set-url origin https://js2me:${GITHUB_TOKEN}@github.com/acacode/kinka.git
rm -rf example
git add .
git commit -m "build release ${PACKAGE_VERSION} [ci skip]"
git push
yarn git-release ${PACKAGE_VERSION}
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc
npm whoami
npm publish
git checkout -- .
git push
git reset --hard ${ACTUAL_DEV_VERSION}
git push -f origin ${TRAVIS_BRANCH}