import { name } from "ejs";
import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

const docrouter = Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Inteko system APIs documentation",
    version: "1.0.0",
    description: "Inteko system APIs documentation",
  },
  basePath: "/api",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "System Authontication", description: "" },
    { name: "Users", description: "Users" },
    { name: "post", description: "post" },
    { name: "categories", description: "categories" },
    { name: "notification", description: "notification" },
    { name: "address", description: "address" },
    { name: "comments", description: "comments" },
    { name: "attandance", description: "attandance" },
    { name: "penalties", description: "penalties" },
    { name: "Fine", description: "Fine" },



  ],
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["System Authontication"],
        summary: "Login a user",
        description: "Login a user",
        operationId: "loginUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "admin@gmail.com",
                password: "admin",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/addUser": {
      post: {
        tags: ["Users"],
        summary: "Add a user",
        description: "Add a user",
        operationId: "addOneUser",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "08012345678",
                role: "province_leader,district_leader,sector_leader,cell_leader,village_leader,admin",
                gender: "Male",
                address: "Gatsata",
                province_id:"1",
                district_id:"1",
                sector_id:"1",
                cell_id:"1",
                village_id:"1",
             
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },



    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Get all users",
        operationId: "getAllUsers",
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user",
        description: "Get a user",
        operationId: "getOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/update/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update a user",
        description: "Update a user",
        operationId: "updateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "08012345678",
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/changePassword": {
      put: {
        tags: ["Users"],
        summary: "change  user password",
        description: "change  user password  for current loged in user !! ",
        operationId: "change-passwordr",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                oldPassword: "oldp",
                newPassword: "newp",
                confirmPassword: "cpass",
               
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password updated  successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/check": {
      post: {
        tags: ["Users"],
        summary: "Get  users user by email by email and send code",
        description: "Get all users",
        operationId: "getAllUserscheck",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "cedrickhakuzimana.com",                    
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User retrived successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/code/{email}": {
      post: {
        tags: ["Users"],
        summary: "check code !",
        description: "checking code send thrugth email",
        operationId: "code",
        parameters: [
          {
            name: "email",
            in: "path",
            description: "User's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                code: "10000",                    
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User retrived successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/resetPassword/{email}": {
      put: {
        tags: ["Users"],
        summary: "reset  user password",
        description: "reset  user password  !! ",
        operationId: "reset-passwordr",
        parameters: [
          {
            name: "email",
            in: "path",
            description: "User's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                newPassword: "newp",
                confirmPassword: "cpass",
               
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password updated  successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/delete/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Delete a user",
        operationId: "deleteOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/activate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Activate a user",
        description: "Activate a user",
        operationId: "activateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/deactivate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Deactivate a user",
        description: "Deactivate a user",
        operationId: "deactivateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deactivated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
   

// post

    "/api/v1/post/add": {
      post: {
        tags: ["post"],
        summary: "Add a post",
        description: "Add a post",
        operationId: "addpost",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/post",
              },
              example: {
                categoryID: "1",
                title: "huye/ngoma",
                description: "descri.......",
                // province_id:"1",
                // district_id:"1",
                // sector_id:"1",
                // cell_id:"1",
                // village_id:"1",
               
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/post",
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "post created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/post/": {
      get: {
        tags: ["post"],
        summary: "Get a post",
        description: "Get a post",
        operationId: "getOnepost",
    
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/post/citizen": {
      get: {
        tags: ["post"],
        summary: "Get a citizen post",
        description: "Get a citizen post",
        operationId: "getcitizen",
    
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/post/delete/{id}": {
      delete: {
        tags: ["post"],
        summary: "delete a post",
        description: "delete a post",
        operationId: "deleteOnepost",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "post's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "post deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
 
    "/api/v1/post/update/{id}": {
      put: {
        tags: ["post"],
        summary: "Add a post",
        description: "Add a post",
        operationId: "updatepost",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "post's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/post",
              },
              example: {
                categoryID: "1",
                name: "huye/ngoma",
                description: "descri.......",
               
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/post",
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "post created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/post/one/{id}": {
      get: {
        tags: ["post"],
        summary: "Get a post",
        description: "Get a post",
        operationId: "getOnepost",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "post's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "post deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/post/approve/{id}": {
      put: {
        tags: ["post"],
        summary: "approve a post",
        description: "activate a post",
        operationId: "approveOnepost",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "post's approve id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "post approve successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/post/reject/{id}": {
      put: {
        tags: ["post"],
        summary: "reject a post",
        description: "reject a post",
        operationId: "rejectpost",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "post's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "post reject successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


      "/api/v1/attandance/add": {
        post: {
          tags: ["attandance"],
          summary: "Add an attendance",
          description: "Record a user's attendance for a post",
          operationId: "addAttendance",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {
                  userID: 1,
                  postID: 1,
                  attended: true
                },
              },
            },
          },
          responses: {
            201: {
              description: "Attendance recorded successfully",
            },
            400: {
              description: "Bad request",
            },
            401: {
              description: "Unauthorized",
            },
            500: {
              description: "Something went wrong",
            },
          },
        },
      },
      
      "/api/v1/attandance": {
        get: {
          tags: ["attandance"],
          summary: "Get all attendances",
          description: "Retrieve all attendance records with user and post details",
          operationId: "getAttendances",
          responses: {
            200: {
              description: "Attendances fetched successfully",
            },
            401: {
              description: "Unauthorized",
            },
            500: {
              description: "Something went wrong",
            },
          },
        },
      },
    
      "/api/v1/attandance/{id}": {
        get: {
          tags: ["attandance"],
          summary: "Get attendance by ID",
          description: "Fetch a single attendance record by ID",
          operationId: "getAttendanceById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Attendance ID",
            },
          ],
          responses: {
            200: {
              description: "Attendance fetched successfully",
            },
            404: {
              description: "Attendance not found",
            },
            500: {
              description: "Something went wrong",
            },
          },
        },
        
        delete: {
          tags: ["attandance"],
          summary: "Delete an attendance",
          description: "Remove an attendance record",
          operationId: "deleteAttendance",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "integer",
              },
              description: "Attendance ID",
            },
          ],
          responses: {
            200: {
              description: "Attendance deleted successfully",
            },
            404: {
              description: "Attendance not found",
            },
            500: {
              description: "Something went wrong",
            },
          },
        },
      },





        "/api/v1/penalties": {
          get: {
            tags: ["penalties"],
            summary: "Get all penalties",
            description: "Retrieve all penalty records with user and post details",
            operationId: "getAllPenalties",
            responses: {
              200: {
                description: "Penalties fetched successfully",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
        "/api/v1/penalties/bylocation": {
          get: {
            tags: ["penalties"],
            summary: "Get all penalties bylocation",
            description: "Retrieve all penalty bylocation records with user and post details",
            operationId: "getAllPenaltiesbylocation",
            responses: {
              200: {
                description: "Penalties fetched successfully",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
      
        "/api/v1/penalties/mypenarities": {
          get: {
            tags: ["penalties"],
            summary: "Get mypenarities by ID",
            description: "Fetch a single penalty record by ID",
            operationId: "Mypenarity",
          
            responses: {
              200: {
                description: "Penalty fetched successfully",
              },
              404: {
                description: "Penalty not found",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
      
        
        },
        "/api/v1/penalties/{id}": {
          get: {
            tags: ["penalties"],
            summary: "Get mypenarities by ID",
            description: "Fetch a single penalty record by ID",
            operationId: "getPenaltyById",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
                description: "Penalty ID",
              },
            ],
            responses: {
              200: {
                description: "Penalty fetched successfully",
              },
              404: {
                description: "Penalty not found",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
      
          delete: {
            tags: ["penalties"],
            summary: "Delete a penalty",
            description: "Remove a penalty record",
            operationId: "deletePenalty",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
                description: "Penalty ID",
              },
            ],
            responses: {
              200: {
                description: "Penalty deleted successfully",
              },
              404: {
                description: "Penalty not found",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
      
      
      
        "/api/v1/penalties/add": {
          post: {
            tags: ["penalties"],
            summary: "Create a new penalty",
            description: "Add a new penalty record for a user",
            operationId: "createPenalty",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    postID: 1,
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Penalty created successfully",
              },
              400: {
                description: "Bad request",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
        "/api/v1/penalties/update/status/{id}": {
          put: {
            tags: ["penalties"],
            summary: "update penalty",
            description: "Add a update penalty record for a user",
            operationId: "update",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
                description: "Penalty ID",
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    status: 'solved',
                 
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Penalty created successfully",
              },
              400: {
                description: "Bad request",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
        "/api/v1/penalties/pay": {
          post: {
            tags: ["penalties"],
            summary: "pay a new pay penalty",
            description: "pay a new penalty record for a user",
            operationId: "payPenalty",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    penaltyID: 1,
                    number: 1,
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Penalty created successfully",
              },
              400: {
                description: "Bad request",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
        "/api/v1/penalties/checkout": {
          post: {
            tags: ["penalties"],
            summary: "pay checkout",
            description: "checkout",
            operationId: "payPenalty",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  example: {
                    number: 1,
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Penalty created successfully",
              },
              400: {
                description: "Bad request",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Something went wrong",
              },
            },
          },
        },
      
      
      
      
    
    





    "/api/v1/notification/": {
      get: {
        tags: ["notification"],
        summary: "Get a notification",
        description: "Get a notification",
        operationId: "getOneNotification",
    
        responses: {
          200: {
            description: " notifications retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read-all": {
      put: {
        tags: ["notification"],
        summary: "mark read a notification",
        description: "read notification",
        operationId: "getreadNotification",
  
        responses: {
          200: {
            description: " notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read/{id}": {
      put: {
        tags: ["notification"],
        summary: "mark one read a notification",
        description: "read one notification",
        operationId: "onereadNotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
  
        responses: {
          200: {
            description: "notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read/{id}": {
      put: {
        tags: ["notification"],
        summary: "read all a notification",
        description: "read all notification",
        operationId: "read_all_notification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

  
        responses: {
          200: {
            description: "notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/delete/{id}": {
      delete: {
        tags: ["notification"],
        summary: "delete a notification",
        description: "delete a notification",
        operationId: "deleteOnenotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

       
        responses: {
          200: {
            description: "notification deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notification/delete-all": {
      delete: {
        tags: ["notification"],
        summary: "delete all notification",
        description: "delete all notification",
        operationId: "deleteALLnotification",
        responses: {
          200: {
            description: "notification deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
// category

    "/api/v1/categories/add": {
      post: {
        tags: ["categories"],
        summary: "Add a department",
        description: "Add a department",
        operationId: "adddepartment",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/categories",
              },
              // example: {
              //   name: "obina",
              //   address: "huye/ngoma",
              //   description: "restourent descri.......",
               
              // },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/": {
      get: {
        tags: ["categories"],
        summary: "Get a categories",
        description: "Get a categories",
        operationId: "getOnecategory",
    
        responses: {
          200: {
            description: "categories deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/delete/{id}": {
      delete: {
        tags: ["categories"],
        summary: "delete a categories",
        description: "delete a categories",
        operationId: "deleteOnecategories",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Restaurent's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/{id}": {
      put: {
        tags: ["categories"],
        summary: "Update a categories",
        description: "Update a categories",
        operationId: "updateOnecategories",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "categories's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/categories",
              },
              // example: {
              //   firstname: "John",
              //   lastname: "Doe",
              //   email: "test@example.com",
              //   phone: "08012345678",
              // },
            },
          },
        },
        responses: {
          200: {
            description: "categories updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/one/{id}": {
      get: {
        tags: ["categories"],
        summary: "Get a categories",
        description: "Get a categories",
        operationId: "getOnecategories",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "categories's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "categories deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/activate/{id}": {
      put: {
        tags: ["categories"],
        summary: "Activate a categories",
        description: "Activate a categories",
        operationId: "activatecategories",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "categories's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "categories activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/categories/diactivate/{id}": {
      put: {
        tags: ["categories"],
        summary: "DisActivate a categories",
        description: "DisActivate a categories",
        operationId: "disactivatecategories",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "categories's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "categories disactivated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/address/": {
      get: {
        tags: ["address"],
        summary: "Get a address",
        description: "Get a address",
        operationId: "address",
    
        responses: {
          200: {
            description: "address deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/post/comment": {
      post: {
        tags: ["comments"],
        summary: "Add a comment",
        description: "Add a comment",
        operationId: "addcomment",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Comment",
              },
              example: {
                comment: "yes yes.......",
                postID:"1",
               
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/fine/": {
      get: {
        tags: ["Fine"],
        summary: "get",
        description: "get Fine",
        operationId: "Fine",

        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/fine/update": {
      put: {
        tags: ["Fine"],
        summary: "get",
        description: "get Fine",
        operationId: "UpdateFine",
        requestBody: {
          content: {
            "application/json": {
              example: {
                amount: 300,
               
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


  },

  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          firstname: {
            type: "string",
            description: "User's firstname",
          },
          lastname: {
            type: "string",
            description: "User's lastname",
          },
          username: {
            type: "string",
            description: "User's names",
          },
          gender: {
            type: "string",
            description: "User's gender",
          },
          dob: {
            type: "string",
            description: "User's date of birth",
          },
          address: {
            type: "string",
            description: "User's address",
          },
          phone: {
            type: "string",
            description: "User's phone number",
          },
          role: {
            type: "string",
            description: "User's role",
          },
          image: {
            type: "string",
            description: "User's post image",
            format: "binary",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          password: {
            type: "string",
            description: "User's password",
          },
          confirm_password: {
            type: "string",
            description: "User's confirm password",
          },
          province_id: {
            type: "string",
            description: "User's province_id",
          },
          district_id: {
            type: "string",
            description: "User's district_id",
          },
          sector_id: {
            type: "string",
            description: "User's sector_id",
          },
          cell_id: {
            type: "string",
            description: "User's cell_id",
          },
          village_id: {
            type: "string",
            description: "User's village_id",
          },
        },
      },
      post: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "post name",
          },
          categoryID: {
            type: "integer",
            description: "category integer",
          },
          description: {
            type: "string",
            description: "post's description",
          },
          image: {
            type: "string",
            description: "post image",
            format: "binary",
          },
          // province_id: {
          //   type: "string",
          //   description: "post's province_id",
          // },
          // district_id: {
          //   type: "string",
          //   description: "post's district_id",
          // },
          // sector_id: {
          //   type: "string",
          //   description: "post's sector_id",
          // },
          // cell_id: {
          //   type: "string",
          //   description: "post's cell_id",
          // },
          // village_id: {
          //   type: "string",
          //   description: "post's village_id",
          // },

        },
      },
 
 
      categories: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "name address",
          },
         
        },
      },
      Comment: {
        type: "object",
        properties: {
          postID: {
            type: "string",
            description: "name postID",
          },
          UserID: {
            type: "string",
            description: "ID ",
          },
          comment: {
            type: "string",
            description: "name comment",
          },
        

         
        },
      },


    
    },

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

docrouter.use("/", serve, setup(options));

export default docrouter;
