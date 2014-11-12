
langs ?= *

test:
	@./node_modules/.bin/mocha --grep test/$(langs)

.PHONY: test
