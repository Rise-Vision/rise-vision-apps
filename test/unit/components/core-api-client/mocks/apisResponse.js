/**
 * Created by rodrigopavezi on 10/17/14.
 */
rvFixtures.apis =
{
    "result": true,
    "kind": "discovery#directoryList",
    "discoveryVersion": "v1",
    "items": [
        {
            "kind": "discovery#directoryItem",
            "id": "discovery:v1",
            "name": "discovery",
            "version": "v1",
            "title": "APIs Discovery Service",
            "description": "Lets you discover information about other Google APIs, such as what APIs are available, the resource and method details for each API.",
            "discoveryRestUrl": "https://rvaserver2.appspot.com/_ah/api/discovery/v1/apis/discovery/v1/rest",
            "discoveryLink": "./apis/discovery/v1/rest",
            "icons": {
                "x16": "http://www.google.com/images/icons/feature/filing_cabinet_search-g16.png",
                "x32": "http://www.google.com/images/icons/feature/filing_cabinet_search-g32.png"
            },
            "documentationLink": "https://developers.google.com/discovery/",
            "preferred": true
        },
        {
            "kind": "discovery#directoryItem",
            "id": "content:v0",
            "name": "content",
            "version": "v0",
            "title": "Rise Content API (experimental)",
            "description": "Rise Content API (experimental)",
            "discoveryRestUrl": "https://rvaserver2.appspot.com/_ah/api/discovery/v1/apis/content/v0/rest",
            "discoveryLink": "./apis/content/v0/rest",
            "icons": {
                "x16": "http://www.google.com/images/icons/product/search-16.gif",
                "x32": "http://www.google.com/images/icons/product/search-32.gif"
            },
            "preferred": true
        },
        {
            "kind": "discovery#directoryItem",
            "id": "core:v0",
            "name": "core",
            "version": "v0",
            "title": "Rise Core API (experimental)",
            "description": "Rise Core API (experimental)",
            "discoveryRestUrl": "https://rvaserver2.appspot.com/_ah/api/discovery/v1/apis/core/v0/rest",
            "discoveryLink": "./apis/core/v0/rest",
            "icons": {
                "x16": "http://www.google.com/images/icons/product/search-16.gif",
                "x32": "http://www.google.com/images/icons/product/search-32.gif"
            },
            "preferred": true
        },
        {
            "kind": "discovery#directoryItem",
            "id": "rise:v0",
            "name": "rise",
            "version": "v0",
            "title": "Rise Core API (for internal use only)",
            "description": "Rise Core API (for internal use only)",
            "discoveryRestUrl": "https://rvaserver2.appspot.com/_ah/api/discovery/v1/apis/rise/v0/rest",
            "discoveryLink": "./apis/rise/v0/rest",
            "icons": {
                "x16": "http://www.google.com/images/icons/product/search-16.gif",
                "x32": "http://www.google.com/images/icons/product/search-32.gif"
            },
            "preferred": true
        },
        {
            "kind": "discovery#directoryItem",
            "id": "test:v0",
            "name": "test",
            "version": "v0",
            "title": "Rise Test API (experimental)",
            "description": "Rise Test API (experimental)",
            "discoveryRestUrl": "https://rvaserver2.appspot.com/_ah/api/discovery/v1/apis/test/v0/rest",
            "discoveryLink": "./apis/test/v0/rest",
            "icons": {
                "x16": "http://www.google.com/images/icons/product/search-16.gif",
                "x32": "http://www.google.com/images/icons/product/search-32.gif"
            },
            "preferred": true
        }
    ]
};