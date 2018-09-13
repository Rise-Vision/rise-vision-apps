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
      id: 'presentation'
    },
    {
      env: 'TEST',
      name: 'Google Spreadsheet',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_spreadsheet_image.png',
      imageAlt: 'add google spreadsheet',
      gadgetType: 'Widget',
      id: 'b172714a-d753-475e-bb38-281f2aff594c',
      url: 'http://s3.amazonaws.com/widget-google-spreadsheet/2.0.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Google Spreadsheet',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_spreadsheet_image.png',
      imageAlt: 'add google spreadsheet',
      gadgetType: 'Widget',
      id: '3132a345-9246-49df-854f-16455b833abf',
      url: 'http://s3.amazonaws.com/widget-google-spreadsheet/2.0.0/dist/widget.html'
    },
    {
      env: 'TEST',
      name: 'Google Calendar',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_calender_image.png',
      imageAlt: 'add google calendar',
      gadgetType: 'Widget',
      id: '570012a1-54cc-4926-acb6-f9873588eddf',
      url: 'http://s3.amazonaws.com/widget-google-calendar/0.1.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Google Calendar',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Rise-Vision/widget_calender_image.png',
      imageAlt: 'add google calendar',
      gadgetType: 'Widget',
      id: 'e2223213-cdaa-44be-b9d3-7a01211f63f7',
      url: 'http://s3.amazonaws.com/widget-google-calendar/0.1.0/dist/widget.html'
    },
    {
      env: 'TEST',
      name: 'Web Page',
      imageUrl: 'http://s3.amazonaws.com/Store-Products/Rise-Vision/widget_webpage_image.png',
      imageAlt: 'add web page',
      gadgetType: 'Widget',
      id: '5e9499c8-c877-4791-95b9-9ae4835030e4',
      url: 'http://s3.amazonaws.com/widget-web-page/1.0.0/dist/widget.html'
    },
    {
      env: 'PROD',
      name: 'Web Page',
      imageUrl: 'http://s3.amazonaws.com/Store-Products/Rise-Vision/widget_webpage_image.png',
      imageAlt: 'add web page',
      gadgetType: 'Widget',
      id: 'df887785-3614-4f05-86c7-fce07b8745dc',
      url: 'http://s3.amazonaws.com/widget-web-page/1.0.0/dist/widget.html'
    },
    // Third Party Widgets
    {
      env: 'PROD',
      name: 'Weather Forecast and Conditions',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Digichief/widget_1001_image_edit3.jpg',
      imageAlt: 'add weather forecast and conditions',
      gadgetType: 'Widget',
      id: '684ff886-f83d-4e95-9b56-5864c5ec0de5',
      url: 'http://data-feed.digichief.com/risevision/Weather/WeatherWidget.html?up_layout=current&up_address=geolocation&up_custom-address-state=&up_description=service&up_unit=fahrenheit&up_wind-speed-current=mph&up_wind-speed-forecast=kph&up_custom-address-country=&up_custom-address-city=&up_custom-address-zipcode=&up_border-color=&up_Language=en-us&up_show-humidity-current=true&up_show-sky-current=true&up_show-humidity-forecast=true&up_show-sky-forecast=true&up_terms=false&up_show-border=true&up_seperator-char=/&up_current-show-symbol=Yes&up_forecast-show-symbol=Yes'
    },
    {
      env: 'PROD',
      name: 'Mostly Sunny!',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_MostlySunny_image.png',
      imageAlt: 'add mostly sunny',
      gadgetType: 'Widget',
      id: 'cf8a8c03-4461-4a9e-8a56-1254384d3b25',
      url: 'https://account.testinseconds.com/WeatherWidget/widget.html'
    },
    {
      env: 'PROD',
      name: 'Ticky',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_ticky_image.png',
      imageAlt: 'add ticky',
      gadgetType: 'Widget',
      id: 'e8fdec6f-bcfb-4102-a91f-77ddc79b73c9',
      url: 'https://account.testinseconds.com/TextMarquee/widget.html'
    },
    {
      env: 'PROD',
      name: 'Weather Maps',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Digichief/widget_4000_image_edit3.jpg',
      imageAlt: 'add weather maps',
      gadgetType: 'Widget',
      id: '9e8fb866-0f21-485d-8f68-7529c48ca9d4',
      url: 'https://data-feed.digichief.com/risevision/NewsRadar/NewsRadarWidget.html?up_region=USA&up_SelectedMaps=&up_terms=false&up_show-border=true&up_border-color=&up_Transition=fade&up_ScrollDirection=RIGHT&up_ScrollSpeed=0.15&up_TransitionHold=10&up_MPLeft=0&up_MPTop=0&up_MPBottom=0&up_MPRight=0'
    },
    {
      env: 'PROD',
      name: 'News Headlines',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Digichief/widget_2000_image_edit3.jpg',
      imageAlt: 'add news headlines',
      gadgetType: 'Widget',
      id: '40e35d3d-ed16-4226-b7df-898e717a799d',
      url: 'http://data-feed.digichief.com/risevision/News/NewsWidget.html?up_category=_ALL_&up_show-date=true&up_terms=false&up_show-border=true&up_show-title=true&up_show-items=true&up_border-color=&up_Transition=fade&up_ScrollDirection=RIGHT&up_ScrollSpeed=0.15&up_TransitionHold=10&up_NewsItemCount=1&up_Layout=Layout6&up_QueueLength=&up_SFPLeft=10&up_SFPTop=10&up_SFPBottom=10&up_SFPRight=10&up_STPLeft=10&up_STPTop=10&up_STPBottom=10&up_STPRight=10&up_MPLeft=10&up_MPTop=10&up_MPBottom=10&up_MPRight=10'
    },
    //    {
    //      env: 'PROD',
    //      name: 'U.S. Stocks - Streaming Watchlist',
    //      imageUrl: 'https://s3.amazonaws.com/Store-Products/StockTrak/widget_918_image_edit1.png',
    //      imageAlt: 'add u.s. stocks streaming watchlist',
    //      gadgetType: 'Widget',
    //      id: 'f50f362f-c392-4644-9c89-6551a1cb56bc',
    //      url: 'https://www.howpersonalfinanceworks.com/rise_vision/rise-vision-widget-bats.php'
    //    },
    {
      env: 'PROD',
      name: 'Sports Scores',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Digichief/widget_3000_image_edit3.jpg',
      imageAlt: 'add sports scores',
      gadgetType: 'Widget',
      id: 'bfa04e64-4eeb-4fcf-9a1b-2a741ce95126',
      url: 'http://data-feed.digichief.com/risevision/Sports/SportsWidget.html?up_Sports=ALL&up_terms=false&up_StackCount=1&up_ShowConference=false&up_ShowCustomHeader=false&up_ShowSeperator=false&up_Duration=undefined&up_BackgroundTransperent=false&up_show-border=true&up_GamePadding=undefined&up_TeamPadding=undefined&up_StatusTextTopPadding=undefined&up_GameNotesTopPadding=undefined&up_Transition=fade&up_ScrollDirection=LEFT&up_ScrollSpeed=0.15&up_TransitionHold=10&up_border-color=&up_seperator-color='
    },
    {
      env: 'PROD',
      name: 'Photo Feed Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_ciaphotofeed_image.png',
      imageAlt: 'add photo feed widget',
      gadgetType: 'Widget',
      id: 'd5198c5e-c3a1-4156-b468-001c9f9ab040',
      url: 'https://account.testinseconds.com/ImageGalleryWidget/widget.html'
    },
    {
      env: 'PROD',
      name: 'YouTube Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Scotts-Digital-Signage/YouTube.png',
      imageAlt: 'add youtube widget',
      gadgetType: 'Widget',
      id: '03c02e24-80ad-42b3-8e10-7f6e716228aa',
      url: 'http://www.scottsdigitalsignage.com/widget/youtube-widget/demo/index.html?up_fileType=50&up_list=0&up_ccaption=false'
    },
    {
      env: 'PROD',
      name: 'Vimeo HTML5 Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Scotts-Digital-Signage/vimeo.png',
      imageAlt: 'add vimeo html5 widget',
      gadgetType: 'Widget',
      id: '17d1c54e-3c56-45f9-ad76-8f7458def71f',
      url: 'http://scottsdigitalsignage.com/widget/vimeo-widget/demo/index.html?up_fileType=50&up_loop=0&up_channel=1&up_auto=1'
    },
    {
      env: 'TEST',
      name: 'ComputerAid Countdown Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_caicountdown_image.png',
      imageAlt: 'add computer aid countdown widget',
      gadgetType: 'Widget',
      id: '86f806c0-54b4-453c-857a-fe9d09926275',
      url: 'https://account.testinseconds.com/CountdownWidget/widget.html'
    },
    {
      env: 'PROD',
      name: 'ComputerAid Countdown Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_caicountdown_image.png',
      imageAlt: 'add computer aid countdown widget',
      gadgetType: 'Widget',
      id: '7ea455e6-1e42-4eb8-91ab-818eb6b699b2',
      url: 'https://account.testinseconds.com/CountdownWidget/widget.html'
    },
    {
      env: 'PROD',
      name: 'ComputerAid CountUp Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/Computer-Aid/widget_caicountup_image.png',
      imageAlt: 'add computer aid countup widget',
      gadgetType: 'Widget',
      id: '4290722c-e15c-441e-a243-887dad864ce7',
      url: 'https://account.testinseconds.com/CountUpWidget/widget.html'
    },
    {
      env: 'PROD',
      name: 'Flight Monitor Arrivals Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/FlightTime-TV/arrivals_image_edit2.png',
      imageAlt: 'add flight status arrivals widget',
      gadgetType: 'Widget',
      id: '007b8e54-074e-40cc-9a27-6d35f56b4df9',
      url: 'http://widget.flighttimetv.com/widget.html'
    },
    {
      env: 'PROD',
      name: 'Flight Monitor Departures Widget',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/FlightTime-TV/departures_image_edit2.png',
      imageAlt: 'add flight status departures widget',
      gadgetType: 'Widget',
      id: '9af58096-ab67-406b-bb39-6297556651e1',
      url: 'http://widget.flighttimetv.com/widget.html'
    },
    {
      env: 'PROD',
      name: 'Facebook Feed',
      imageUrl: 'https://s3.amazonaws.com/Store-Products/SMARTplayDS/facebookFeed_ProductTile.png',
      imageAlt: 'add facebook feed widget',
      gadgetType: 'Widget',
      id: '5dba4bee-b26d-4592-9f22-a7b46b1bd693',
      url: 'http://rep.smartplayds.com/plugin/facebook-widget/widget.html'
    }
  ]);
