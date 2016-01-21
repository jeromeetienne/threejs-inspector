server:
	http-server --cors

packageExtension:
	zip -r src.zip src

cleanExtension:
	rm -f src.zip
