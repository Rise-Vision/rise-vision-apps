'use strict';

angular.module('risevision.editor.services')
  .constant('PROFESSIONAL_WIDGETS', [{
      env: 'TEST',
      name: 'Twitter Widget Test',
      imageUrl: 'https://s3.amazonaws.com/Rise-Images/UI/twitter-widget%402x-100.jpg',
      imageAlt: 'add twitter widget',
      gadgetType: 'Widget',
      id: '83850b51-9040-445d-aa3b-d25946a725c5',
      url: 'https://widgets.risevision.com/beta/components/rise-twitter/rise-twitter-widget.html'
    },
    {
      env: 'PROD',
      name: 'Twitter Widget',
      imageUrl: 'https://s3.amazonaws.com/Rise-Images/UI/twitter-widget%402x-100.jpg',
      imageAlt: 'add twitter widget',
      gadgetType: 'Widget',
      id: '67e511ae-62b5-4a44-9551-077f63596079',
      url: 'https://widgets.risevision.com/stable/components/rise-twitter/rise-twitter-widget.html'
    },
    {
      name: 'Embedded Presentation',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/embedded-presentations-640x480.jpg',
      imageAlt: 'add embedded presentation',
      gadgetType: 'Presentation',
      id: 'presentation',
      productCode: 'd3a418f1a3acaed42cf452fefb1eaed198a1c620'
    },
    {
      env: 'TEST',
      name: 'Google Spreadsheet',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_spreadsheet_image.png',
      imageAlt: 'add google spreadsheet',
      gadgetType: 'Widget',
      id: 'b172714a-d753-475e-bb38-281f2aff594c',
      url: 'https://widgets.risevision.com/widget-google-spreadsheet/2.0.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Google Spreadsheet',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_spreadsheet_image.png',
      imageAlt: 'add google spreadsheet',
      gadgetType: 'Widget',
      id: '3132a345-9246-49df-854f-16455b833abf',
      url: 'https://widgets.risevision.com/widget-google-spreadsheet/2.0.0/dist/widget.html'
    },
    {
      env: 'TEST',
      name: 'Google Calendar',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_calender_image.png',
      imageAlt: 'add google calendar',
      gadgetType: 'Widget',
      id: '570012a1-54cc-4926-acb6-f9873588eddf',
      url: 'https://widgets.risevision.com/widget-google-calendar/0.1.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Google Calendar',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_calender_image.png',
      imageAlt: 'add google calendar',
      gadgetType: 'Widget',
      id: 'e2223213-cdaa-44be-b9d3-7a01211f63f7',
      url: 'https://widgets.risevision.com/widget-google-calendar/0.1.0/dist/widget.html'
    },
    {
      env: 'TEST',
      name: 'Web Page',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_webpage_image.png',
      imageAlt: 'add web page',
      gadgetType: 'Widget',
      id: '5e9499c8-c877-4791-95b9-9ae4835030e4',
      url: 'https://widgets.risevision.com/widget-web-page/1.0.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Web Page',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_webpage_image.png',
      imageAlt: 'add web page',
      gadgetType: 'Widget',
      id: 'df887785-3614-4f05-86c7-fce07b8745dc',
      url: 'https://widgets.risevision.com/widget-web-page/1.0.0/dist/widget.html'
    }
  ]);
