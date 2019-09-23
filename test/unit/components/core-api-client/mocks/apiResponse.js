/**
 * Created by rodrigopavezi on 10/17/14.
 */
rvFixtures.api =
{
    "result": true,
    "kind": "discovery#restDescription",
    "etag": "\"9mnLCPwbyZOHH18t8ExzO2gqgTk/T5U_Suhw9Dp716kKhlH6L4xM0do\"",
    "discoveryVersion": "v1",
    "id": "core:v0",
    "name": "core",
    "version": "v0",
    "title": "Rise Core API (experimental)",
    "description": "Rise Core API (experimental)",
    "icons": {
        "x16": "http://www.google.com/images/icons/product/search-16.gif",
        "x32": "http://www.google.com/images/icons/product/search-32.gif"
    },
    "protocol": "rest",
    "baseUrl": "https://rvaserver2.appspot.com/_ah/api/core/v0/",
    "basePath": "/_ah/api/core/v0/",
    "rootUrl": "https://rvaserver2.appspot.com/_ah/api/",
    "servicePath": "core/v0/",
    "batchPath": "batch",
    "resources": {
        "company": {
            "methods": {
                "add": {
                    "id": "core.company.add",
                    "path": "company",
                    "httpMethod": "PUT",
                    "parameters": {
                        "data": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        },
                        "parentId": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "data",
                        "parentId"
                    ],
                    "response": {
                        "$ref": "APIResponse_CompanyWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "delete": {
                    "id": "core.company.delete",
                    "path": "company",
                    "httpMethod": "DELETE",
                    "parameters": {
                        "id": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "id"
                    ],
                    "response": {
                        "$ref": "APIResponse_CompanyWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "get": {
                    "id": "core.company.get",
                    "path": "company",
                    "httpMethod": "GET",
                    "parameters": {
                        "id": {
                            "type": "string",
                            "location": "query"
                        }
                    },
                    "response": {
                        "$ref": "APIResponse_CompanyWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "list": {
                    "id": "core.company.list",
                    "path": "companies",
                    "httpMethod": "GET",
                    "parameters": {
                        "companyId": {
                            "type": "string",
                            "location": "query"
                        },
                        "count": {
                            "type": "string",
                            "location": "query"
                        },
                        "cursor": {
                            "type": "string",
                            "location": "query"
                        },
                        "search": {
                            "type": "string",
                            "location": "query"
                        },
                        "sort": {
                            "type": "string",
                            "location": "query"
                        }
                    },
                    "response": {
                        "$ref": "APIResponse_CompanyListWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "lookup": {
                    "id": "core.company.lookup",
                    "path": "company/lookup",
                    "httpMethod": "GET",
                    "parameters": {
                        "authKey": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "authKey"
                    ],
                    "response": {
                        "$ref": "APIResponse_CompanyWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "move": {
                    "id": "core.company.move",
                    "path": "company/move",
                    "httpMethod": "POST",
                    "parameters": {
                        "authKey": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        },
                        "newParentId": {
                            "type": "string",
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "authKey"
                    ],
                    "response": {
                        "$ref": "APIResponse_String"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "regenerateField": {
                    "id": "core.company.regenerateField",
                    "path": "company/regenerate",
                    "httpMethod": "POST",
                    "parameters": {
                        "fieldName": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        },
                        "id": {
                            "type": "string",
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "fieldName"
                    ],
                    "response": {
                        "$ref": "APIResponse_String"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                },
                "update": {
                    "id": "core.company.update",
                    "path": "company",
                    "httpMethod": "POST",
                    "parameters": {
                        "data": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        },
                        "id": {
                            "type": "string",
                            "required": true,
                            "location": "query"
                        }
                    },
                    "parameterOrder": [
                        "data",
                        "id"
                    ],
                    "response": {
                        "$ref": "APIResponse_CompanyWrapper"
                    },
                    "scopes": [
                        "https://www.googleapis.com/auth/userinfo.email"
                    ]
                }
            }
        }
    }
}
;