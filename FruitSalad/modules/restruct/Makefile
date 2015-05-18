all: restruct.js tests.js index.html

restruct.js: codegen.py
	./codegen.py

tests.js: testsgen.py
	./testsgen.py

index.html: README.md
	node_modules/.bin/owldoc README.md > index.html

clean:
	rm -f index.html restruct.js tests.js

tests: restruct.js tests.js
	node_modules/.bin/nodeunit tests.js

.PHONY: all clean tests

