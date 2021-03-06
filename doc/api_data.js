define({ "api": [
  {
    "type": "post",
    "url": "/category/create",
    "title": "Create category",
    "name": "Create_category",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of category</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parent_id",
            "description": "<p>Parent category Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "content",
            "description": "<p>Additional description for category</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "is_active",
            "description": "<p>Activation status for category</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "icon",
            "description": "<p>Icon image of user</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/category.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/faq",
    "title": "Create faq",
    "name": "Create_faq",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>FAQ question</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "answer",
            "description": "<p>FAQ answer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>Category of FAQ</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "is_active",
            "description": "<p>Activation status for faq</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "faq",
            "description": "<p>FAQ details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/faq.js",
    "groupTitle": "Admin"
  },
  {
    "type": "delete",
    "url": "/category",
    "title": "Delete category",
    "name": "Delete_category",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Category Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Success",
            "description": "<p>message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/category.js",
    "groupTitle": "Admin"
  },
  {
    "type": "delete",
    "url": "/faq",
    "title": "Delete faq",
    "name": "Delete_faq",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>FAQ Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Success",
            "description": "<p>message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/faq.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/category_faq",
    "title": "Get all faqs for given category",
    "name": "Get_all_faqs_for_given_category",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>category Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "faqs",
            "description": "<p>FAQ details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/category_details",
    "title": "Retrive category details",
    "name": "Retrive_category_details",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>category Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "category",
            "description": "<p>Category details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/faq_details",
    "title": "Retrive faq details",
    "name": "Retrive_faq_details",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "faq_id",
            "description": "<p>faq Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "faq",
            "description": "<p>Faq details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Admin"
  },
  {
    "type": "post",
    "url": "/category/update",
    "title": "Update category",
    "name": "Update_category",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Category Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of category</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parent_id",
            "description": "<p>Parent category Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "content",
            "description": "<p>Additional description for category</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "icon",
            "description": "<p>Icon image of user</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/category.js",
    "groupTitle": "Admin"
  },
  {
    "type": "put",
    "url": "/faq",
    "title": "Update faq",
    "name": "Update_faq",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Admin's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>FAQ Id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>FAQ question</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "answer",
            "description": "<p>FAQ answer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category_id",
            "description": "<p>Category of FAQ</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "is_active",
            "description": "<p>Activation status for faq</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin/faq.js",
    "groupTitle": "Admin"
  },
  {
    "type": "get",
    "url": "/driver/get_details",
    "title": "Get Driver details of current logged in driver",
    "name": "Get_Driver_details_of_current_logged_in_driver",
    "group": "Driver",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Driver's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/index.js",
    "groupTitle": "Driver"
  },
  {
    "type": "get",
    "url": "/driver/statistics",
    "title": "Get earning statistics of driver",
    "name": "Get_earning_statistics_of_driver",
    "group": "Driver",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Driver's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/index.js",
    "groupTitle": "Driver"
  },
  {
    "type": "put",
    "url": "/driver/update",
    "title": "Update driver profile",
    "name": "Update_driver_profile",
    "group": "Driver",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "residential_status",
            "description": "<p>Value should be from &quot;Citizen&quot;, &quot;Greencard&quot; or &quot;Visa&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "avatar",
            "description": "<p>Profile image of user</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "drive_type",
            "description": "<p>Array of string can have value from &quot;Sedan&quot;, &quot;SUV&quot; and &quot;Van&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "transmission_type",
            "description": "<p>Value can be either &quot;Automatic&quot; or &quot;Manual&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "license",
            "description": "<p>Image of license</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "birth_certi",
            "description": "<p>Image of Birth certificate or passport</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "home_insurance",
            "description": "<p>Image of home insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "auto_insurance",
            "description": "<p>Image of auto insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "pay_stub",
            "description": "<p>Image of Uber pay stub</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bank_routing_no",
            "description": "<p>Bank routing number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "bank_account_no",
            "description": "<p>Bank account number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "ssn",
            "description": "<p>Social security number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "city",
            "description": "<p>City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "state",
            "description": "<p>State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "zipcode",
            "description": "<p>Zipcode</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/index.js",
    "groupTitle": "Driver"
  },
  {
    "type": "get",
    "url": "/driver/notification",
    "title": "Get notification",
    "name": "Get_notification",
    "group": "Driver_notification",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Driver's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "notification",
            "description": "<p>Array of notification's document</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/notification.js",
    "groupTitle": "Driver_notification"
  },
  {
    "type": "get",
    "url": "/driver/trip/history",
    "title": "Get driver's past trip",
    "name": "Get_driver_s_past_trip",
    "group": "Driver_trip",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Driver's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trip",
            "description": "<p>Array of trip's document</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/trip.js",
    "groupTitle": "Driver_trip"
  },
  {
    "type": "post",
    "url": "/driver/trip/rate_user",
    "title": "Rate user",
    "name": "Rate_user",
    "group": "Driver_trip",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Driver's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trip_id",
            "description": "<p>Trip id for which driver is giving rate</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rate_point",
            "description": "<p>Rating point that driver has given to user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/driver/trip.js",
    "groupTitle": "Driver_trip"
  },
  {
    "type": "post",
    "url": "/admin_login",
    "title": "Admin Login",
    "name": "Admin_Login",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "admin",
            "description": "<p>Admin object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Unique token which needs to be passed in subsequent requests.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>Unique token which needs to be passed to generate next access token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/calculate_fare",
    "title": "Calculate fare",
    "name": "Calculate_fare",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pick_lat",
            "description": "<p>Pickup latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pick_long",
            "description": "<p>Pickup longitude</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dest_lat",
            "description": "<p>Destination latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dest_long",
            "description": "<p>Destination longitude</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/contact_support",
    "title": "Contact support",
    "name": "Contact_support",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>Subject of email address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Email message</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "attachments",
            "description": "<p>Attached files</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/driver_signup",
    "title": "Driver Signup",
    "name": "Driver_Signup",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "residential_status",
            "description": "<p>Value should be from &quot;Citizen&quot;, &quot;Greencard&quot; or &quot;Visa&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "avatar",
            "description": "<p>Profile image of user</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "drive_type",
            "description": "<p>Array of string can have value from &quot;Sedan&quot;, &quot;SUV&quot; and &quot;Van&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transmission_type",
            "description": "<p>Value can be either &quot;Automatic&quot; or &quot;Manual&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "license",
            "description": "<p>Image of license</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "birth_certi",
            "description": "<p>Image of Birth certificate or passport</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "home_insurance",
            "description": "<p>Image of home insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "auto_insurance",
            "description": "<p>Image of auto insurance</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "pay_stub",
            "description": "<p>Image of Uber pay stub</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bank_routing_no",
            "description": "<p>Bank routing number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bank_account_no",
            "description": "<p>Bank account number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ssn",
            "description": "<p>Social security number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Driver's Address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "city",
            "description": "<p>City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zipcode",
            "description": "<p>Zipcode</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/email_availability",
    "title": "Check email availability for user/driver signup",
    "name": "Email_availability",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message (User available)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message. (Any error or user not available)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "get",
    "url": "/category",
    "title": "Get all category",
    "name": "Get_all_category",
    "group": "Root",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "categories",
            "description": "<p>Category details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "get",
    "url": "/faq",
    "title": "Get all faqs",
    "name": "Get_all_faqs",
    "group": "Root",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "faqs",
            "description": "<p>FAQ details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "get",
    "url": "/car_brands",
    "title": "Get car brands",
    "name": "Get_car_brands",
    "group": "Root",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "brands",
            "description": "<p>Listing of available car brands</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "get",
    "url": "/car_model_by_brand",
    "title": "Get car models based on brand",
    "name": "Get_car_models_based_on_brand",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brand",
            "description": "<p>Car brand</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "models",
            "description": "<p>Listing of available car models</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "get",
    "url": "/car_year_by_model",
    "title": "Get car years based on model",
    "name": "Get_car_years_based_on_model",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "model",
            "description": "<p>Car model</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "cars",
            "description": "<p>Listing of available car with year</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/verifyotp",
    "title": "Verify OTP",
    "name": "Otp_verification",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "otp",
            "description": "<p>Random six digit code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/phone_availability",
    "title": "Check phone availability for user/driver signup",
    "name": "Phone_availability",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message (User available)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message. (Any error or user not available)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/refresh_token",
    "title": "Refresh Token",
    "name": "Refresh_token",
    "group": "Root",
    "description": "<p>API will use for both - User and Driver</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>Current refresh token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Unique token which needs to be passed in subsequent requests.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Unique token which needs to be passed to generate next access token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/reset_password",
    "title": "Reset password for user",
    "name": "Reset_password_for_user",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>Key provided with verification link</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>New password for user</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/sendotp",
    "title": "Send / Re-send OTP",
    "name": "Send___Re_send_OTP",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/send_link_for_forget_password",
    "title": "Send link of reset password through mail",
    "name": "Send_link_of_reset_password_through_mail",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/user_login",
    "title": "User Login",
    "name": "User_Login",
    "group": "Root",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>User object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Unique token which needs to be passed in subsequent requests.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refresh_token",
            "description": "<p>Unique token which needs to be passed to generate next access token.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "post",
    "url": "/user_signup",
    "title": "User Signup",
    "name": "User_Signup",
    "group": "Root",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country_code",
            "description": "<p>country code for phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "avatar",
            "description": "<p>Profile image of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "car_brand",
            "description": "<p>Car brand name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "car_model",
            "description": "<p>Car model name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "car_color",
            "description": "<p>Car color</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "car_year",
            "description": "<p>Car year</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "plate_number",
            "description": "<p>Plate number of car</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "transmission_type",
            "description": "<p>Transmission type of car</p>"
          }
        ]
      }
    },
    "description": "<p>You need to pass form-data</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Root"
  },
  {
    "type": "Socket",
    "url": "join",
    "title": "To connect user",
    "name": "Join",
    "group": "Socket",
    "description": "<p>User/Driver can emit join event to register their self with socket.</p> <p>User/Driver need to compulsory call this event immediately after connecting with socket</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;data&quot;:personal info,&quot;role&quot;:&quot;driver/user&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket"
  },
  {
    "type": "Socket",
    "url": "accept_request",
    "title": "Accept ride request",
    "name": "accept_request",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit accept_request event to accept user request</p> <p>User will receive this details via &quot;request_accepted&quot; event</p> <p>All other online driver will receive this details via &quot;request_accepted&quot; event that notify other drivers that request has accepted by other driver</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;trip_id&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "complete_trip",
    "title": "When trip has completed",
    "name": "complete_trip",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit complete_trip event when trip has been over</p> <p>User will be notify for the same via &quot;trip_completed&quot; event</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;trip_id&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "driver_reached",
    "title": "Driver reached",
    "name": "driver_reached",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit driver_reached event when driver reached at pickup location</p> <p>User will be notify for the same via &quot;driver_reached&quot; event</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;trip_id&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "reject_request",
    "title": "Reject/decline ride request",
    "name": "reject_request",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit reject_request event to reject/decline user request</p> <p>User will receive message via &quot;all_request_rejected&quot; if all driver has rejected request of user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;trip_id&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "start_trip",
    "title": "To start trip",
    "name": "start_trip",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit start_trip event when driver will start trip</p> <p>User will be notify for the same via &quot;trip_started&quot; event</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;trip_id&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "update_driver_location",
    "title": "To Update driver's location",
    "name": "update_driver_location",
    "group": "Socket_Driver_Events",
    "description": "<p>Driver can emit update_driver_location event to update his/her current location.</p> <p>All other online user will receive this location via &quot;updated_driver_location&quot; event</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;location&quot;:{&quot;latitude&quot;:&quot;&quot;,&quot;longitude&quot;:&quot;&quot;}}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_Driver_Events"
  },
  {
    "type": "Socket",
    "url": "load_driver",
    "title": "Load driver available within 10 miles of distance",
    "name": "load_driver",
    "group": "Socket_User_Events",
    "description": "<p>User can call load_driver event to ask for load all available driver within 10 miles of his/her current location</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;current_location&quot;:{&quot;latitude&quot;:&quot;&quot;,&quot;longitude&quot;:&quot;&quot;}}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "JSON",
            "optional": false,
            "field": "driver",
            "description": "<p>available driver in 10 miles</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_User_Events"
  },
  {
    "type": "Socket",
    "url": "request_for_driver",
    "title": "Request for driver",
    "name": "request_for_driver",
    "group": "Socket_User_Events",
    "description": "<p>User can call request_for_driver event to ask for available driver within range of 10 mile</p> <p>All available driver within range of 10 mile can get request via &quot;listen_invitation&quot; event</p> <p>If no driver available then user can get message for the same via &quot;request_for_driver&quot; event</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;pickup_location&quot;:{&quot;placename&quot;:&quot;abcd&quot;,&quot;latitude&quot;:&quot;&quot;,&quot;longitude&quot;:&quot;&quot;},&quot;destination_location&quot;:{&quot;placename&quot;:&quot;abcd&quot;,&quot;latitude&quot;:&quot;&quot;,&quot;longitude&quot;:&quot;&quot;},&quot;fare&quot;:&quot;&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "trip",
            "description": "<p>Trip info</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket_User_Events"
  },
  {
    "type": "Socket",
    "url": "logout",
    "title": "To logout",
    "name": "logout",
    "group": "Socket",
    "description": "<p>User/Driver can emit logout event to logout their self.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;data&quot;:personal info,&quot;role&quot;:&quot;driver/user&quot;}</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket"
  },
  {
    "type": "Socket",
    "url": "notification",
    "title": "To send notification",
    "name": "notification",
    "group": "Socket",
    "description": "<p>User/Driver can emit notification event to send notification to other user.</p> <p>Other user/driver will receive notification via &quot;listen_notification&quot;</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "data",
            "description": "<p>{&quot;to_user/to_driver&quot;:&quot;&quot;,&quot;data&quot;:&quot;Notification data&quot;,&quot;role&quot;:&quot;driver/user&quot;} - If notification need to send to user then &quot;to_user&quot; parameter is required otherwise to_driver parameter needed.</p>"
          },
          {
            "group": "Parameter",
            "type": "Callback",
            "optional": false,
            "field": "socket_callback",
            "description": "<p>callback function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Callback response - Success": [
          {
            "group": "Callback response - Success",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>1</p>"
          },
          {
            "group": "Callback response - Success",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Callback response - Error": [
          {
            "group": "Callback response - Error",
            "type": "Boolean",
            "optional": false,
            "field": "status",
            "description": "<p>0</p>"
          },
          {
            "group": "Callback response - Error",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Failure message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/socket_events.js",
    "groupTitle": "Socket"
  },
  {
    "type": "post",
    "url": "/user/change_password",
    "title": "Change password",
    "name": "Change_password",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "old_password",
            "description": "<p>Old password of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "new_password",
            "description": "<p>New password of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message (User available)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message. (Any error or user not available)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/feedback",
    "title": "Customer support",
    "name": "Customer_support",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message given by user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/get_details",
    "title": "Get User details of current logged in user",
    "name": "Get_User_details_of_current_logged_in_user",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "JSON",
            "optional": false,
            "field": "user",
            "description": "<p>User details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/get_driver_by_id",
    "title": "Get driver by id",
    "name": "Get_driver_by_id",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "driver_id",
            "description": "<p>Id of driver</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "driver",
            "description": "<p>Driver object.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/phone_availability",
    "title": "Check phone availability for user/driver signup",
    "name": "Phone_availability",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message (User available)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message. (Any error or user not available)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/update",
    "title": "Update user profile",
    "name": "Update_user_profile",
    "group": "User",
    "description": "<p>You need to pass form-data</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "first_name",
            "description": "<p>First name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "last_name",
            "description": "<p>Last name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "country_code",
            "description": "<p>Country code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Phone number of user</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "avatar",
            "description": "<p>Profile image of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "emergency_contact",
            "description": "<p>Emergency contact number</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "car_brand",
            "description": "<p>Car brand name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "car_model",
            "description": "<p>Car model name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "car_color",
            "description": "<p>Car color</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "plate_number",
            "description": "<p>Plate number of car</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "transmission_type",
            "description": "<p>Transmission type of car</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/car",
    "title": "Assigned car of user",
    "name": "Assigned_car_of_user",
    "group": "User_car",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "car",
            "description": "<p>List of car.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/car.js",
    "groupTitle": "User_car"
  },
  {
    "type": "post",
    "url": "/user/card/add",
    "title": "Add card for user",
    "name": "Add_card_for_user",
    "group": "User_card",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "card_no",
            "description": "<p>Credit card number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "month",
            "description": "<p>Expire month of credit card</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "year",
            "description": "<p>Expire year of credit card</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of card owner</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of card owner</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/card.js",
    "groupTitle": "User_card"
  },
  {
    "type": "delete",
    "url": "/user/card/delete",
    "title": "Delete card for user",
    "name": "Delete_card_for_user",
    "group": "User_card",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "card_id",
            "description": "<p>Credit card id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/card.js",
    "groupTitle": "User_card"
  },
  {
    "type": "put",
    "url": "/user/card/set_default",
    "title": "Set given card as default for user",
    "name": "Set_given_card_as_default_for_user",
    "group": "User_card",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "card_id",
            "description": "<p>Credit card id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/card.js",
    "groupTitle": "User_card"
  },
  {
    "type": "get",
    "url": "/user/notification",
    "title": "Get notification",
    "name": "Get_notification",
    "group": "User_notification",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "notification",
            "description": "<p>Array of notification's document</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/notification.js",
    "groupTitle": "User_notification"
  },
  {
    "type": "get",
    "url": "/user/trip/history",
    "title": "Get users past trip",
    "name": "Get_users_past_trip",
    "group": "User_trip",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "trip",
            "description": "<p>Array of trip's document</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/trip.js",
    "groupTitle": "User_trip"
  },
  {
    "type": "post",
    "url": "/user/trip/rate_driver",
    "title": "Rate driver",
    "name": "Rate_driver",
    "group": "User_trip",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trip_id",
            "description": "<p>Trip id for which user is giving rate</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "rate_point",
            "description": "<p>Rating point that user has given to driver</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/trip.js",
    "groupTitle": "User_trip"
  },
  {
    "type": "post",
    "url": "/user/trip/payment",
    "title": "To make payment for trip",
    "name": "To_make_payment_for_trip",
    "group": "User_trip",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>User's unique access-key</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trip_id",
            "description": "<p>Trip id for which user has paid</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "card_id",
            "description": "<p>Card id form which user has paid</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "amount_paid",
            "description": "<p>amount has been paid by user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Validation or error message.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/user/trip.js",
    "groupTitle": "User_trip"
  }
] });
