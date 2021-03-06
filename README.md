# BAE

BAE is a webapp used to prevent meetings that should've been an email. The host sets the meeting beforehand, and the atendees up/downvote the agenda items they feel need to be discussed. If an items has negative votes, it switches to a BAE (Been An Email) item.

It uses React, Node, Express, MongoDB

## Screenshots
Home Page:
![](https://github.com/theandrewchon/BAE/blob/master/client/src/assets/img/home%20page.png)

User Page:
![](https://github.com/theandrewchon/BAE/blob/master/client/src/assets/img/User%20page.png)

Meeting Page:
![](https://github.com/theandrewchon/BAE/blob/master/client/src/assets/img/Meeting%20page.png)


## Starting the app locally
Clone the directory and change into the root directory. Run the following command:

```
npm install
```

This should install node modules within the server and the client folder.

After both installations complete, run the following command in your terminal:

```
npm run start
```

Your app should now be running on <http://localhost:3000>. The Express server should intercept any API requests from the client.

## Contributions and bugs

Want to contribute? Submit a bull request. See a bug or have a suggestion? Open up an issue.
