'use strict';

angular.module('risevision.template-editor.services')
  .constant('COMPONENTS_MAP', {
    'rise-branding-colors': {
      type: 'rise-branding-colors',
      iconType: 'streamline',
      icon: 'palette',
      panel: '.branding-colors-container',
      title: 'Color Settings',
    },
    'rise-branding': {
      type: 'rise-branding',
      iconType: 'streamline',
      icon: 'ratingStar',
      panel: '.branding-component-container',
      title: 'Brand Settings',
    },
    'rise-override-brand-colors': {
      type: 'rise-override-brand-colors',
      iconType: 'streamline',
      icon: 'palette',
      title: 'Override Brand Colors',
    },
    'rise-data-counter': {
      type: 'rise-data-counter',
      iconType: 'streamline',
      icon: 'hourglass',
      title: 'Counter'
    },
    'rise-data-financial': {
      type: 'rise-data-financial',
      iconType: 'streamline',
      icon: 'financial',
      title: 'Financial'
    },
    'rise-html': {
      type: 'rise-html',
      iconType: 'streamline',
      icon: 'html',
      title: 'HTML Embed',
      visual: true
    },
    'rise-image': {
      type: 'rise-image',
      icon: 'image',
      iconType: 'streamline',
      panel: '.image-component-container',
      title: 'Image',
      playUntilDone: true,
      visual: true
    },
    'rise-image-logo': {
      type: 'rise-image-logo',
      icon: 'image',
      icon: 'circleStar',
      panel: '.image-component-container',
      title: 'Logo Settings'
    },
    'rise-playlist': {
      type: 'rise-playlist',
      iconType: 'streamline',
      icon: 'embedded-template',
      title: 'Playlist'
    },
    'rise-data-rss': {
      type: 'rise-data-rss',
      iconType: 'streamline',
      icon: 'rss',
      title: 'RSS'
    },
    'rise-schedules': {
      type: 'rise-schedules',
      title: 'Schedules'
    },
    'rise-slides': {
      type: 'rise-slides',
      iconType: 'streamline',
      icon: 'slides',
      title: 'Google Slides',
      visual: true
    },
    'rise-storage-selector': {
      type: 'rise-storage-selector',
      iconType: 'riseSvg',
      icon: 'riseStorage',
      panel: '.storage-selector-container',
      title: 'Rise Storage',
    },
    'rise-text': {
      type: 'rise-text',
      iconType: 'streamline',
      icon: 'text',
      title: 'Text',
      visual: true
    },
    'rise-time-date': {
      type: 'rise-time-date',
      iconType: 'streamline',
      icon: 'time',
      title: 'Time and Date',
      visual: true
    },
    'rise-data-twitter': {
      type: 'rise-data-twitter',
      iconType: 'streamline',
      icon: 'twitter',
      title: 'Twitter'
    },
    'rise-video': {
      type: 'rise-video',
      iconType: 'streamline',
      icon: 'video',
      panel: '.video-component-container',
      title: 'Video',
      playUntilDone: true,
      visual: true
    },
    'rise-data-weather': {
      type: 'rise-data-weather',
      iconType: 'streamline',
      icon: 'sun',
      title: 'Weather'
    }
  })
  .factory('COMPONENTS_ARRAY', ['COMPONENTS_MAP', 
    function(COMPONENTS_MAP) {
      return _.values(COMPONENTS_MAP);
    }
  ])
  .factory('PLAYLIST_COMPONENTS', ['COMPONENTS_ARRAY',
    function(COMPONENTS_ARRAY) {
      return _.filter(COMPONENTS_ARRAY, {
        visual: true
      });
    }
  ])
  .factory('componentsFactory', ['COMPONENTS_MAP',
    function (COMPONENTS_MAP) {
      var factory = {};

      return factory;
    }
  ]);
