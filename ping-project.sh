#!/bin/bash

while true; do
    # Make the GET request
    curl -s https://jp-meetup-solo-project.onrender.com/

    # Wait for 1 minute before the next request
    sleep 60
done
