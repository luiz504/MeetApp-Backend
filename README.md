# API MeetAPP

MVC / CRUD

## Features
---
 - [x] Account creation

 >Route - post('/users').{body: name, email, password}
 >>Model - User.js /save : id , name, email, password_hash, created/updated_at // Postgres
 >>>Controller - UserController.store
 >>>>View - json({ id, name. email,})

 - without token authentication

 - yupValidation:{

   name: [ string, required ],

   email: [ string, type, required ],

   password: [ string, min6, required ]

 }

 - Validations: {
   email: exists,
 }
---
 - [x] Login
>Route - post('/sessions').{body: email, password}
>>Model - User.js
>>>Controller - SessionController.store
>>>>View - json({ id, name. email, token })

- without token authentication

 - yupValidation: {

   email: [ string, type, required ],

   password: [ string, required ]

 }

- Validations: {
   email: exists,
   password: match,
 }
---
 - [x] Account update

 >Route - put('/users').{body: name, email, oldPassword, password, confirmPassword}
 >>Model - User.js /save : name, email, password_hash, created/updated_at // Postgres
 >>>Controller - UserController.update
 >>>>View - json({ id, name, email })

 - token authentication required

 - yupValidation:{

   name: [ string ],

   email: [ string, type ],

   oldPassword: [string, min6 ],

   password: [ string, min6, required if 'oldPassword' exits, not equal 'oldPassword' ],

   confirmPassword: [ required if password exits, equal 'password' ]

 }

 - Validations: {
   email: exists,
   oldPassword: if provided, check match with password_hash.
 }
---
 - [x] Authentication JTW
 - validations: {

  * token provided,

  * token integrity,

}
---

