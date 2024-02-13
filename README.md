# Simple-CRUD-API

### How to run project locally
1. Clone this repo
2. Switch to `development` branch
3. Start application via one of the predefined scripts, for example
  ```bash
   npm run start:dev
   ```

#### Available scripts
   

| Script                      | What it does                       |
|-----------------------------|------------------------------------|
| `test` | Run test with jest           |
| `test:watch` | Run jest in `--watchAll` mode | 
| `lint` | Run eslint           |
| `lint:fix` | Run eslint with `--fix` option          |
| `format` | Run prettier  with `--write` option         |
| `build` | Build project using webpack. Build is located in `dist` directory          |
| `start:dev` | Serve project in development mode using `ts-node-dev`          |
| `start:prod` | Build project and serve it in production mode           |
| `start:dev:multi` | Serve project in development mode with load balancer         |
| `start:prod:multi` | Build project and serve it in production mode with load balancer           |


#### How to change API port

By default API is listening on port 4000. 
If you want to change it, please, create `.env` file in the project's root directory with the following content: 
```bash
PORT=4000
```
Set value by your choice.

### API endpoints

`GET api/users` - return all users  
`POST api/users` - create new user and return it   
`GET api/users/:id` - return user with provided id  
`PUT api/users/:id` - update existing user and return it  
`DELETE api/users/:id`- delete existing user  

Any other requests will return **404**: Not Found  
  ```json
   {
      "error": {
          "type": "InvalidEndpointError",
          "message": "You don't have access to this endpoint"
      }
    }
  ```  


#### DTOs  
 - ##### UserDto  
    ```ts
    {
      username: string //required  
      age: number //required  
      hobbies: string[] //required
    }
    ```
#### Entities  
 - ##### User  
    ```ts
    {
      id: UUID
      username: string  
      age: number
      hobbies: string[]
    }
    ```

#### `GET /api/users`  
- **Response**:
  - **200**: Success  
    ```json
      {
        "data": [
          {
              "id": "d8c32a1a-09ed-4dd9-b5ee-10987c89ebd0",
              "username": "name",
              "age": 10,
              "hobbies": [
                  "chess"
              ]
          },
          // ...
        ]
      }
    ```

#### `POST /api/users`  
##### **Body - UserDTO**  
- **Response**:
  - **201**: Success  
    ```json
      {
        "data": {
            "id": "d8c32a1a-09ed-4dd9-b5ee-10987c89ebd0",
            "username": "name",
            "age": 10,
            "hobbies": [
                "chess"
            ]
        }
      }
    ```
  - **400**: Bad Request
    ```json
      {
        "error": {
          "type": "InvalidUserData",
          "message": "Request body must be in the following format: { username: string, age: number, hobbies: string[] }"
        }
      }
    ```
    
#### `GET /api/users/:id`  
- **Response**:
  - **200**: Success  
    ```json
      {
        "data": {
              "id": "d8c32a1a-09ed-4dd9-b5ee-10987c89ebd0",
              "username": "name",
              "age": 10,
              "hobbies": [
                  "chess"
              ]
          }
      }
    ```
  - **400**: Bad Request
    ```json
      {
        "error": {
            "type": "InvalidUserId",
            "message": "Invalid user id. Id must be a valid uuid"
        }
      }
    ```
  - **404**: Not Found
    ```json
      {
        "error": {
            "type": "UserNotFound",
            "message": "User not found"
        }
      }
    ```   

#### `PUT /api/users/:id`
##### **Body - UserDTO** 
- **Response**:
  - **200**: Success  
    ```json
      {
        "data": {
              "id": "d8c32a1a-09ed-4dd9-b5ee-10987c89ebd0",
              "username": "name",
              "age": 10,
              "hobbies": [
                  "chess"
              ]
          }
      }
    ```
  - **400**: Bad Request
    ```json
      {
        "error": {
            "type": "InvalidUserId",
            "message": "Invalid user id. Id must be a valid uuid"
        }
      }
    ```
  - **404**: Not Found
    ```json
      {
        "error": {
            "type": "UserNotFound",
            "message": "User not found"
        }
      }
    ```  

#### `DELETE /api/users/:id`
- **Response**:
  - **204**: Success  
  - **400**: Bad Request
    ```json
      {
        "error": {
            "type": "InvalidUserId",
            "message": "Invalid user id. Id must be a valid uuid"
        }
      }
    ```
  - **404**: Not Found
    ```json
      {
        "error": {
            "type": "UserNotFound",
            "message": "User not found"
        }
      }
    ```
