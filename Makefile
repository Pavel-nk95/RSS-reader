develop:
	npx webpack serve

build:
    rm -rf dist
    NODE_ENV=production npx webpack

install:
	npm ci

test:
	npm test

lint:
	npx eslint .

.PHONY: test