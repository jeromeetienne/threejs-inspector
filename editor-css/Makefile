watch: build
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch -o dark.less | xargs -n1 -I{} make build

build:
	lessc dark.less > dark.css




