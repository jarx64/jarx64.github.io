#!/bin/bash

# build react app
echo "Building React app..."
npm run build

# build hugo blog
echo "Building Hugo blog..."
cd blog
hugo
cd ../

# copy root files to dist
echo "Copying root files to dist..."
cp -r root/* dist/
