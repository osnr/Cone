package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

var upgrader = websocket.Upgrader{}

func main() {
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	var phonePositions sync.Map
	// phonePositions["hello"] = "wow"

	http.HandleFunc("/wsLaptop", func(w http.ResponseWriter, r *http.Request) {
		// Upgrade upgrades the HTTP server connection to the WebSocket protocol.
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("wsLaptop: upgrade failed: ", err)
			return
		}
		defer conn.Close()

		log.Print("wsLaptop: connection ready")

		// Continuosly write message
		for {
			var entries []string
			phonePositions.Range(func(key, position interface{}) bool {
				entries = append(entries, "\""+key.(string)+"\": "+position.(string))
				return true
			})
			output := "{" + strings.Join(entries, ",") + "}"
			// log.Println("output", output)

			message := []byte(output)
			err = conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Println("wsLaptop: write failed:", err)
				break
			}

			time.Sleep(10 * time.Millisecond)
		}
	})

	http.HandleFunc("/wsMobile", func(w http.ResponseWriter, r *http.Request) {
		// Upgrade upgrades the HTTP server connection to the WebSocket protocol.
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("wsMobile: upgrade failed: ", err)
			return
		}
		defer conn.Close()

		key := conn.RemoteAddr().String()
		log.Print("wsMobile: connection ready: ", key)

		// Continuosly read and write message
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Println("wsMobile: read failed:", err)
				break
			}
			phonePositions.Store(key, string(message))

			// output := "ok"

			// message = []byte(output)
			// err = conn.WriteMessage(mt, message)
			// if err != nil {
			// 	log.Println("wsPhone: write failed:", err)
			// 	break
			// }
		}
	})

	http.ListenAndServe(":9000", nil)
}
