# Meat-Up
![simplefix-landing](https://github.com/thejhp1/SimpleFix/assets/124937654/6901b2f7-8fbb-4cea-b0d7-5b5f7f3aa3f5)


![simplefix-intro](https://github.com/thejhp1/SimpleFix/assets/124937654/4aa255c2-af94-49e8-b4a3-6dcf25d285d5)
### [LIVE LINK](https://meat-up.onrender.com/)

SimpleFix is an easy ticket management system that can be integrated into any company. This web project aims to allow companies to easily manage repair tickets. All from scheduling, customer and product information, part tracking and claim submissions. This website will benefit companies by providing a simple and clean design to work off of and an intuitive user experience, thus allowing for less training time, less confusion and much more!

## CONTACT ME
#### [LinkedIn](https://www.linkedin.com/in/jun-park-3b23b7285/) or thejhp96@gmail.com


## MVP
* The ability to create a new user and user loging with authorization
* Users can create new tickets that contains customer, product, schedule and part information
* Users can update and cancel tickets and schedules
* Users can update and delete part information
* Users can create, update and cancel claims for tickets
* Users can view a map that has a marker for every pending ticket

## BONUS FEATURES
* Search through and pending ticket, part, or claim
* Specific Markers depending on ticket status

## TECHNOLOGIES USED
* Express.js
* SQL
* HTML5
* CSS3
* JavaScript
* React / Redux
* Node.js
* Vite
  
## ENVIRONMENT DEPENDENCIES/PACKAGES
* Google Maps Javascript API
* Font Awesome
* Day.js

## DATABASE SCHEMA
[db-schema]: /frontend/src/images/meetup_dbdiagram.png

## ENDPOINTS
| REQUEST | PURPOSE |
| ------- | ------- |
| GET /api/tickets/ | This fetch will get every ticket available |
| GET /api/tickets/:ticketId/ | This fetch will get a single ticket based on the given ticketId |
| POST /api/tickets/ | This fetch will receive a body that contains firstName, lastName, phone, street, city, state, zip, brand, category, installDate, model, serial and warrantyStatus and then return a randomized ticket number beginning with 417 |
| PUT /api/tickets/:ticketId/ |  This fetch will receive a body that contains firstName, lastName, phone, street, city, state, zip, brand, category, installDate, model, serial and warrantyStatus and then update a ticket based on the given ticketId number |
| GET /api/parts/ | This fetch will get every part in the database |
| POST /api/parts/new/ | This fetch will recieve a body that contains number, description, price, quantity, status and ticketId and then create a new part |
| DELETE /api/parts/:partId/ | This fetch will get a single part based on the given part'ss id and then remove it from the database |
| PUT /api/parts/:partId/ | This fetch will receive a body that contains number, description, price, quantity, status and ticketId and then update the part based on the give partId number |
| PUT /api/schedule/:ticketId/ | This fetch will receive a date, timeFrame, technician, note and status and then will update the ticket's schedule based on the given tickedId |
| GET /api/claims/ | This fetch will get all of the claims available |
| POST /api/claims/ | This fetch will receive a body that contains ticketId, number, labor, part, mileage and status and then return a newly created claim |
| PUT /api/claims/ |  This fetch will receive a body that contains claimId, number, labor, part, mileage and status and then update a claim based on the given claimId number |
| GET /api/auth/ | This fetch is sent upon intial app load and on subsequent refreshes. It returns an object representing the current user, if user is logged in |
| POST /api/login/ | This fetch attempts to login a user with the provided credentials. It returns an object representing the current user, if validation succeeds |
| DELETE /api/login/ | This fetch attempts to log out the current user. |

## FUTURE GOALS
