run:
	rsync --delete -a . lanette:/root/cone
	ssh lanette -- 'cd cone; go run server.go'
