Test task for Swing Dev. Get photos of dog from Flickr API.

Created in React.

## Features
* get first 100 photos of dogs
    * with captions - author, date, description

* add infinite scroll
* implement visible error handling from both engineering and user perspectives. 
* use loading indicators 
* show map of dogs photos using geolocation
* filter based on parameters: date, licence

## Map
I wanted to use Google Maps to show map of dog photos, however now Google requires to create billing account.
Instead, I used Leaflet map. 

If there is no photo on map, it means that currently loaded photos don't have provided coordinates. Please scroll down to load next photos or change filters to load photos with coordinates.  