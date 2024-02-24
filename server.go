package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	var phonePositions map[string]string = make(map[string]string)
	phonePositions["hello"] = "wow"

	http.HandleFunc("/wsLaptop", func(w http.ResponseWriter, r *http.Request) {
		// Upgrade upgrades the HTTP server connection to the WebSocket protocol.
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("wsLaptop: upgrade failed: ", err)
			return
		}
		defer conn.Close()

		// Continuosly write message
		for {
			// TODO: Delay?
			// TODO: Get lookup table of phone positions
			output := "Nice!"
			message := []byte(output)
			err = conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Println("wsLaptop: write failed:", err)
				break
			}
		}
	})

	http.HandleFunc("/wsPhone", func(w http.ResponseWriter, r *http.Request) {
		// Upgrade upgrades the HTTP server connection to the WebSocket protocol.
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("wsPhone: upgrade failed: ", err)
			return
		}
		defer conn.Close()

		// Continuosly read and write message
		for {
			mt, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("wsPhone: read failed:", err)
				break
			}
			input := string(message)
			log.Println("wsPhone: got input:", input)

			// TODO: Update some table of positions (what
			// is a position?)
			output := "ok"

			message = []byte(output)
			err = conn.WriteMessage(mt, message)
			if err != nil {
				log.Println("wsPhone: write failed:", err)
				break
			}
		}
	})

	http.ListenAndServe(":9000", nil)
}
