# Davis Lost and Found

We know it's very frustrating when people lost their stuff or find other people's stuff
but don't know where to return. This project is to provide a platform for those who lose
their belongings to post help and who find people's belongings to seek owners.

## Tools and Development

We use React as the front, express as the backend, and [glitch](https://lost-found-162.glitch.me/home) to host our application.

We take advantage of React that it is one-page application, and a good management of data flow.
We choose Express as our backend to host RESTful APIs to handle requests and MySQL as the database
to deal with website data.

### Front end
```
pages
├── welcome
└── main
    ├── prompt
    ├── finder/post
    ├── seeker/post
    ├── finder/search
    ├── seeker/search
    └── search/results
```
We use browse router to navigate pages.
#### Tech Specs
##### Google Map
In our post and search page, we enable google map to support users two ways of finding a location.
They can either click on the map, so our program will find the nearest place based on the click. Or,
the user can enter their desired place, and our program will autocomplete the text they enter and
will provide a list of matching places for the user to choose from.

##### Google Place and Proxy
These functionalities are accomplished by Google Place API. To use them and integrate with Google Map
and React, we have to use a proxy to avoid CORS issues. Our proxy is hosted at 
[this page](https://162-proxy.glitch.me/). Only Google Place API is used with proxy to avoid CORS. Other
third party request such as Google Login/Google Map are used normally.

##### Google OAuth
For Google Login and Google Map, we enable front end service directly. Since our platform doesn't require
to store a user database. We use Google Auth Login in front end to communicate with Google OAuth and get 
cookies from there without sending request to backend and backend sends request to Google OAuth.

##### Page Block
In that way, we cannot get a session cookie from our backend, so to compensate the lack of our cookies,
we add a login status in front end to ensure that the user must have logged in to visit pages other than
welcome, and to send requests.

#### Design Specs
Design Specs follow the instructions. In addition, we enable our message system to send necessary
messages to direct user what's going and what they should do instead of sending alerts that block
the entire screen. 

### Backend

#### RESTful API

#### Database