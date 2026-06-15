---
title: Tenant Management Service v1.0.0
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

<h1 id="tenant-management-service">Tenant Management Service v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Tenant Management microservice for SaaS control plane

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="tenant-management-service-contactcontroller">ContactController</h1>

## ContactController.count

<a id="opIdContactController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /contacts/count`

| Permissions |
| ------- |
| 10211   |

<h3 id="contactcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="contactcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Contact model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.replaceById

<a id="opIdContactController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /contacts/{id}`

| Permissions |
| ------- |
| 10209   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Contact](#schemacontact)|false|none|

<h3 id="contactcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Contact PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.updateById

<a id="opIdContactController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /contacts/{id}`

| Permissions |
| ------- |
| 10209   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[ContactPartial](#schemacontactpartial)|false|none|

> Example responses

> 204 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Contact PATCH success|[Contact](#schemacontact)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.findById

<a id="opIdContactController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /contacts/{id}`

| Permissions |
| ------- |
| 10211   |

<h3 id="contactcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[contacts.Filter](#schemacontacts.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Contact model instance|[Contact](#schemacontact)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.deleteById

<a id="opIdContactController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /contacts/{id}`

| Permissions |
| ------- |
| 10210   |

<h3 id="contactcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="contactcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Contact DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.create

<a id="opIdContactController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /contacts`

| Permissions |
| ------- |
| 10208   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewContact](#schemanewcontact)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Contact model instance|[Contact](#schemacontact)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.updateAll

<a id="opIdContactController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /contacts`

| Permissions |
| ------- |
| 10209   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[ContactPartial](#schemacontactpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}
```

<h3 id="contactcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Contact PATCH success|[Contact](#schemacontact)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## ContactController.find

<a id="opIdContactController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/contacts',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /contacts`

| Permissions |
| ------- |
| 10211   |

<h3 id="contactcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[contacts.Filter1](#schemacontacts.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string",
    "tenantId": "string",
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 0,
      "key": "string",
      "spocUserId": "string",
      "domains": [
        "string"
      ],
      "leadId": "string",
      "addressId": "string"
    },
    "foreignKey": null
  }
]
```

<h3 id="contactcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Contact model instances|Inline|

<h3 id="contactcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[ContactWithRelations](#schemacontactwithrelations)]|false|none|[contacts belonging to a tenant (tsType: ContactWithRelations, schemaOptions: { includeRelations: true })]|
|» ContactWithRelations|[ContactWithRelations](#schemacontactwithrelations)|false|none|contacts belonging to a tenant (tsType: ContactWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» firstName|string|true|none|first name of the lead|
|»» lastName|string|true|none|last name of the lead|
|»» email|string|true|none|email id of the contact|
|»» isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|»» type|string|false|none|type of the contact|
|»» tenantId|string|false|none|tenant id this contact belongs to|
|»» tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|true|none|name of the tenant|
|»»» status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|»»» key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|»»» spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|»»» domains|[string]|true|none|none|
|»»» leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|»»» addressId|string|false|none|id of the address of the tenant|
|»» foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-invoicecontroller">InvoiceController</h1>

## InvoiceController.count

<a id="opIdInvoiceController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /invoices/count`

| Permissions |
| ------- |
| 10215   |

<h3 id="invoicecontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="invoicecontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Invoice model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.downloadInvoice

<a id="opIdInvoiceController.downloadInvoice"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/download',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/download',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /invoices/download`

| Permissions |
| ------- |
| 10212   |

<h3 id="invoicecontroller.downloadinvoice-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|number|true|none|

<h3 id="invoicecontroller.downloadinvoice-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Invoice download success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.replaceById

<a id="opIdInvoiceController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /invoices/{id}`

| Permissions |
| ------- |
| 10213   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Invoice](#schemainvoice)|false|none|

<h3 id="invoicecontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Invoice PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.updateById

<a id="opIdInvoiceController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /invoices/{id}`

| Permissions |
| ------- |
| 10213   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[InvoicePartial](#schemainvoicepartial)|false|none|

> Example responses

> 204 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Invoice PATCH success|[Invoice](#schemainvoice)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.findById

<a id="opIdInvoiceController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /invoices/{id}`

| Permissions |
| ------- |
| 10215   |

<h3 id="invoicecontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[invoices.Filter](#schemainvoices.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Invoice model instance success|[Invoice](#schemainvoice)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.deleteById

<a id="opIdInvoiceController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /invoices/{id}`

| Permissions |
| ------- |
| 10214   |

<h3 id="invoicecontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="invoicecontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Invoice DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.create

<a id="opIdInvoiceController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /invoices`

| Permissions |
| ------- |
| 10212   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewInvoice](#schemanewinvoice)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Invoice model instance POST success|[Invoice](#schemainvoice)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.updateAll

<a id="opIdInvoiceController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /invoices`

| Permissions |
| ------- |
| 10213   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[InvoicePartial](#schemainvoicepartial)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}
```

<h3 id="invoicecontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Invoice PATCH success|[Invoice](#schemainvoice)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## InvoiceController.find

<a id="opIdInvoiceController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/invoices',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /invoices`

| Permissions |
| ------- |
| 10215   |

<h3 id="invoicecontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[invoices.Filter1](#schemainvoices.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "startDate": "string",
    "endDate": "string",
    "amount": 0,
    "currencyCode": "string",
    "invoiceFile": "string",
    "dueDate": "string",
    "status": "PENDING",
    "tenantId": "string",
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 0,
      "key": "string",
      "spocUserId": "string",
      "domains": [
        "string"
      ],
      "leadId": "string",
      "addressId": "string"
    },
    "foreignKey": null
  }
]
```

<h3 id="invoicecontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Invoice model instances|Inline|

<h3 id="invoicecontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[InvoiceWithRelations](#schemainvoicewithrelations)]|false|none|[this model represents an invoice with the amount and period generated for a tenant in the system (tsType: InvoiceWithRelations, schemaOptions: { includeRelations: true })]|
|» InvoiceWithRelations|[InvoiceWithRelations](#schemainvoicewithrelations)|false|none|this model represents an invoice with the amount and period generated for a tenant in the system (tsType: InvoiceWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» startDate|string|true|none|start date for the period this invoice is generated for|
|»» endDate|string|true|none|end date for the period this invoice is generated for|
|»» amount|number|true|none|total amount for the invoice|
|»» currencyCode|string|true|none|currency for the invoice|
|»» invoiceFile|string|false|none|option reference to the generated file of the invoice|
|»» dueDate|string|true|none|due date for the invoice|
|»» status|number|true|none|status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)|
|»» tenantId|string|true|none|id of the tenant this invoice is generated for|
|»» tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|true|none|name of the tenant|
|»»» status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|»»» key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|»»» spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|»»» domains|[string]|true|none|none|
|»»» leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|»»» addressId|string|false|none|id of the address of the tenant|
|»» foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|PENDING|
|status|PAID|
|status|CANCELLED|
|status|0|
|status|1|
|status|2|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-leadcontroller">LeadController</h1>

## LeadController.count

<a id="opIdLeadController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /leads/count`

| Permissions |
| ------- |
| 10203   |

<h3 id="leadcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="leadcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lead model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.validateLead

<a id="opIdLeadController.validateLead"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}/verify',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}/verify',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /leads/{id}/verify`

<h3 id="leadcontroller.validatelead-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "id": "string",
  "token": "string"
}
```

<h3 id="leadcontroller.validatelead-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|A response with token for the verified lead|[VerifyLeadResponseDTO](#schemaverifyleadresponsedto)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.replaceById

<a id="opIdLeadController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /leads/{id}`

| Permissions |
| ------- |
| 10201   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Lead](#schemalead)|false|none|

<h3 id="leadcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Lead PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.updateById

<a id="opIdLeadController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /leads/{id}`

| Permissions |
| ------- |
| 10201   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[LeadPartial](#schemaleadpartial)|false|none|

> Example responses

> 204 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Lead PATCH success|[Lead](#schemalead)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.findById

<a id="opIdLeadController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /leads/{id}`

| Permissions |
| ------- |
| 10203   |

<h3 id="leadcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[leads.Filter](#schemaleads.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lead model instance|[Lead](#schemalead)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.deleteById

<a id="opIdLeadController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /leads/{id}`

| Permissions |
| ------- |
| 10202   |

<h3 id="leadcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="leadcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Lead DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.create

<a id="opIdLeadController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/leads',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/leads',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /leads`

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}
```

<h3 id="leadcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CreateLeadDTO](#schemacreateleaddto)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lead model instance|[Lead](#schemalead)|

<aside class="success">
This operation does not require authentication
</aside>

## LeadController.updateAll

<a id="opIdLeadController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /leads`

| Permissions |
| ------- |
| 10201   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[LeadPartial](#schemaleadpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}
```

<h3 id="leadcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Lead PATCH success|[Lead](#schemalead)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## LeadController.find

<a id="opIdLeadController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /leads`

| Permissions |
| ------- |
| 10203   |

<h3 id="leadcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[leads.Filter1](#schemaleads.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "companyName": "string",
    "email": "string",
    "isValidated": true,
    "addressId": "string",
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 0,
      "key": "string",
      "spocUserId": "string",
      "domains": [
        "string"
      ],
      "leadId": "string",
      "addressId": "string"
    },
    "address": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    },
    "foreignKey": null
  }
]
```

<h3 id="leadcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Lead model instances|Inline|

<h3 id="leadcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[LeadWithRelations](#schemaleadwithrelations)]|false|none|[this model represents a lead that could eventually be a tenant in the system (tsType: LeadWithRelations, schemaOptions: { includeRelations: true })]|
|» LeadWithRelations|[LeadWithRelations](#schemaleadwithrelations)|false|none|this model represents a lead that could eventually be a tenant in the system (tsType: LeadWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» firstName|string|true|none|first name of the lead|
|»» lastName|string|true|none|last name of the lead|
|»» companyName|string|true|none|name of the lead's company|
|»» email|string|true|none|email of the lead|
|»» isValidated|boolean|true|none|whether the lead`s email has been validated or not|
|»» addressId|string|false|none|id of the address of the lead|
|»» tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|true|none|name of the tenant|
|»»» status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|»»» key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|»»» spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|»»» domains|[string]|true|none|none|
|»»» leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|»»» addressId|string|false|none|id of the address of the tenant|
|»» address|[Address](#schemaaddress)|false|none|this model represents the address of a company or lead|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» address|string|false|none|address of the company|
|»»» city|string|false|none|city of the company|
|»»» state|string|false|none|state of the company|
|»»» zip|string|false|none|zip code of the company|
|»»» country|string|true|none|country of the company|
|»» foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-leadtenantcontroller">LeadTenantController</h1>

## LeadTenantController.tenantFromLead

<a id="opIdLeadTenantController.tenantFromLead"></a>

> Code samples

```javascript
const inputBody = '{
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}/tenants',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/leads/{id}/tenants',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /leads/{id}/tenants`

> Body parameter

```json
{
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}
```

<h3 id="leadtenantcontroller.tenantfromlead-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TenantOnboardDto](#schematenantonboarddto)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="leadtenantcontroller.tenantfromlead-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-idpcontroller">IdpController</h1>

## IdpController.idpConfigure

<a id="opIdIdpController.idpConfigure"></a>

> Code samples

```javascript
const inputBody = '{
  "tenant": {},
  "plan": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/manage/users',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "tenant": {},
  "plan": {}
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/manage/users',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /manage/users`

> Body parameter

```json
{
  "tenant": {},
  "plan": {}
}
```

<h3 id="idpcontroller.idpconfigure-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[IdpDetailsDTO](#schemaidpdetailsdto)|false|none|

<h3 id="idpcontroller.idpconfigure-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Webhook success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-pingcontroller">PingController</h1>

## PingController.ping

<a id="opIdPingController.ping"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/ping',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json'
};

fetch('/ping',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /ping`

> Example responses

> 200 Response

```json
{
  "greeting": "string",
  "date": "string",
  "url": "string",
  "headers": {
    "Content-Type": "string"
  }
}
```

<h3 id="pingcontroller.ping-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Ping Response|[PingResponse](#schemapingresponse)|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="tenant-management-service-tenantmgmtconfigcontroller">TenantMgmtConfigController</h1>

## TenantMgmtConfigController.count

<a id="opIdTenantMgmtConfigController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenant-configs/count`

| Permissions |
| ------- |
| 10221   |

<h3 id="tenantmgmtconfigcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenantmgmtconfigcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant Config model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.replaceById

<a id="opIdTenantMgmtConfigController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /tenant-configs/{id}`

| Permissions |
| ------- |
| 10222   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TenantMgmtConfig](#schematenantmgmtconfig)|false|none|

<h3 id="tenantmgmtconfigcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant Config PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.updateById

<a id="opIdTenantMgmtConfigController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tenant-configs/{id}`

| Permissions |
| ------- |
| 10222   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TenantMgmtConfigPartial](#schematenantmgmtconfigpartial)|false|none|

> Example responses

> 204 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant Config PATCH success|[TenantMgmtConfig](#schematenantmgmtconfig)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.findById

<a id="opIdTenantMgmtConfigController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenant-configs/{id}`

| Permissions |
| ------- |
| 10221   |

<h3 id="tenantmgmtconfigcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[tenant_mgmt_configs.Filter](#schematenant_mgmt_configs.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant Config model instance|[TenantMgmtConfig](#schematenantmgmtconfig)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.deleteById

<a id="opIdTenantMgmtConfigController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tenant-configs/{id}`

| Permissions |
| ------- |
| 10223   |

<h3 id="tenantmgmtconfigcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tenantmgmtconfigcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.create

<a id="opIdTenantMgmtConfigController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tenant-configs`

| Permissions |
| ------- |
| 10220   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTenantConfig](#schemanewtenantconfig)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant Config model instance|[TenantMgmtConfig](#schematenantmgmtconfig)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.updateAll

<a id="opIdTenantMgmtConfigController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tenant-configs`

| Permissions |
| ------- |
| 10222   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TenantMgmtConfigPartial](#schematenantmgmtconfigpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}
```

<h3 id="tenantmgmtconfigcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant Config PATCH success|[TenantMgmtConfig](#schematenantmgmtconfig)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantMgmtConfigController.find

<a id="opIdTenantMgmtConfigController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenant-configs`

| Permissions |
| ------- |
| 10221   |

<h3 id="tenantmgmtconfigcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[tenant_mgmt_configs.Filter1](#schematenant_mgmt_configs.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "configKey": "string",
    "configValue": {},
    "tenantId": "string",
    "tenant": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "name": "string",
      "status": 0,
      "key": "string",
      "spocUserId": "string",
      "domains": [
        "string"
      ],
      "leadId": "string",
      "addressId": "string"
    },
    "foreignKey": null
  }
]
```

<h3 id="tenantmgmtconfigcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of TenantConfig model instances|Inline|

<h3 id="tenantmgmtconfigcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TenantMgmtConfigWithRelations](#schematenantmgmtconfigwithrelations)]|false|none|[tenant_mgmt_configs to save any tenant specific data related to idP (tsType: TenantMgmtConfigWithRelations, schemaOptions: { includeRelations: true })]|
|» TenantMgmtConfigWithRelations|[TenantMgmtConfigWithRelations](#schematenantmgmtconfigwithrelations)|false|none|tenant_mgmt_configs to save any tenant specific data related to idP (tsType: TenantMgmtConfigWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» configKey|string|true|none|none|
|»» configValue|object|true|none|none|
|»» tenantId|string|true|none|id of the tenant this invoice is generated for|
|»» tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» name|string|true|none|name of the tenant|
|»»» status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|»»» key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|»»» spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|»»» domains|[string]|true|none|none|
|»»» leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|»»» addressId|string|false|none|id of the address of the tenant|
|»» foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-tenantmgmtconfigtenantcontroller">TenantMgmtConfigTenantController</h1>

## TenantMgmtConfigTenantController.getTenant

<a id="opIdTenantMgmtConfigTenantController.getTenant"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}/tenant',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenant-configs/{id}/tenant',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenant-configs/{id}/tenant`

| Permissions |
| ------- |
| 10221   |

<h3 id="tenantmgmtconfigtenantcontroller.gettenant-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantmgmtconfigtenantcontroller.gettenant-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant belonging to TenantConfig|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-tenantcontroller">TenantController</h1>

## TenantController.count

<a id="opIdTenantController.count"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/count',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenants/count`

| Permissions |
| ------- |
| 10207   |

<h3 id="tenantcontroller.count-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|

> Example responses

> 200 Response

```json
{
  "count": 0
}
```

<h3 id="tenantcontroller.count-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model count|[loopback.Count](#schemaloopback.count)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.provision

<a id="opIdTenantController.provision"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "subscriberId": "string",
  "startDate": "string",
  "endDate": "string",
  "status": 0,
  "planId": "string",
  "invoiceId": "string",
  "plan": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}/provision',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "subscriberId": "string",
  "startDate": "string",
  "endDate": "string",
  "status": 0,
  "planId": "string",
  "invoiceId": "string",
  "plan": {}
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}/provision',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tenants/{id}/provision`

| Permissions |
| ------- |
| 10216   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "subscriberId": "string",
  "startDate": "string",
  "endDate": "string",
  "status": 0,
  "planId": "string",
  "invoiceId": "string",
  "plan": {}
}
```

<h3 id="tenantcontroller.provision-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[SubscriptionDTO](#schemasubscriptiondto)|false|none|

<h3 id="tenantcontroller.provision-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Provisioning success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.replaceById

<a id="opIdTenantController.replaceById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'PUT',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PUT /tenants/{id}`

| Permissions |
| ------- |
| 10205   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.replacebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[Tenant](#schematenant)|false|none|

<h3 id="tenantcontroller.replacebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant PUT success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.updateById

<a id="opIdTenantController.updateById"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tenants/{id}`

| Permissions |
| ------- |
| 10205   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.updatebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|[TenantPartial](#schematenantpartial)|false|none|

> Example responses

> 204 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.updatebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant PATCH success|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.findById

<a id="opIdTenantController.findById"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenants/{id}`

| Permissions |
| ------- |
| 10207   |

<h3 id="tenantcontroller.findbyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|filter|query|[tenants.Filter](#schematenants.filter)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.findbyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.deleteById

<a id="opIdTenantController.deleteById"></a>

> Code samples

```javascript

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants/{id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`DELETE /tenants/{id}`

| Permissions |
| ------- |
| 10206   |

<h3 id="tenantcontroller.deletebyid-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

<h3 id="tenantcontroller.deletebyid-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Tenant DELETE success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.create

<a id="opIdTenantController.create"></a>

> Code samples

```javascript
const inputBody = '{
  "contact": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string"
  },
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "contact": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string"
  },
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /tenants`

| Permissions |
| ------- |
| 10204   |

> Body parameter

```json
{
  "contact": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string"
  },
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}
```

<h3 id="tenantcontroller.create-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[NewTenantOnboarding](#schemanewtenantonboarding)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.create-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant model instance|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.updateAll

<a id="opIdTenantController.updateAll"></a>

> Code samples

```javascript
const inputBody = '{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
};
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'PATCH',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`PATCH /tenants`

| Permissions |
| ------- |
| 10205   |

> Body parameter

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.updateall-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|where|query|object|false|none|
|body|body|[TenantPartial](#schematenantpartial)|false|none|

> Example responses

> 200 Response

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}
```

<h3 id="tenantcontroller.updateall-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tenant PATCH success|[Tenant](#schematenant)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

## TenantController.find

<a id="opIdTenantController.find"></a>

> Code samples

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/tenants',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /tenants`

| Permissions |
| ------- |
| 10207   |

<h3 id="tenantcontroller.find-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|filter|query|[tenants.Filter1](#schematenants.filter1)|false|none|

> Example responses

> 200 Response

```json
[
  {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 0,
    "key": "string",
    "spocUserId": "string",
    "domains": [
      "string"
    ],
    "leadId": "string",
    "addressId": "string",
    "contacts": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "isPrimary": true,
        "type": "string",
        "tenantId": "string"
      }
    ],
    "resources": [
      {
        "deleted": true,
        "deletedOn": "2019-08-24T14:15:22Z",
        "deletedBy": "string",
        "createdOn": "2019-08-24T14:15:22Z",
        "modifiedOn": "2019-08-24T14:15:22Z",
        "createdBy": "string",
        "modifiedBy": "string",
        "id": "string",
        "externalIdentifier": "string",
        "type": "string",
        "metadata": {},
        "tenantId": "string"
      }
    ],
    "lead": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "companyName": "string",
      "email": "string",
      "isValidated": true,
      "addressId": "string"
    },
    "foreignKey": null,
    "address": {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string"
    }
  }
]
```

<h3 id="tenantcontroller.find-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Array of Tenant model instances|Inline|

<h3 id="tenantcontroller.find-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[TenantWithRelations](#schematenantwithrelations)]|false|none|[main model of the service that represents a tenant in the system, either pooled or siloed (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })]|
|» TenantWithRelations|[TenantWithRelations](#schematenantwithrelations)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed (tsType: TenantWithRelations, schemaOptions: { includeRelations: true })|
|»» deleted|boolean|false|none|none|
|»» deletedOn|string(date-time)¦null|false|none|none|
|»» deletedBy|string¦null|false|none|none|
|»» createdOn|string(date-time)|false|none|none|
|»» modifiedOn|string(date-time)|false|none|none|
|»» createdBy|string|false|none|none|
|»» modifiedBy|string|false|none|none|
|»» id|string|false|none|none|
|»» name|string|true|none|name of the tenant|
|»» status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|»» key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|»» spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|»» domains|[string]|true|none|none|
|»» leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|»» addressId|string|false|none|id of the address of the tenant|
|»» contacts|[[Contact](#schemacontact)]|false|none|[contacts belonging to a tenant]|
|»»» Contact|[Contact](#schemacontact)|false|none|contacts belonging to a tenant|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» firstName|string|true|none|first name of the lead|
|»»»» lastName|string|true|none|last name of the lead|
|»»»» email|string|true|none|email id of the contact|
|»»»» isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|»»»» type|string|false|none|type of the contact|
|»»»» tenantId|string|false|none|tenant id this contact belongs to|
|»» resources|[[Resource](#schemaresource)]|false|none|[model for resources that are provisioned for a tenant]|
|»»» Resource|[Resource](#schemaresource)|false|none|model for resources that are provisioned for a tenant|
|»»»» deleted|boolean|false|none|none|
|»»»» deletedOn|string(date-time)¦null|false|none|none|
|»»»» deletedBy|string¦null|false|none|none|
|»»»» createdOn|string(date-time)|false|none|none|
|»»»» modifiedOn|string(date-time)|false|none|none|
|»»»» createdBy|string|false|none|none|
|»»»» modifiedBy|string|false|none|none|
|»»»» id|string|false|none|none|
|»»»» externalIdentifier|string|true|none|identifier for the resource in the external system it was provisioned|
|»»»» type|string|true|none|type of the resource like storage, compute, etc|
|»»»» metadata|object|true|none|any type specific metadata of the resource like connection info, size, etc|
|»»»» tenantId|string|false|none|id of the tenant for which this resource is provisioned|
|»» lead|[Lead](#schemalead)|false|none|this model represents a lead that could eventually be a tenant in the system|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» firstName|string|true|none|first name of the lead|
|»»» lastName|string|true|none|last name of the lead|
|»»» companyName|string|true|none|name of the lead's company|
|»»» email|string|true|none|email of the lead|
|»»» isValidated|boolean|true|none|whether the lead`s email has been validated or not|
|»»» addressId|string|false|none|id of the address of the lead|
|»» foreignKey|any|false|none|none|
|»» address|[Address](#schemaaddress)|false|none|this model represents the address of a company or lead|
|»»» deleted|boolean|false|none|none|
|»»» deletedOn|string(date-time)¦null|false|none|none|
|»»» deletedBy|string¦null|false|none|none|
|»»» createdOn|string(date-time)|false|none|none|
|»»» modifiedOn|string(date-time)|false|none|none|
|»»» createdBy|string|false|none|none|
|»»» modifiedBy|string|false|none|none|
|»»» id|string|false|none|none|
|»»» address|string|false|none|address of the company|
|»»» city|string|false|none|city of the company|
|»»» state|string|false|none|state of the company|
|»»» zip|string|false|none|zip code of the company|
|»»» country|string|true|none|country of the company|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-webhookcontroller">WebhookController</h1>

## WebhookController.webhook

<a id="opIdWebhookController.webhook"></a>

> Code samples

```javascript
const inputBody = '{
  "initiatorId": "string",
  "data": {},
  "type": 0
}';
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/webhook',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');
const inputBody = {
  "initiatorId": "string",
  "data": {},
  "type": 0
};
const headers = {
  'Content-Type':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/webhook',
{
  method: 'POST',
  body: JSON.stringify(inputBody),
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /webhook`

> Body parameter

```json
{
  "initiatorId": "string",
  "data": {},
  "type": 0
}
```

<h3 id="webhookcontroller.webhook-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[WebhookDTO](#schemawebhookdto)|false|none|

<h3 id="webhookcontroller.webhook-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Webhook success|None|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
HTTPBearer
</aside>

<h1 id="tenant-management-service-homepagecontroller">HomePageController</h1>

## HomePageController.homePage

<a id="opIdHomePageController.homePage"></a>

> Code samples

```javascript

const headers = {
  'Accept':'text/html'
};

fetch('/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```javascript--nodejs
const fetch = require('node-fetch');

const headers = {
  'Accept':'text/html'
};

fetch('/',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /`

> Example responses

> 200 Response

```
"string"
```

<h3 id="homepagecontroller.homepage-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Home Page|string|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Tenant">Tenant</h2>
<!-- backwards compatibility -->
<a id="schematenant"></a>
<a id="schema_Tenant"></a>
<a id="tocStenant"></a>
<a id="tocstenant"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}

```

Tenant

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|name|string|true|none|name of the tenant|
|status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|domains|[string]|true|none|none|
|leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|addressId|string|false|none|id of the address of the tenant|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<h2 id="tocS_NewTenantOnboarding">NewTenantOnboarding</h2>
<!-- backwards compatibility -->
<a id="schemanewtenantonboarding"></a>
<a id="schema_NewTenantOnboarding"></a>
<a id="tocSnewtenantonboarding"></a>
<a id="tocsnewtenantonboarding"></a>

```json
{
  "contact": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string"
  },
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}

```

NewTenantOnboarding

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|contact|object|false|none|contacts belonging to a tenant (tsType: Omit<Contact, 'tenantId' | 'id'>, schemaOptions: { exclude: [ 'tenantId', 'id' ] })|
|» deleted|boolean|false|none|none|
|» deletedOn|string(date-time)¦null|false|none|none|
|» deletedBy|string¦null|false|none|none|
|» createdOn|string(date-time)|false|none|none|
|» modifiedOn|string(date-time)|false|none|none|
|» createdBy|string|false|none|none|
|» modifiedBy|string|false|none|none|
|» firstName|string|true|none|first name of the lead|
|» lastName|string|true|none|last name of the lead|
|» email|string|true|none|email id of the contact|
|» isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|» type|string|false|none|type of the contact|
|name|string|true|none|none|
|address|string|false|none|address of the tenant owners|
|city|string|false|none|city of the tenant owner|
|state|string|false|none|state of the tenant owner|
|zip|string|false|none|zip code of the tenant owner|
|country|string|false|none|country of the tenant owner|
|key|string|true|none|none|
|domains|[string]|true|none|none|

<h2 id="tocS_TenantOnboardDTO">TenantOnboardDTO</h2>
<!-- backwards compatibility -->
<a id="schematenantonboarddto"></a>
<a id="schema_TenantOnboardDTO"></a>
<a id="tocStenantonboarddto"></a>
<a id="tocstenantonboarddto"></a>

```json
{
  "contact": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "isPrimary": true,
    "type": "string"
  },
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}

```

TenantOnboardDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|contact|object|false|none|contacts belonging to a tenant (tsType: Omit<Contact, 'tenantId' | 'id'>, schemaOptions: { exclude: [ 'tenantId', 'id' ] })|
|» deleted|boolean|false|none|none|
|» deletedOn|string(date-time)¦null|false|none|none|
|» deletedBy|string¦null|false|none|none|
|» createdOn|string(date-time)|false|none|none|
|» modifiedOn|string(date-time)|false|none|none|
|» createdBy|string|false|none|none|
|» modifiedBy|string|false|none|none|
|» firstName|string|true|none|first name of the lead|
|» lastName|string|true|none|last name of the lead|
|» email|string|true|none|email id of the contact|
|» isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|» type|string|false|none|type of the contact|
|name|string|true|none|none|
|address|string|false|none|address of the tenant owners|
|city|string|false|none|city of the tenant owner|
|state|string|false|none|state of the tenant owner|
|zip|string|false|none|zip code of the tenant owner|
|country|string|false|none|country of the tenant owner|
|key|string|true|none|none|
|domains|[string]|true|none|none|

<h2 id="tocS_SubscriptionDTO">SubscriptionDTO</h2>
<!-- backwards compatibility -->
<a id="schemasubscriptiondto"></a>
<a id="schema_SubscriptionDTO"></a>
<a id="tocSsubscriptiondto"></a>
<a id="tocssubscriptiondto"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "subscriberId": "string",
  "startDate": "string",
  "endDate": "string",
  "status": 0,
  "planId": "string",
  "invoiceId": "string",
  "plan": {}
}

```

SubscriptionDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)|false|none|none|
|deletedBy|string|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|subscriberId|string|false|none|none|
|startDate|string|false|none|none|
|endDate|string|false|none|none|
|status|number|false|none|none|
|planId|string|false|none|none|
|invoiceId|string|false|none|none|
|plan|object|false|none|none|

<h2 id="tocS_Contact">Contact</h2>
<!-- backwards compatibility -->
<a id="schemacontact"></a>
<a id="schema_Contact"></a>
<a id="tocScontact"></a>
<a id="tocscontact"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}

```

Contact

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|email|string|true|none|email id of the contact|
|isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|type|string|false|none|type of the contact|
|tenantId|string|false|none|tenant id this contact belongs to|

<h2 id="tocS_Resource">Resource</h2>
<!-- backwards compatibility -->
<a id="schemaresource"></a>
<a id="schema_Resource"></a>
<a id="tocSresource"></a>
<a id="tocsresource"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "externalIdentifier": "string",
  "type": "string",
  "metadata": {},
  "tenantId": "string"
}

```

Resource

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|externalIdentifier|string|true|none|identifier for the resource in the external system it was provisioned|
|type|string|true|none|type of the resource like storage, compute, etc|
|metadata|object|true|none|any type specific metadata of the resource like connection info, size, etc|
|tenantId|string|false|none|id of the tenant for which this resource is provisioned|

<h2 id="tocS_Lead">Lead</h2>
<!-- backwards compatibility -->
<a id="schemalead"></a>
<a id="schema_Lead"></a>
<a id="tocSlead"></a>
<a id="tocslead"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}

```

Lead

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|companyName|string|true|none|name of the lead's company|
|email|string|true|none|email of the lead|
|isValidated|boolean|true|none|whether the lead`s email has been validated or not|
|addressId|string|false|none|id of the address of the lead|

<h2 id="tocS_Address">Address</h2>
<!-- backwards compatibility -->
<a id="schemaaddress"></a>
<a id="schema_Address"></a>
<a id="tocSaddress"></a>
<a id="tocsaddress"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string"
}

```

Address

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|address|string|false|none|address of the company|
|city|string|false|none|city of the company|
|state|string|false|none|state of the company|
|zip|string|false|none|zip code of the company|
|country|string|true|none|country of the company|

<h2 id="tocS_TenantWithRelations">TenantWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematenantwithrelations"></a>
<a id="schema_TenantWithRelations"></a>
<a id="tocStenantwithrelations"></a>
<a id="tocstenantwithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string",
  "contacts": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isPrimary": true,
      "type": "string",
      "tenantId": "string"
    }
  ],
  "resources": [
    {
      "deleted": true,
      "deletedOn": "2019-08-24T14:15:22Z",
      "deletedBy": "string",
      "createdOn": "2019-08-24T14:15:22Z",
      "modifiedOn": "2019-08-24T14:15:22Z",
      "createdBy": "string",
      "modifiedBy": "string",
      "id": "string",
      "externalIdentifier": "string",
      "type": "string",
      "metadata": {},
      "tenantId": "string"
    }
  ],
  "lead": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "companyName": "string",
    "email": "string",
    "isValidated": true,
    "addressId": "string"
  },
  "foreignKey": null,
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}

```

TenantWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|name|string|true|none|name of the tenant|
|status|number|true|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|key|string|true|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|domains|[string]|true|none|none|
|leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|addressId|string|false|none|id of the address of the tenant|
|contacts|[[Contact](#schemacontact)]|false|none|[contacts belonging to a tenant]|
|resources|[[Resource](#schemaresource)]|false|none|[model for resources that are provisioned for a tenant]|
|lead|[Lead](#schemalead)|false|none|this model represents a lead that could eventually be a tenant in the system|
|foreignKey|any|false|none|none|
|address|[Address](#schemaaddress)|false|none|this model represents the address of a company or lead|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<h2 id="tocS_TenantPartial">TenantPartial</h2>
<!-- backwards compatibility -->
<a id="schematenantpartial"></a>
<a id="schema_TenantPartial"></a>
<a id="tocStenantpartial"></a>
<a id="tocstenantpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "name": "string",
  "status": 0,
  "key": "string",
  "spocUserId": "string",
  "domains": [
    "string"
  ],
  "leadId": "string",
  "addressId": "string"
}

```

TenantPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|name|string|false|none|name of the tenant|
|status|number|false|none|status of a tenant, it can be - 0(active), 1(provisioning),2(deprovisioning),3(inactive)|
|key|string|false|none|a short string used to identify a tenant. This is also used as the namespace and subdomain for this particular tenant|
|spocUserId|string|false|none|user id of the admin user who acts as a spoc for this tenant.|
|domains|[string]|false|none|none|
|leadId|string|false|none|id of the lead from which this tenant was generated. this is optional as a tenant can be created without this lead.|
|addressId|string|false|none|id of the address of the tenant|

#### Enumerated Values

|Property|Value|
|---|---|
|status|0|
|status|1|
|status|2|
|status|3|
|status|4|
|status|5|

<h2 id="tocS_CreateLeadDTO">CreateLeadDTO</h2>
<!-- backwards compatibility -->
<a id="schemacreateleaddto"></a>
<a id="schema_CreateLeadDTO"></a>
<a id="tocScreateleaddto"></a>
<a id="tocscreateleaddto"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  }
}

```

CreateLeadDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|companyName|string|true|none|name of the lead's company|
|email|string|true|none|email of the lead|
|address|object|false|none|this model represents the address of a company or lead (tsType: @loopback/repository-json-schema#Optional<Omit<Address, 'id'>, 'country'>, schemaOptions: { exclude: [ 'id' ], optional: [ 'country' ] })|
|» deleted|boolean|false|none|none|
|» deletedOn|string(date-time)¦null|false|none|none|
|» deletedBy|string¦null|false|none|none|
|» createdOn|string(date-time)|false|none|none|
|» modifiedOn|string(date-time)|false|none|none|
|» createdBy|string|false|none|none|
|» modifiedBy|string|false|none|none|
|» address|string|false|none|address of the company|
|» city|string|false|none|city of the company|
|» state|string|false|none|state of the company|
|» zip|string|false|none|zip code of the company|
|» country|string|false|none|country of the company|

<h2 id="tocS_VerifyLeadResponseDTO">VerifyLeadResponseDTO</h2>
<!-- backwards compatibility -->
<a id="schemaverifyleadresponsedto"></a>
<a id="schema_VerifyLeadResponseDTO"></a>
<a id="tocSverifyleadresponsedto"></a>
<a id="tocsverifyleadresponsedto"></a>

```json
{
  "id": "string",
  "token": "string"
}

```

VerifyLeadResponseDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|none|
|token|string|true|none|none|

<h2 id="tocS_LeadWithRelations">LeadWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemaleadwithrelations"></a>
<a id="schema_LeadWithRelations"></a>
<a id="tocSleadwithrelations"></a>
<a id="tocsleadwithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string",
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 0,
    "key": "string",
    "spocUserId": "string",
    "domains": [
      "string"
    ],
    "leadId": "string",
    "addressId": "string"
  },
  "address": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "foreignKey": null
}

```

LeadWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|companyName|string|true|none|name of the lead's company|
|email|string|true|none|email of the lead|
|isValidated|boolean|true|none|whether the lead`s email has been validated or not|
|addressId|string|false|none|id of the address of the lead|
|tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|address|[Address](#schemaaddress)|false|none|this model represents the address of a company or lead|
|foreignKey|any|false|none|none|

<h2 id="tocS_LeadPartial">LeadPartial</h2>
<!-- backwards compatibility -->
<a id="schemaleadpartial"></a>
<a id="schema_LeadPartial"></a>
<a id="tocSleadpartial"></a>
<a id="tocsleadpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "companyName": "string",
  "email": "string",
  "isValidated": true,
  "addressId": "string"
}

```

LeadPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|false|none|first name of the lead|
|lastName|string|false|none|last name of the lead|
|companyName|string|false|none|name of the lead's company|
|email|string|false|none|email of the lead|
|isValidated|boolean|false|none|whether the lead`s email has been validated or not|
|addressId|string|false|none|id of the address of the lead|

<h2 id="tocS_TenantOnboardDto">TenantOnboardDto</h2>
<!-- backwards compatibility -->
<a id="schematenantonboarddto"></a>
<a id="schema_TenantOnboardDto"></a>
<a id="tocStenantonboarddto"></a>
<a id="tocstenantonboarddto"></a>

```json
{
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "key": "string",
  "domains": [
    "example.com"
  ]
}

```

TenantOnboardDto

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|name|string|false|none|none|
|address|string|false|none|address of the tenant owners|
|city|string|false|none|city of the tenant owner|
|state|string|false|none|state of the tenant owner|
|zip|string|false|none|zip code of the tenant owner|
|country|string|false|none|country of the tenant owner|
|key|string|true|none|none|
|domains|[string]|true|none|none|

<h2 id="tocS_Invoice">Invoice</h2>
<!-- backwards compatibility -->
<a id="schemainvoice"></a>
<a id="schema_Invoice"></a>
<a id="tocSinvoice"></a>
<a id="tocsinvoice"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}

```

Invoice

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|startDate|string|true|none|start date for the period this invoice is generated for|
|endDate|string|true|none|end date for the period this invoice is generated for|
|amount|number|true|none|total amount for the invoice|
|currencyCode|string|true|none|currency for the invoice|
|invoiceFile|string|false|none|option reference to the generated file of the invoice|
|dueDate|string|true|none|due date for the invoice|
|status|number|true|none|status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)|
|tenantId|string|true|none|id of the tenant this invoice is generated for|

#### Enumerated Values

|Property|Value|
|---|---|
|status|PENDING|
|status|PAID|
|status|CANCELLED|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_NewInvoice">NewInvoice</h2>
<!-- backwards compatibility -->
<a id="schemanewinvoice"></a>
<a id="schema_NewInvoice"></a>
<a id="tocSnewinvoice"></a>
<a id="tocsnewinvoice"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}

```

NewInvoice

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|startDate|string|true|none|start date for the period this invoice is generated for|
|endDate|string|true|none|end date for the period this invoice is generated for|
|amount|number|true|none|total amount for the invoice|
|currencyCode|string|true|none|currency for the invoice|
|invoiceFile|string|false|none|option reference to the generated file of the invoice|
|dueDate|string|true|none|due date for the invoice|
|status|number|true|none|status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)|
|tenantId|string|true|none|id of the tenant this invoice is generated for|

#### Enumerated Values

|Property|Value|
|---|---|
|status|PENDING|
|status|PAID|
|status|CANCELLED|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_InvoiceWithRelations">InvoiceWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemainvoicewithrelations"></a>
<a id="schema_InvoiceWithRelations"></a>
<a id="tocSinvoicewithrelations"></a>
<a id="tocsinvoicewithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string",
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 0,
    "key": "string",
    "spocUserId": "string",
    "domains": [
      "string"
    ],
    "leadId": "string",
    "addressId": "string"
  },
  "foreignKey": null
}

```

InvoiceWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|startDate|string|true|none|start date for the period this invoice is generated for|
|endDate|string|true|none|end date for the period this invoice is generated for|
|amount|number|true|none|total amount for the invoice|
|currencyCode|string|true|none|currency for the invoice|
|invoiceFile|string|false|none|option reference to the generated file of the invoice|
|dueDate|string|true|none|due date for the invoice|
|status|number|true|none|status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)|
|tenantId|string|true|none|id of the tenant this invoice is generated for|
|tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|foreignKey|any|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|status|PENDING|
|status|PAID|
|status|CANCELLED|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_InvoicePartial">InvoicePartial</h2>
<!-- backwards compatibility -->
<a id="schemainvoicepartial"></a>
<a id="schema_InvoicePartial"></a>
<a id="tocSinvoicepartial"></a>
<a id="tocsinvoicepartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "startDate": "string",
  "endDate": "string",
  "amount": 0,
  "currencyCode": "string",
  "invoiceFile": "string",
  "dueDate": "string",
  "status": "PENDING",
  "tenantId": "string"
}

```

InvoicePartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|startDate|string|false|none|start date for the period this invoice is generated for|
|endDate|string|false|none|end date for the period this invoice is generated for|
|amount|number|false|none|total amount for the invoice|
|currencyCode|string|false|none|currency for the invoice|
|invoiceFile|string|false|none|option reference to the generated file of the invoice|
|dueDate|string|false|none|due date for the invoice|
|status|number|false|none|status of the invoice - 0(PENDING), 1(PAID), 2(CANCELLED)|
|tenantId|string|false|none|id of the tenant this invoice is generated for|

#### Enumerated Values

|Property|Value|
|---|---|
|status|PENDING|
|status|PAID|
|status|CANCELLED|
|status|0|
|status|1|
|status|2|

<h2 id="tocS_NewContact">NewContact</h2>
<!-- backwards compatibility -->
<a id="schemanewcontact"></a>
<a id="schema_NewContact"></a>
<a id="tocSnewcontact"></a>
<a id="tocsnewcontact"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}

```

NewContact

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|email|string|true|none|email id of the contact|
|isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|type|string|false|none|type of the contact|
|tenantId|string|false|none|tenant id this contact belongs to|

<h2 id="tocS_ContactWithRelations">ContactWithRelations</h2>
<!-- backwards compatibility -->
<a id="schemacontactwithrelations"></a>
<a id="schema_ContactWithRelations"></a>
<a id="tocScontactwithrelations"></a>
<a id="tocscontactwithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string",
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 0,
    "key": "string",
    "spocUserId": "string",
    "domains": [
      "string"
    ],
    "leadId": "string",
    "addressId": "string"
  },
  "foreignKey": null
}

```

ContactWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|true|none|first name of the lead|
|lastName|string|true|none|last name of the lead|
|email|string|true|none|email id of the contact|
|isPrimary|boolean|true|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|type|string|false|none|type of the contact|
|tenantId|string|false|none|tenant id this contact belongs to|
|tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|foreignKey|any|false|none|none|

<h2 id="tocS_ContactPartial">ContactPartial</h2>
<!-- backwards compatibility -->
<a id="schemacontactpartial"></a>
<a id="schema_ContactPartial"></a>
<a id="tocScontactpartial"></a>
<a id="tocscontactpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "isPrimary": true,
  "type": "string",
  "tenantId": "string"
}

```

ContactPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|firstName|string|false|none|first name of the lead|
|lastName|string|false|none|last name of the lead|
|email|string|false|none|email id of the contact|
|isPrimary|boolean|false|none|boolean value denoting if the contact is a primary contact for it's tenant.|
|type|string|false|none|type of the contact|
|tenantId|string|false|none|tenant id this contact belongs to|

<h2 id="tocS_WebhookDTO">WebhookDTO</h2>
<!-- backwards compatibility -->
<a id="schemawebhookdto"></a>
<a id="schema_WebhookDTO"></a>
<a id="tocSwebhookdto"></a>
<a id="tocswebhookdto"></a>

```json
{
  "initiatorId": "string",
  "data": {},
  "type": 0
}

```

WebhookDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|initiatorId|string|true|none|none|
|data|object|true|none|none|
|type|number|true|none|none|

<h2 id="tocS_TenantMgmtConfig">TenantMgmtConfig</h2>
<!-- backwards compatibility -->
<a id="schematenantmgmtconfig"></a>
<a id="schema_TenantMgmtConfig"></a>
<a id="tocStenantmgmtconfig"></a>
<a id="tocstenantmgmtconfig"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}

```

TenantMgmtConfig

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|configKey|string|true|none|none|
|configValue|object|true|none|none|
|tenantId|string|true|none|id of the tenant this invoice is generated for|

<h2 id="tocS_NewTenantConfig">NewTenantConfig</h2>
<!-- backwards compatibility -->
<a id="schemanewtenantconfig"></a>
<a id="schema_NewTenantConfig"></a>
<a id="tocSnewtenantconfig"></a>
<a id="tocsnewtenantconfig"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}

```

NewTenantConfig

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|configKey|string|true|none|none|
|configValue|object|true|none|none|
|tenantId|string|true|none|id of the tenant this invoice is generated for|

<h2 id="tocS_TenantMgmtConfigWithRelations">TenantMgmtConfigWithRelations</h2>
<!-- backwards compatibility -->
<a id="schematenantmgmtconfigwithrelations"></a>
<a id="schema_TenantMgmtConfigWithRelations"></a>
<a id="tocStenantmgmtconfigwithrelations"></a>
<a id="tocstenantmgmtconfigwithrelations"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string",
  "tenant": {
    "deleted": true,
    "deletedOn": "2019-08-24T14:15:22Z",
    "deletedBy": "string",
    "createdOn": "2019-08-24T14:15:22Z",
    "modifiedOn": "2019-08-24T14:15:22Z",
    "createdBy": "string",
    "modifiedBy": "string",
    "id": "string",
    "name": "string",
    "status": 0,
    "key": "string",
    "spocUserId": "string",
    "domains": [
      "string"
    ],
    "leadId": "string",
    "addressId": "string"
  },
  "foreignKey": null
}

```

TenantMgmtConfigWithRelations

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|configKey|string|true|none|none|
|configValue|object|true|none|none|
|tenantId|string|true|none|id of the tenant this invoice is generated for|
|tenant|[Tenant](#schematenant)|false|none|main model of the service that represents a tenant in the system, either pooled or siloed|
|foreignKey|any|false|none|none|

<h2 id="tocS_TenantMgmtConfigPartial">TenantMgmtConfigPartial</h2>
<!-- backwards compatibility -->
<a id="schematenantmgmtconfigpartial"></a>
<a id="schema_TenantMgmtConfigPartial"></a>
<a id="tocStenantmgmtconfigpartial"></a>
<a id="tocstenantmgmtconfigpartial"></a>

```json
{
  "deleted": true,
  "deletedOn": "2019-08-24T14:15:22Z",
  "deletedBy": "string",
  "createdOn": "2019-08-24T14:15:22Z",
  "modifiedOn": "2019-08-24T14:15:22Z",
  "createdBy": "string",
  "modifiedBy": "string",
  "id": "string",
  "configKey": "string",
  "configValue": {},
  "tenantId": "string"
}

```

TenantMgmtConfigPartial

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|deleted|boolean|false|none|none|
|deletedOn|string(date-time)¦null|false|none|none|
|deletedBy|string¦null|false|none|none|
|createdOn|string(date-time)|false|none|none|
|modifiedOn|string(date-time)|false|none|none|
|createdBy|string|false|none|none|
|modifiedBy|string|false|none|none|
|id|string|false|none|none|
|configKey|string|false|none|none|
|configValue|object|false|none|none|
|tenantId|string|false|none|id of the tenant this invoice is generated for|

<h2 id="tocS_IdpDetailsDTO">IdpDetailsDTO</h2>
<!-- backwards compatibility -->
<a id="schemaidpdetailsdto"></a>
<a id="schema_IdpDetailsDTO"></a>
<a id="tocSidpdetailsdto"></a>
<a id="tocsidpdetailsdto"></a>

```json
{
  "tenant": {},
  "plan": {}
}

```

IdpDetailsDTO

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|tenant|object|false|none|Tenat object|
|plan|object|false|none|plan object|

<h2 id="tocS_loopback.Count">loopback.Count</h2>
<!-- backwards compatibility -->
<a id="schemaloopback.count"></a>
<a id="schema_loopback.Count"></a>
<a id="tocSloopback.count"></a>
<a id="tocsloopback.count"></a>

```json
{
  "count": 0
}

```

loopback.Count

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|count|number|false|none|none|

<h2 id="tocS_contacts.ScopeFilter">contacts.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemacontacts.scopefilter"></a>
<a id="schema_contacts.ScopeFilter"></a>
<a id="tocScontacts.scopefilter"></a>
<a id="tocscontacts.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

contacts.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_contacts.IncludeFilter.Items">contacts.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemacontacts.includefilter.items"></a>
<a id="schema_contacts.IncludeFilter.Items"></a>
<a id="tocScontacts.includefilter.items"></a>
<a id="tocscontacts.includefilter.items"></a>

```json
{
  "relation": "tenant",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

contacts.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[contacts.ScopeFilter](#schemacontacts.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|tenant|

<h2 id="tocS_contacts.Filter">contacts.Filter</h2>
<!-- backwards compatibility -->
<a id="schemacontacts.filter"></a>
<a id="schema_contacts.Filter"></a>
<a id="tocScontacts.filter"></a>
<a id="tocscontacts.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "firstName": true,
    "lastName": true,
    "email": true,
    "isPrimary": true,
    "type": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

contacts.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» type|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[contacts.IncludeFilter.Items](#schemacontacts.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_contacts.Filter1">contacts.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemacontacts.filter1"></a>
<a id="schema_contacts.Filter1"></a>
<a id="tocScontacts.filter1"></a>
<a id="tocscontacts.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "firstName": true,
    "lastName": true,
    "email": true,
    "isPrimary": true,
    "type": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

contacts.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» isPrimary|boolean|false|none|none|
|»» type|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[contacts.IncludeFilter.Items](#schemacontacts.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_invoices.ScopeFilter">invoices.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemainvoices.scopefilter"></a>
<a id="schema_invoices.ScopeFilter"></a>
<a id="tocSinvoices.scopefilter"></a>
<a id="tocsinvoices.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

invoices.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_invoices.IncludeFilter.Items">invoices.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemainvoices.includefilter.items"></a>
<a id="schema_invoices.IncludeFilter.Items"></a>
<a id="tocSinvoices.includefilter.items"></a>
<a id="tocsinvoices.includefilter.items"></a>

```json
{
  "relation": "tenant",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

invoices.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[invoices.ScopeFilter](#schemainvoices.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|tenant|

<h2 id="tocS_invoices.Filter">invoices.Filter</h2>
<!-- backwards compatibility -->
<a id="schemainvoices.filter"></a>
<a id="schema_invoices.Filter"></a>
<a id="tocSinvoices.filter"></a>
<a id="tocsinvoices.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "startDate": true,
    "endDate": true,
    "amount": true,
    "currencyCode": true,
    "invoiceFile": true,
    "dueDate": true,
    "status": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

invoices.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» amount|boolean|false|none|none|
|»» currencyCode|boolean|false|none|none|
|»» invoiceFile|boolean|false|none|none|
|»» dueDate|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[invoices.IncludeFilter.Items](#schemainvoices.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_invoices.Filter1">invoices.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemainvoices.filter1"></a>
<a id="schema_invoices.Filter1"></a>
<a id="tocSinvoices.filter1"></a>
<a id="tocsinvoices.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "startDate": true,
    "endDate": true,
    "amount": true,
    "currencyCode": true,
    "invoiceFile": true,
    "dueDate": true,
    "status": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

invoices.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» startDate|boolean|false|none|none|
|»» endDate|boolean|false|none|none|
|»» amount|boolean|false|none|none|
|»» currencyCode|boolean|false|none|none|
|»» invoiceFile|boolean|false|none|none|
|»» dueDate|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[invoices.IncludeFilter.Items](#schemainvoices.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_leads.ScopeFilter">leads.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schemaleads.scopefilter"></a>
<a id="schema_leads.ScopeFilter"></a>
<a id="tocSleads.scopefilter"></a>
<a id="tocsleads.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

leads.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_leads.IncludeFilter.Items">leads.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schemaleads.includefilter.items"></a>
<a id="schema_leads.IncludeFilter.Items"></a>
<a id="tocSleads.includefilter.items"></a>
<a id="tocsleads.includefilter.items"></a>

```json
{
  "relation": "tenant",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

leads.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[leads.ScopeFilter](#schemaleads.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|tenant|
|relation|address|

<h2 id="tocS_leads.Filter">leads.Filter</h2>
<!-- backwards compatibility -->
<a id="schemaleads.filter"></a>
<a id="schema_leads.Filter"></a>
<a id="tocSleads.filter"></a>
<a id="tocsleads.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "firstName": true,
    "lastName": true,
    "companyName": true,
    "email": true,
    "isValidated": true,
    "addressId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

leads.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» companyName|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» isValidated|boolean|false|none|none|
|»» addressId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[leads.IncludeFilter.Items](#schemaleads.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_leads.Filter1">leads.Filter1</h2>
<!-- backwards compatibility -->
<a id="schemaleads.filter1"></a>
<a id="schema_leads.Filter1"></a>
<a id="tocSleads.filter1"></a>
<a id="tocsleads.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "firstName": true,
    "lastName": true,
    "companyName": true,
    "email": true,
    "isValidated": true,
    "addressId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

leads.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» firstName|boolean|false|none|none|
|»» lastName|boolean|false|none|none|
|»» companyName|boolean|false|none|none|
|»» email|boolean|false|none|none|
|»» isValidated|boolean|false|none|none|
|»» addressId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[leads.IncludeFilter.Items](#schemaleads.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_PingResponse">PingResponse</h2>
<!-- backwards compatibility -->
<a id="schemapingresponse"></a>
<a id="schema_PingResponse"></a>
<a id="tocSpingresponse"></a>
<a id="tocspingresponse"></a>

```json
{
  "greeting": "string",
  "date": "string",
  "url": "string",
  "headers": {
    "Content-Type": "string"
  }
}

```

PingResponse

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|greeting|string|false|none|none|
|date|string|false|none|none|
|url|string|false|none|none|
|headers|object|false|none|none|
|» Content-Type|string|false|none|none|

<h2 id="tocS_tenant_mgmt_configs.ScopeFilter">tenant_mgmt_configs.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schematenant_mgmt_configs.scopefilter"></a>
<a id="schema_tenant_mgmt_configs.ScopeFilter"></a>
<a id="tocStenant_mgmt_configs.scopefilter"></a>
<a id="tocstenant_mgmt_configs.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

tenant_mgmt_configs.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_tenant_mgmt_configs.IncludeFilter.Items">tenant_mgmt_configs.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schematenant_mgmt_configs.includefilter.items"></a>
<a id="schema_tenant_mgmt_configs.IncludeFilter.Items"></a>
<a id="tocStenant_mgmt_configs.includefilter.items"></a>
<a id="tocstenant_mgmt_configs.includefilter.items"></a>

```json
{
  "relation": "tenant",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

tenant_mgmt_configs.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[tenant_mgmt_configs.ScopeFilter](#schematenant_mgmt_configs.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|tenant|

<h2 id="tocS_tenant_mgmt_configs.Filter">tenant_mgmt_configs.Filter</h2>
<!-- backwards compatibility -->
<a id="schematenant_mgmt_configs.filter"></a>
<a id="schema_tenant_mgmt_configs.Filter"></a>
<a id="tocStenant_mgmt_configs.filter"></a>
<a id="tocstenant_mgmt_configs.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "configKey": true,
    "configValue": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

tenant_mgmt_configs.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» configKey|boolean|false|none|none|
|»» configValue|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[tenant_mgmt_configs.IncludeFilter.Items](#schematenant_mgmt_configs.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_tenant_mgmt_configs.Filter1">tenant_mgmt_configs.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematenant_mgmt_configs.filter1"></a>
<a id="schema_tenant_mgmt_configs.Filter1"></a>
<a id="tocStenant_mgmt_configs.filter1"></a>
<a id="tocstenant_mgmt_configs.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "configKey": true,
    "configValue": true,
    "tenantId": true
  },
  "include": [
    {
      "relation": "tenant",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

tenant_mgmt_configs.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» configKey|boolean|false|none|none|
|»» configValue|boolean|false|none|none|
|»» tenantId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[tenant_mgmt_configs.IncludeFilter.Items](#schematenant_mgmt_configs.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_tenants.ScopeFilter">tenants.ScopeFilter</h2>
<!-- backwards compatibility -->
<a id="schematenants.scopefilter"></a>
<a id="schema_tenants.ScopeFilter"></a>
<a id="tocStenants.scopefilter"></a>
<a id="tocstenants.scopefilter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {},
  "include": [
    {}
  ]
}

```

tenants.ScopeFilter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[object]|false|none|none|

<h2 id="tocS_tenants.IncludeFilter.Items">tenants.IncludeFilter.Items</h2>
<!-- backwards compatibility -->
<a id="schematenants.includefilter.items"></a>
<a id="schema_tenants.IncludeFilter.Items"></a>
<a id="tocStenants.includefilter.items"></a>
<a id="tocstenants.includefilter.items"></a>

```json
{
  "relation": "contacts",
  "scope": {
    "offset": 0,
    "limit": 100,
    "skip": 0,
    "order": "string",
    "where": {},
    "fields": {},
    "include": [
      {}
    ]
  }
}

```

tenants.IncludeFilter.Items

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|relation|string|false|none|none|
|scope|[tenants.ScopeFilter](#schematenants.scopefilter)|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|relation|contacts|
|relation|resources|
|relation|lead|
|relation|address|

<h2 id="tocS_tenants.Filter">tenants.Filter</h2>
<!-- backwards compatibility -->
<a id="schematenants.filter"></a>
<a id="schema_tenants.Filter"></a>
<a id="tocStenants.filter"></a>
<a id="tocstenants.filter"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "name": true,
    "status": true,
    "key": true,
    "spocUserId": true,
    "domains": true,
    "leadId": true,
    "addressId": true
  },
  "include": [
    {
      "relation": "contacts",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

tenants.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» spocUserId|boolean|false|none|none|
|»» domains|boolean|false|none|none|
|»» leadId|boolean|false|none|none|
|»» addressId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[tenants.IncludeFilter.Items](#schematenants.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

<h2 id="tocS_tenants.Filter1">tenants.Filter1</h2>
<!-- backwards compatibility -->
<a id="schematenants.filter1"></a>
<a id="schema_tenants.Filter1"></a>
<a id="tocStenants.filter1"></a>
<a id="tocstenants.filter1"></a>

```json
{
  "offset": 0,
  "limit": 100,
  "skip": 0,
  "order": "string",
  "where": {},
  "fields": {
    "deleted": true,
    "deletedOn": true,
    "deletedBy": true,
    "createdOn": true,
    "modifiedOn": true,
    "createdBy": true,
    "modifiedBy": true,
    "id": true,
    "name": true,
    "status": true,
    "key": true,
    "spocUserId": true,
    "domains": true,
    "leadId": true,
    "addressId": true
  },
  "include": [
    {
      "relation": "contacts",
      "scope": {
        "offset": 0,
        "limit": 100,
        "skip": 0,
        "order": "string",
        "where": {},
        "fields": {},
        "include": [
          {}
        ]
      }
    }
  ]
}

```

tenants.Filter

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|offset|integer|false|none|none|
|limit|integer|false|none|none|
|skip|integer|false|none|none|
|order|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|where|object|false|none|none|
|fields|any|false|none|none|

oneOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|object|false|none|none|
|»» deleted|boolean|false|none|none|
|»» deletedOn|boolean|false|none|none|
|»» deletedBy|boolean|false|none|none|
|»» createdOn|boolean|false|none|none|
|»» modifiedOn|boolean|false|none|none|
|»» createdBy|boolean|false|none|none|
|»» modifiedBy|boolean|false|none|none|
|»» id|boolean|false|none|none|
|»» name|boolean|false|none|none|
|»» status|boolean|false|none|none|
|»» key|boolean|false|none|none|
|»» spocUserId|boolean|false|none|none|
|»» domains|boolean|false|none|none|
|»» leadId|boolean|false|none|none|
|»» addressId|boolean|false|none|none|

xor

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[string]|false|none|none|

continued

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|include|[anyOf]|false|none|none|

anyOf

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|[tenants.IncludeFilter.Items](#schematenants.includefilter.items)|false|none|none|

or

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» *anonymous*|string|false|none|none|

