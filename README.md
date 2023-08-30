# Meat-Up

### [LIVE LINK](https://meat-up.onrender.com/)

This was my first full stack application project. This web app was inspired by Meet Up. You are able to connect with new people who share your interests through online and in-person event.

## CONTACT ME
#### [LinkedIn](https://www.linkedin.com/in/jun-park-3b23b7285/) or thejhp96@gmail.com


## MVP
* The ability to create a new user and user loging with authorization
* Users can create new groups to keep track of things such as the events
* Users can view all available groups on the site
* Users can update and delete groups only if you are the creator of that group
* Users can create new events to add to groups
* Users can view all events avaiable
* Users can updated and delete events only if they are the creator or co-organzier of the event.
* Users can create new venues for the events to be at
* Users can view all the venues
* Users can update and delete the venue if the are creator of the group

## TECHNOLOGIES USED
* Express.js
* SQL
* HTML5
* CSS3
* JavaScript
* React / Redux
* Node.js
  
## ENVIRONMENT DEPENDENCIES/PACKAGES
* Font Awesome

## DATABASE SCHEMA
<img width="840" alt="meetup_dbdiagram" src="https://github.com/thejhp1/Meat-Up/assets/124937654/f3bfbde9-f3fb-4afb-8ef9-08d3348fb332">

## ENDPOINTS
| REQUEST | PURPOSE |
| ------- | ------- |
| GET /api/groups | This fetch will get all groups |
| POST /api/groups | This fetch will allow you to create a group |
| POST /api/groups/:groupId/images | This fetch will allow you create and add an image if you are the owner of the group |
| GET /api/groups/current | This fetch will get all the groups that the current logged in user is a member of |
| PUT /api/groups/:groupId | This fetch will update the groups information if you are the owner of the group |
| DELETE /api/groups/:groupId | This fetch will delete a group if you are the owner of the group |
| DELETE /api/group-images/:imageId | This fetch will delete the group's image based on the image's id |
| GET /api/events | This fetch will get all the events available |
| GET /api/events/:eventId | This fetch will get all the details of an event based on the event id |
| GET /api/groups/:groupId/events | This fetch will get all of the group's events based on the group id |
| POST /api/events/:eventId/images | This fetch will create and add an image to an event based on the event id |
| POST /api/groups/:groupId/events | This fetch will create an event in the group based on the group id |
| PUT /api/events/:eventId | This fetch will update the event based on the event's id |
| DELETE /api/events/:eventId | This fetch will delete the event based on the event's id |
| DELETE /api/event-images/:eventId | This fetch will delete the event's image based on the event's id |

## FUTURE GOALS
* Implement sign ups with O-Auth
