# API MeetApp
This application was developed to learn about Noje.js Envirioment following the
MVC / CRUD.

This API will serve the [Mobile](https://github.com/luiz504/MeetApp-Mobile) and [Web](https://github.com/luiz504/MeetApp-Web) applications.


Table of contents
-----------------
* [Features](#Features)
  * [Account Creation](#Account-Creation)
  * [Login](#Login)
  * [Account Update](#Account-Update)
  * [Upload Files](#Upload-Files)
  * [Meetup Creation](#Meetup-Creation)
  * [Meetup List](#Meetup-List)
  * [Meetup Update](#Meetup-Update)
  * [Organizer Delete Meetup ](#Organizer-Delete-Meetup)
  * [Organizer Meetup List](#Organizer-Meetup-List)
  * [Meetup Subscription](#Meetup-Subscription)
    * [E-mail Notification Job trigger](#E-mail-Notification-Job-trigger)
  * [Subscriber meetup List](#Subscriber-meetup-List)
  <!-- * [Provider Notification Mark Read](#Provider-Notification-Mark-Read)
  * [Provider Notification Available Schedule](#Provider-Notification-Available-Schedule) -->
* [Middlewares](#Middlewares)
* [Background Jobs](#BackGround-Jobs)
* [Instructions](#Instructions)

## Features
---

 ### Account Creation

 >Route - post('/users').{body: name, email, password}
 >>Model - User.js /save: id , name, email, password_hash, created/updated_at // Postgres
 >>>Controller - UserController.store
 >>>>View - json({ id, name, email })


 - YupValidations: [

   name: { string, required },

   email: { string, mail(type), required },

   password: { string, min6, required },

    ]

 - Validations: [

   E-mail already in use,

    ]
---

 ### Login
>Route - post('/sessions').{body/Json: email, password}
>>Model - User.js
>>>Controller - SessionController.store
>>>>View - json({ user:{ id, name, email }, token })

 - Without token authentication

 - YupValidations: [

   email: { string, email(type), required },

   password: { string, required },

    ]

- Validations: [

   E-mail exists in DB,

   Password matches,

   ]
---

 ### Account Update

 >Route - put('/users').{body/Json: name, email, oldPassword, password, confirmPassword}.BearerToken({user_id})
 >>Model - User.js /save: name, email, password_hash, updated_at  // Postgres
 >>>Controller - UserController.update
 >>>>View - json({ id, name, email })

 - YupValidations: [

   name: { string },

   email: { string, mail(type) },

   oldPassword: { string, min6 },

   password: { string, min6, required if 'oldPassword' exits, not equal 'oldPassword' },

   confirmPassword: { required if password exits, equal 'password' }

    ]

  - Validations: [

    E-mail already in use,

    Password matchs,

    ]
 ---

 ### Upload Files

 >Route - post('/files').{Multipart: 'file' / img}.BearerToken{user_id}
 >>Model - File.js /save: id, name, path, created/updated_at // belongsTo Meetup.js // Postgres
 >>>Controller - FileControllers.store
 >>>>View - json({ url, id, name, path, update/createdAt })
---

### Meetup Creation

 >Route - post('/meetups').{BearerToken{user_id}
 >>Model - Meetup.js /save: id, banner_id,  user_id, title, description, location, date, created/update_at // Postgres
 >>>Controller - MeetupController.store
 >>>>View - json({ past, id, banner_id, title, description, location, date, user_id, created/updatedAt })

 - YupValidations: [

   banner_id: [ number, required ],

   title: [ string, required ],

   description: [ string, required ],

   location: [ string, required ],

   date: [ date, required ],

    ]

 - Validations: [

   Past dates,

    ]
 ---

 ### Meetup List

 >Route - get('/meetups').{BearerToken{user_id}.{Query: 'date' / ISO date, 'page' / number}
 >>Model - Meetup.js / User.js  // Postgres
 >>>Controller - MeetupController.index
 >>>>View - json([{ past, id, title, description, location, date, created/upatedAt, banner_id, user_id, User: { name, email }}])
---
### Meetup Update

 >Route - put('/meetups/:meetupId').{BearerToken{user_id}
 >>Model - Meetup.js /save: banner_id, title, description, location, date, updated_at // Postgres
 >>>Controller - MeetupController.update
 >>>>View - json({ past, id, title, description, location, date,  created/updatedAt, banner_id, user_id })

 - YupValidations: [

   banner_id: [ number ],

   title: [ string ],

   description: [ string ],

   location: [ string ],

   date: [ date ],

    ]

 - Validations: [

   Meetup exits,

   Logged user is the organizer,

   Meetup date past,

   informed date past,

    ]
 ---

### Organizer Delete Meetup

 >Route - delete('/appointments/:meetupId').{BearerToken{organizer_id}
 >>Model - Meeetup.js /delete: row // Postgres
 >>>Controller - MeetupController.delete
 >>>>View - json({sucess: 'Meetup deleted})

 - Validations: [

   Meetup exists

   Logged user = meetup organizer,

   Past meetups can not be deleted

    ]
---

### Organizer Meetup List

 >Route - get('/organizer').{BearerToken{organizer_id}}
 >>Model - Meetup.js  // Postgres
 >>>Controller - OrganizerController.index
 >>>>View - json([{ past, id, title, description, location, date, created/updatedAt, banner_id user_id, }])
 ---

 ### Meetup Subscription

 >Route - post('/meetups/:meetupId/subscriptions').{BearerToken{user_id}}
 >>Model - Subscription.js /save: id, meetup_id, user_id, created/updated_at User.js  Meetup.js // Postgres
 >>>Controller - SubscriptionController.store
 >>>>View - json({ id, meet_up, user_id, creacted/updatedAt})

  - Validations: [
    Meetup exits,

    Logged account is provider,

    Organizer can subscribe your own meetup

    Meetup already past,

    Check for scheduled meetups at the same time,

    ]
    - #### E-mail Notification Job trigger
  >Model - Queue.js / Mail.js //Redis // Bee-queue
  >Job - SubscriptionMail.js
  >>Layout - Subscription.hbs
  ---

 ### Subscriber meetup List

 >Route - get('/subscriptions').{BearerToken{user_id}
 >>Model - Meetup.js / User.js / File.js // Postgres
 >>>Controller - AppointmentController.index
 >>>>View - json([{ past, cancelable, id, date, provider: { id, name, avatar: { url, id, path }}}]).{order: 'date', pagination: '10' }
 ---

  ## Middlewares
---
 - [x] Bearer Token - Authentication JTW - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
 - Config - /src/config/auth.js
 - Model - /src/app/middlewares/authentication.js
 - validations: [

    * token provided,

    * token integrity,

    ]
---
- [x] Multipart/form-data input - [multer](https://github.com/expressjs/multer)
- Config: /src/config/multer.js
- Output: /tmp/upload - filename manipulation randon hexadecimal string + originalfile .ext

---
- [x] Cross-origin resource sharing - [cors](https://github.com/expressjs/cors)
- File: /src/app.js
---
- [x] Json - JavaScript Object Notation
- File: /src/app.js
---
- [x] Exeption Handler
- File: /src/app.js
- development - [youch](https://github.com/poppinss/youch)
- !development - status(500)

## Background Jobs

- [x] E-mail trap - [TrampMail](https://mailtrap.io/)
- Config: /src/config/mail.js

- [x] E-mail template engine - / [handlebars](https://github.com/wycats/handlebars.js/)
- Model: /src/lib/Mail.js
- Layouts: /src/app/mail/*
---
- [x] Jobs and Queue - [Bee-Queue](https://github.com/bee-queue/bee-queue)
- Queue Model: /src/lib/Queue.js
- Jobs Models: /src/app/jobs/*
- Queue DB : Redis
- Redis Config: /src/config/redis.js
---

## Errors handles after deploy manager
- [x] [Sentry](https://sentry.io)
- Config: /src/config/sentry
- File: /src/app.js


## Instructions

Requirements:

[Docker](https://docs.docker.com/install/) used images : [Postgres](https://hub.docker.com/_/postgres), [Redis Alpine](https://hub.docker.com/_/redis).

- Clone the project.

- Run  `$ yarn` to install modules.

- Config `.env` file based to `.env.example`

- Run `$ yarn start` main application

- Run `$ yarn queue` to run backgroundJobs.

- Requests -

Insomnia - Import insominia.json to your Insomnia app

[Gobarber Web](https://github.com/luiz504/MeetApp-Web) - Provider DashBoard

[Gobarber Mobile](https://github.com/luiz504/MeetApp-Mobile) - Users App














