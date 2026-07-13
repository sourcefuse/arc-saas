---
title: "@sourceloop/ctrl-plane-orchestrator-service v1.3.0"
language_tabs:
  - javascript: JavaScript
  - javascript--nodejs: Node.JS
language_clients:
  - javascript: request
  - javascript--nodejs: ""
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="-sourceloop-ctrl-plane-orchestrator-service">@sourceloop/ctrl-plane-orchestrator-service v1.3.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

ARC SaaS Orchestrator service.

Base URLs:

* <a href="/">/</a>

<h1 id="-sourceloop-ctrl-plane-orchestrator-service-pingcontroller">PingController</h1>

## PingController.ping

<a id="opIdPingController.ping"></a>

> Code samples

```javascript

fetch('/ping',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/ping',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /ping`

<h3 id="pingcontroller.ping-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of PingController.ping|None|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="-sourceloop-ctrl-plane-orchestrator-service-homepagecontroller">HomePageController</h1>

## HomePageController.homePage

<a id="opIdHomePageController.homePage"></a>

> Code samples

```javascript

fetch('/',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

fetch('/',
{
  method: 'GET'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /`

<h3 id="homepagecontroller.homepage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Return value of HomePageController.homePage|None|

<aside class="success">
This operation does not require authentication
</aside>

