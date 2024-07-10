# API for Authentication

- This is a readme with all routes

## Auth Routes

### POST ```/api/v1/auth/login```

- method must include a user and password
- method return a BASE64 token with this information:
- ```{ "name": ..., "email": ..., "roles": ..., "expiration":... }```


  Formato json array usuarios:

  {
  "users": [
    {
      "name": "",
      "email": "",
      "password": "",
      "password_second":"",
      "cellphone": ""
    },
    {
      "name": "",
      "email": "",
      "password": "",
      "password_second":"",
      "cellphone": ""
    }
  ]
}
