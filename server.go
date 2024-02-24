package main

import (
    "net/http"
)

func main() {
    http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "index.html")
    })
    http.ListenAndServe(":9000", nil)
}
