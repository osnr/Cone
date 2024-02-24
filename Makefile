run:
	rsync --delete -a . lanette:/root/cone
	ssh lanette -- 'killall server; cd cone; go run server.go'
