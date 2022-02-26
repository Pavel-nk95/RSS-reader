develop:
	npx webpack serve

install:
	npm ci

test:
	npm test

lint:
	npx eslint .

build:
	rm -rf dist
	NODE_ENV=production npx webpack

.PHONY: test