[![Bower version](https://badge.fury.io/bo/semafloor-test-alpha.svg)](https://badge.fury.io/bo/semafloor-test-alpha)
[![Build Status](https://travis-ci.org/semafloor/semafloor-test-alpha.svg?branch=master)](https://travis-ci.org/semafloor/semafloor-test-alpha)


<img src="https://cloud.githubusercontent.com/assets/10607759/14287487/68638fc8-fb85-11e5-8a06-22edde802f31.png" height="192" width="192" />
## Semafloor

Semafloor, a meeting room booking ~~app~~ [progressive web app](https://developers.google.com/web/updates/2015/12/getting-started-pwa?hl=en) built with [Polymer](https://www.polymer-project.org/1.0/).

The PWA is hosted on two different sites, one of which is HTTP/2 enabled:
- [Main site with HTTP/2 enabled](https://www.semafloor.com)
- [Secondary site with Firebase Hosting](https://semafloor-webapp.firebaseapp.com)


## Introduction
The name of the web app came from the term [semaphore](https://en.wikipedia.org/wiki/Semaphore_(programming)) in computer programming which is defined as a variable or abstract data type that is used for controlling access to some resource. The term semaphore is kind of closely resembling how a meeting room booking application works. For example, semaphore controls access from certain sources to some resources just like booking a room. You can only book an empty room when it is available to be reserved otherwise wait for it to be available again or search for other empty ones. The name changes over the course of the developement of this web app, it is eventually named Semafloor from the term semaphore.

## How it works
In this web app, it has two different state: `logged in` and `logged out`.

<img src="https://cloud.githubusercontent.com/assets/10607759/14287200/720e1d28-fb84-11e5-9b2b-2dc4830e5988.png" height="284" width="160" />
###### Layout for anonymous users
In `logged out` state, anonymous users are allowed to access only some of the pages while the rest are strictly required users to log in in order to use those features such as Web push notification. It utilizes Firebase's authentication system and at the moment, users can only log in via `google` as the login provider. For example, anonymous users are allowed to check out currently reserved rooms at all available sites but are not allowed to make any reservations. In other words, anonymous users have the permission to only `read` instead of `write` any data.

As from the image _**Layout for anonymous users**_ shown above, the pages that are available:
- **Home** - a home page to introduce the web app.
- **Current Reservations** - to show the current status of all rooms, either `occupied` or `available`.
- **Room Information** - to show the facilities inside each room.
- **Settings** - to change theme of the web app and to enable web push notification (only for logged in users, however it's there to show that this is a PWA and is capable of receiving push notifications!).

<img src="https://cloud.githubusercontent.com/assets/10607759/14287275/b9259b14-fb84-11e5-91f0-12aea8135058.png" height="284" width="160" />
###### Layout for logged in users
Whilst in the `logged in` state, logged in users gained access to all available pages such making a reservation, receiving web push notification on your opted in devices, etc.

For logged in users, there are three pages more as shown in the image _**Layout for logged in users**_:
- **My Profile** - to show the profile details of the logged in user.
- **My Reservations** - to show literally reservations of the logged in user and has three different categories: _**Today**_, _**This week**_, and _**Upcoming**_.
- **Search & Reserve** - to search for empty room for upcoming reservation(s).

<img src="https://cloud.githubusercontent.com/assets/10607759/14292662/9fee2fe6-fb9b-11e5-9579-b12eae70dc60.png" height="200" width="200"/>
###### Semafloor in one pic
A picture is worth a thousand words. The above illustrates an overall work flow of the webapp from the layout before login to the layout after login and with different themes being changed at the **Settings** page.

## Libraries and tools used
Here listed the tools and libraries that made this PWA possible:

1. <a href="https://atom.io/" class="polymer" target="_blank">
  <img src="http://svgporn.com/logos/atom.svg" height="48" width="48" /> Atom Editor
</a>
2. <a href="https://babeljs.io/" class="babel" target="_blank">
  <img src="http://svgporn.com/logos/babel.svg" height="48" width="48" /> Babel Javascript Transpiler
</a>
3. <a href="https://www.cloudflare.com/" class="cloudflare" target="_blank">
  <img src="http://svgporn.com/logos/cloudflare.svg" height="48" width="48" /> Cloudflare to supercharge your webapp
</a>
4. <a href="http://www.ecma-international.org/ecma-262/6.0/" class="es6" target="_blank">
  <img src="http://svgporn.com/logos/es6.svg" height="48" width="48" /> ES2015/ ES6 with NodeJS
</a>
5. <a href="http://expressjs.com/" class="express" target="_blank">
  <img src="http://svgporn.com/logos/express.svg" height="48" width="48" /> Express framework with NodeJS
</a>
6. <a href="https://www.firebase.com/" class="firebase" target="_blank">
  <img src="http://svgporn.com/logos/firebase.svg" height="48" width="48" /> Firebase the real time cloud database
</a>
7. <a href="http://gulpjs.com/" class="gulp" target="_blank">
  <img src="http://svgporn.com/logos/gulp.svg" height="48" width="48" /> Gulp build tools for NodeJS and Polymer
</a>
8. <a href="https://inkscape.org/en/" class="inkscape" target="_blank">
  <img src="https://inkscape.global.ssl.fastly.net/static/images/inkscape-logo.svg" height="48" width="48" /> Inkscape for the Semafloor SVG logo
</a>
9. <a href="https://letsencrypt.org/" class="letsencrypt" target="_blank">
  <img src="https://letsencrypt.org/images/letsencrypt-logo-horizontal.svg" height="48" width="48" /> Let's Encrypt makes the web safer
</a>
10. <a href="https://lodash.com/" class="lodash" target="_blank">
  <img src="http://svgporn.com/logos/lodash.svg" height="48" width="48" /> Lodash the Javascript utility library to enhance the webapp
</a>
11. <a href="http://nginx.org/" class="nginx" target="_blank">
  <img src="http://svgporn.com/logos/nginx.svg" height="48" width="48" /> Nginx to power the backend up
</a>
12. <a href="https://nodejs.org/en/" class="nodejs" target="_blank">
  <img src="http://svgporn.com/logos/nodejs.svg" height="48" width="48" /> NodeJS for backend server
</a>
13. <a href="https://www.polymer-project.org/1.0/" class="polymer" target="_blank">
  <img src="https://elements.polymer-project.org/images/polymer.svg" height="48" width="48" /> Polymer to build the webapp
</a>


## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng
