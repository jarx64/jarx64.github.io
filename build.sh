#!/bin/bash

# build react app
npm run build

# build hugo blog
cd blog
hugo
cd ../

# copy root files to dist
cp -r root/* dist/
