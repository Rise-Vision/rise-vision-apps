/*jshint maxlen: false */

'use strict';

angular.module('risevision.template-editor.directives')
  .directive('streamlineIcon', ['streamlineIconsList',
    function (iconsList) {
      return {
        restrict: 'E',
        scope: {
          name: '@',
          width: '@',
          height: '@'
        },
        link: function ($scope, element) {
          var _path = function (name) {
            var iconDef = iconsList[name];
            var width = $scope.width || 32;
            var height = $scope.height || 32;
            var size = ' width="' + width + '" height="' + height + '"';
            var viewBox = ' viewBox="' + iconDef.viewBox + '"';
            var paths = iconDef.paths.map(function (p) {
              return '<path d="' + p + '" />';
            }).join('\n');

            return '<svg xmlns="http://www.w3.org/2000/svg"' + size + viewBox + '>' + paths + '</svg>';
          };

          $scope.$watch('name', function (name) {
            if (name) {
              element.html(_path(name));
            }
          });
        }
      };
    }
  ])
  .constant('streamlineIconsList', {
    checkmark: {
      viewBox: '0 0 14 12',
      paths: [
        'M13.9113869,1.85205399 L12.1803988,0.0923193158 C12.1222419,0.033216301 12.0432758,0 11.9609254,0 C11.8785749,0 11.7996089,0.033216301 11.741452,0.0923193158 L4.43063103,7.508344 C4.37247413,7.56744702 4.29350804,7.60066332 4.21115761,7.60066332 C4.12880718,7.60066332 4.04984109,7.56744702 3.99168419,7.508344 L2.26069606,5.74860933 C2.20253916,5.68950632 2.12357307,5.65629002 2.04122263,5.65629002 C1.9588722,5.65629002 1.87990611,5.68950632 1.82174921,5.74860933 L0.0907610809,7.508344 C-0.0302536936,7.63105403 -0.0302536936,7.82996699 0.0907610809,7.95267701 L3.99168419,11.9076807 C4.04984109,11.9667837 4.12880718,12 4.21115761,12 C4.29350804,12 4.37247413,11.9667837 4.43063103,11.9076807 L13.9113869,2.29198766 C14.0295377,2.16979812 14.0295377,1.97424352 13.9113869,1.85205399 Z'
      ]
    },
    sun: {
      viewBox: '0 0 60 60',
      paths: [
        'M18.75,30a11.25,11.25 0 1,0 22.5,0a11.25,11.25 0 1,0 -22.5,0',
        'M30,14.5675 C31.3807119,14.5675 32.5,13.4482119 32.5,12.0675 L32.5,2.5 C32.5,1.11928813 31.3807119,0 30,0 C28.6192881,0 27.5,1.11928813 27.5,2.5 L27.5,12.0675 C27.5,13.4482119 28.6192881,14.5675 30,14.5675 Z',
        'M30,45.4375 C28.6192881,45.4375 27.5,46.5567881 27.5,47.9375 L27.5,57.5 C27.5,58.8807119 28.6192881,60 30,60 C31.3807119,60 32.5,58.8807119 32.5,57.5 L32.5,47.9375 C32.5,46.5567881 31.3807119,45.4375 30,45.4375 Z',
        'M15.5475,19.09 C16.5336082,20.0418515 18.0963918,20.0418515 19.0825,19.09 C20.0584548,18.1137504 20.0584548,16.5312496 19.0825,15.555 L12.3325,8.7875 C11.3556463,7.80857528 9.77017472,7.80689635 8.79125,8.78375 C7.81232528,9.76060365 7.81064635,11.3460753 8.7875,12.325 L15.5475,19.09 Z',
        'M44.4475,40.915 C43.4665528,39.9675695 41.9072881,39.9811191 40.9429536,40.9454536 C39.9786191,41.9097881 39.9650695,43.4690528 40.9125,44.45 L47.6775,51.2175 C48.663082,52.1706532 50.226918,52.1706532 51.2125,51.2175 C52.1884548,50.2412504 52.1884548,48.6587496 51.2125,47.6825 L44.4475,40.915 Z',
        'M14.565,31.25 C14.565,29.8692881 13.4457119,28.75 12.065,28.75 L2.5,28.75 C1.11928813,28.75 0,29.8692881 0,31.25 C0,32.6307119 1.11928813,33.75 2.5,33.75 L12.065,33.75 C13.4457119,33.75 14.565,32.6307119 14.565,31.25 Z',
        'M57.5,28.75 L47.935,28.75 C46.5542881,28.75 45.435,29.8692881 45.435,31.25 C45.435,32.6307119 46.5542881,33.75 47.935,33.75 L57.5,33.75 C58.8807119,33.75 60,32.6307119 60,31.25 C60,29.8692881 58.8807119,28.75 57.5,28.75 Z',
        'M15.5475,40.915 L8.7975,47.6825 C7.82154515,48.6587496 7.82154515,50.2412504 8.7975,51.2175 C9.78308205,52.1706532 11.346918,52.1706532 12.3325,51.2175 L19.0825,44.4525 C20.0299305,43.4715528 20.0163809,41.9122881 19.0520464,40.9479536 C18.0877119,39.9836191 16.5284472,39.9700695 15.5475,40.9175 L15.5475,40.915 Z',
        'M42.68,19.8075424 C43.3408416,19.8113453 43.9763231,19.5533776 44.4475,19.09 L51.2125,12.325 C52.1893536,11.3488367 52.1899132,9.76560367 51.21375,8.78875004 C50.2375867,7.8118964 48.6543537,7.81133674 47.6775,8.7875 L40.9125,15.555 C40.1947829,16.2662723 39.9792189,17.3413125 40.3672332,18.2743029 C40.7552474,19.2072932 41.669569,19.812434 42.68,19.805 L42.68,19.8075424 Z'
      ]
    },
    forbidden: {
      viewBox: '0 0 61 60',
      paths: [
        'M51.315372,8.79913947 C39.5713803,-2.93793547 20.5362149,-2.93232851 8.79913978,8.81166297 C-2.93793533,20.5556545 -2.93232865,39.5908199 8.81166266,51.3278952 C20.3473391,62.6171455 38.6949654,62.9217662 50.5990455,52.02168 C53.1115003,49.671862 55.2045297,46.9105202 56.7880063,43.8565596 C58.3013161,40.9183953 59.3169462,37.7496292 59.7935721,34.4791944 C60.0084114,33.0170758 60.1172295,31.5413343 60.1191751,30.0635173 C60.1409806,22.0843309 56.9710343,14.4277606 51.315372,8.79913947 Z M13.2624046,13.2022933 C21.5328757,5.10318972 34.3930739,4.02747568 43.8941292,10.6400485 C44.0502281,10.7539516 44.1486897,10.9304392 44.1636209,11.1230992 C44.178552,11.3157592 44.1084584,11.5053098 43.9717729,11.6419038 L11.6970058,43.9316987 C11.5600163,44.0675792 11.3706776,44.1371214 11.1783047,44.1222125 C10.9859317,44.1073036 10.8095686,44.0094195 10.6951505,43.854055 C3.94420895,34.3826256 5.03000211,21.4187849 13.2624046,13.2022933 Z M46.9673202,46.9247413 C38.7437708,55.1279322 25.8050775,56.2101236 16.333091,49.4869861 C16.1766408,49.373476 16.0776915,49.1971926 16.0622775,49.0045177 C16.0468635,48.8118427 16.1165283,48.6220702 16.2529426,48.4851309 L48.5302144,16.1928313 C48.6672039,16.0569508 48.8565425,15.9874086 49.0489155,16.0023175 C49.2412885,16.0172264 49.4176516,16.1151105 49.5320696,16.2704751 C56.2857525,25.7412149 55.2020373,38.7066014 46.9698248,46.9247413 L46.9673202,46.9247413 Z'
      ]
    },
    close: {
      viewBox: '0 0 60 60',
      paths: [
        'M35.7474305,30.4420732 C35.6298881,30.3248227 35.5638285,30.1656187 35.5638285,29.9995916 C35.5638285,29.8335644 35.6298881,29.6743604 35.7474305,29.5571099 L58.903005,6.40307058 C60.3671281,4.9368154 60.3654493,2.56122496 58.8992552,1.09704078 C57.4330612,-0.367143388 55.0575697,-0.36546455 53.5934465,1.10079057 L30.4403718,24.2448303 C30.3231262,24.3623776 30.1639289,24.4284399 29.9979086,24.4284399 C29.8318883,24.4284399 29.672691,24.3623776 29.5554454,24.2448303 L6.40237068,1.10079057 C4.93824748,-0.364083948 2.56387516,-0.364643569 1.09906167,1.09954062 C-0.36575182,2.56372482 -0.366311417,4.93819606 1.09781178,6.40307058 L24.2483867,29.5571099 C24.365929,29.6743604 24.4319886,29.8335644 24.4319886,29.9995916 C24.4319886,30.1656187 24.365929,30.3248227 24.2483867,30.4420732 L1.09781178,53.5986124 C0.150690139,54.5462201 -0.218964737,55.9271501 0.128092562,57.2212195 C0.475149861,58.5152889 1.48619308,59.5258978 2.78037201,59.8723595 C4.07455095,60.2188213 5.45524904,59.8485001 6.40237068,58.9008924 L29.5554454,35.7443532 C29.672691,35.626806 29.8318883,35.5607436 29.9979086,35.5607436 C30.1639289,35.5607436 30.3231262,35.626806 30.4403718,35.7443532 L53.5934465,58.9008924 C55.0575697,60.3657669 57.431942,60.3663265 58.8967555,58.9021423 C60.3615689,57.4379582 60.3621285,55.063487 58.8980054,53.5986124 L35.7474305,30.4420732 Z'
      ]
    },
    exclamation: {
      viewBox: '0 0 20 60',
      paths: [
        'M20,50.625 C20,55.794375 15.514,60 10,60 C4.486,60 0,55.794375 0,50.625 C0,45.455625 4.486,41.25 10,41.25 C15.514,41.25 20,45.455625 20,50.625 Z M1.1575,2.95300781 L2.8575,34.8280078 C2.937375,36.3248437 4.255125,37.5 5.85375,37.5 L14.14625,37.5 C15.744875,37.5 17.062625,36.3248437 17.1425,34.8280078 L18.8425,2.95300781 C18.928125,1.34648437 17.562,0 15.84625,0 L4.15375,0 C2.438,0 1.071875,1.34648437 1.1575,2.95300781 Z'
      ]
    },
    help: {
      viewBox: '0 0 60 60',
      paths: [
        'M30,0 C13.4314575,0 0,13.4314575 0,30 C0,46.5685425 13.4314575,60 30,60 C46.5685425,60 60,46.5685425 60,30 C59.9820879,13.4388826 46.5611174,0.017912119 30,0 Z M30,47.5 C27.9289322,47.5 26.25,45.8210678 26.25,43.75 C26.25,41.6789322 27.9289322,40 30,40 C32.0710678,40 33.75,41.6789322 33.75,43.75 C33.75,45.8210678 32.0710678,47.5 30,47.5 Z M34,32.3 C33.0885298,32.6977981 32.4995179,33.5980046 32.5,34.5925 C32.5,35.9732119 31.3807119,37.0925 30,37.0925 C28.6192881,37.0925 27.5,35.9732119 27.5,34.5925 C27.4995481,31.6099212 29.2664214,28.9105315 32,27.7175 C34.2890456,26.7184782 35.4898219,24.1835537 34.8127814,21.7795174 C34.135741,19.3754811 31.7885616,17.8397551 29.3145858,18.1821266 C26.84061,18.524498 24.9987136,20.6399467 25,23.1375 C25,24.5182119 23.8807119,25.6375 22.5,25.6375 C21.1192881,25.6375 20,24.5182119 20,23.1375 C20,18.1430259 23.6849227,13.914303 28.6324749,13.2312962 C33.5800272,12.5482893 38.2729085,15.6204506 39.6260161,20.4281393 C40.9791236,25.2358281 38.5775111,30.3047104 34,32.3025 L34,32.3 Z'
      ]
    },
    video: {
      viewBox: '0 0 64 60',
      paths: [
        'M64,19.7727273 C64,19.0196117 63.4030463,18.4090909 62.6666667,18.4090909 L1.33333333,18.4090909 C0.596953667,18.4090909 0,19.0196117 0,19.7727273 L0,52.5 C0,56.2655778 2.98476833,59.3181818 6.66666667,59.3181818 L57.3333333,59.3181818 C59.1014433,59.3181818 60.797136,58.5998397 62.0473785,57.3211826 C63.2976211,56.0425255 64,54.3082942 64,52.5 L64,19.7727273 Z M43.2933333,35.7763636 C44.5236453,36.2850319 45.3290106,37.5064348 45.3290106,38.8636364 C45.3290106,40.2208379 44.5236453,41.4422408 43.2933333,41.9509091 L25.624,49.5218182 C24.6842732,49.9373961 23.603872,49.8468676 22.7428158,49.2803992 C21.8817596,48.7139309 21.3532247,47.7459787 21.3333333,46.6990909 L21.3333333,31.0281818 C21.3519076,29.9807367 21.8801734,29.0118031 22.741667,28.445047 C23.6031606,27.8782909 24.6843234,27.7884198 25.624,28.2054545 L43.2933333,35.7763636 Z',
        'M52.168,1.84636364 C52.3588259,1.65169491 52.4162661,1.35866279 52.3135557,1.10380982 C52.2108452,0.848956855 51.9681931,0.68242737 51.6986667,0.681818182 L41.6,0.681818182 C41.5272325,0.682447068 41.4575055,0.711753263 41.4053333,0.763636364 L29.2986667,13.1536364 C29.1074975,13.3486557 29.0502265,13.6423492 29.1536209,13.8974499 C29.2570154,14.1525506 29.5006548,14.3186759 29.7706667,14.3181829 L39.8586667,14.3181829 C39.9323031,14.3179727 40.0030094,14.2886565 40.056,14.2363636 L52.168,1.84636364 Z',
        'M58.8666667,0.867272727 C58.8233477,0.856411955 58.777649,0.86991386 58.7466667,0.902727273 L46.768,13.1536364 C46.5768309,13.3486557 46.5195598,13.6423492 46.6229543,13.8974499 C46.7263487,14.1525506 46.9699882,14.3186759 47.24,14.3181829 L62.6666667,14.3181829 C63.4030463,14.3181829 64,13.707661 64,12.9545455 L64,7.5 C63.9987928,4.33952254 61.8740641,1.59418236 58.8666667,0.867272727 Z',
        'M34.7013333,1.84636364 C34.8925025,1.65134428 34.9497735,1.35765076 34.8463791,1.10255007 C34.7429846,0.847449373 34.4993452,0.681324104 34.2293333,0.681817083 L24.2666667,0.681817083 C24.1938992,0.682447068 24.1241722,0.711753263 24.072,0.763636364 L11.9653333,13.1536364 C11.7741642,13.3486557 11.7168931,13.6423492 11.8202876,13.8974499 C11.923682,14.1525506 12.1673215,14.3186759 12.4373333,14.3181829 L22.4,14.3181829 C22.4727675,14.3175529 22.5424945,14.2882467 22.5946667,14.2363636 L34.7013333,1.84636364 Z',
        'M17.368,1.84636364 C17.5591691,1.65134428 17.6164402,1.35765076 17.5130457,1.10255007 C17.4096513,0.847449373 17.1660118,0.681324104 16.896,0.681817083 L6.66666667,0.681817083 C2.98476833,0.681817083 0,3.73442216 0,7.5 L0,12.9545455 C0,13.707661 0.596953667,14.3181818 1.33333333,14.3181818 L5.06666667,14.3181818 C5.13943413,14.3175529 5.20916117,14.2882467 5.26133333,14.2363636 L17.368,1.84636364 Z'
      ]
    },
    pencil: {
      viewBox: '0 0 60 60',
      paths: [
        'M37.6675,9.965 C37.4334439,9.72888101 37.1149664,9.59573222 36.7825,9.595 L36.7825,9.595 C36.4503937,9.595 36.1319671,9.72729834 35.8975,9.9625 L8.5925,37.275 C8.10452258,37.7631248 8.10452258,38.5543752 8.5925,39.0425 L20.9625,51.4125 C21.4506248,51.9004774 22.2418752,51.9004774 22.73,51.4125 L50.0225,24.12 C50.5088136,23.6321628 50.5088136,22.8428372 50.0225,22.355 L37.6675,9.965 Z',
        'M6.075,42 C5.75487078,41.6809307 5.2874327,41.5595307 4.8525,41.6825 C4.41686677,41.8046731 4.0812564,42.1527135 3.975,42.5925 L0.21,58.285 C0.108963486,58.7078383 0.234879066,59.1528031 0.5425,59.46 C0.851939347,59.7637374 1.29517067,59.8882194 1.7175,59.79 L17.3975,56.04 C17.8377729,55.9346328 18.1866673,55.5994525 18.3095958,55.1637565 C18.4325243,54.7280605 18.3102727,54.2599497 17.99,53.94 L6.075,42 Z',
        'M58,7.31 L52.6925,2 C50.2527372,-0.434892861 46.3022628,-0.434892861 43.8625,2 L40.3175,5.5425 C39.8295226,6.03062481 39.8295226,6.82187519 40.3175,7.31 L52.6925,19.6825 C53.1806248,20.1704774 53.9718752,20.1704774 54.46,19.6825 L58,16.135 C60.4315681,13.6958141 60.4315681,9.74918594 58,7.31 Z'
      ]
    },
    trash: {
      viewBox: '0 0 54 59',
      paths: [
        'M44.8484848,18.1818182 L8.48484848,18.1818182 C7.81541242,18.1818182 7.27272727,18.7245033 7.27272727,19.3939394 L7.27272727,53.3333333 C7.27272727,56.0110776 9.44346788,58.1818182 12.1212121,58.1818182 L41.2121212,58.1818182 C43.8898655,58.1818182 46.0606061,56.0110776 46.0606061,53.3333333 L46.0606061,19.3939394 C46.0606061,18.7245033 45.5179209,18.1818182 44.8484848,18.1818182 Z M22.4242424,49.6969697 C22.4242424,50.7011238 21.6102147,51.5151515 20.6060606,51.5151515 C19.6019065,51.5151515 18.7878788,50.7011238 18.7878788,49.6969697 L18.7878788,27.8787879 C18.7878788,26.8746338 19.6019065,26.0606061 20.6060606,26.0606061 C21.6102147,26.0606061 22.4242424,26.8746338 22.4242424,27.8787879 L22.4242424,49.6969697 Z M34.5454545,49.6969697 C34.5454545,50.7011238 33.7314268,51.5151515 32.7272727,51.5151515 C31.7231186,51.5151515 30.9090909,50.7011238 30.9090909,49.6969697 L30.9090909,27.8787879 C30.9090909,26.8746338 31.7231186,26.0606061 32.7272727,26.0606061 C33.7314268,26.0606061 34.5454545,26.8746338 34.5454545,27.8787879 L34.5454545,49.6969697 Z',
        'M50.9090909,9.6969697 L39.3939394,9.6969697 C39.0592214,9.6969697 38.7878788,9.42562712 38.7878788,9.09090909 L38.7878788,6.06060606 C38.7878788,2.71342576 36.074453,-1.65201186e-13 32.7272727,-1.65201186e-13 L20.6060606,-1.65201186e-13 C17.2588803,-1.65201186e-13 14.5454545,2.71342576 14.5454545,6.06060606 L14.5454545,9.09090909 C14.5454545,9.25164636 14.4816019,9.40580024 14.3679435,9.51945866 C14.2542851,9.63311707 14.1001312,9.6969697 13.9393939,9.6969697 L2.42424242,9.6969697 C1.0853703,9.6969697 0,10.78234 0,12.1212121 C0,13.4600842 1.0853703,14.5454545 2.42424242,14.5454545 L50.9090909,14.5454545 C52.247963,14.5454545 53.3333333,13.4600842 53.3333333,12.1212121 C53.3333333,10.78234 52.247963,9.6969697 50.9090909,9.6969697 Z M19.3939394,9.09090909 L19.3939394,6.06060606 C19.3939394,5.39117 19.9366245,4.84848485 20.6060606,4.84848485 L32.7272727,4.84848485 C33.3967088,4.84848485 33.9393939,5.39117 33.9393939,6.06060606 L33.9393939,9.09090909 C33.9393939,9.42562712 33.6680514,9.6969697 33.3333333,9.6969697 L20,9.6969697 C19.665282,9.6969697 19.3939394,9.42562712 19.3939394,9.09090909 Z'
      ]
    },
    text: {
      viewBox: '0 0 75 60',
      paths: [
        'M0,0 L0,12 L19.7368421,12 L19.7368421,60 L31.5789474,60 L31.5789474,12 L51.3157895,12 L51.3157895,0 L0,0 Z M75,20 L39.4736842,20 L39.4736842,32 L51.3157895,32 L51.3157895,60 L63.1578947,60 L63.1578947,32 L75,32 L75,20 Z'
      ]
    },
    image: {
      viewBox: '0 0 60 60',
      paths: [
        'M54.1463415,0 L5.85365854,0 C2.6207722,0 0,2.6207722 0,5.85365854 L0,54.1463415 C0,57.3792278 2.6207722,60 5.85365854,60 L54.1463415,60 C57.3792278,60 60,57.3792278 60,54.1463415 L60,5.85365854 C60,2.6207722 57.3792278,0 54.1463415,0 Z M18.0497561,36.3892683 C18.5158302,35.4551851 19.4441309,34.8400472 20.486,34.7748927 C21.5278692,34.7097381 22.5255745,35.204431 23.1043902,36.0731707 L25.5336585,39.72 C25.6765984,39.9333254 25.9209033,40.0561091 26.1773817,40.0435249 C26.4338602,40.0309406 26.6649717,39.8848305 26.7863415,39.6585366 L33.9190244,26.4087805 C34.4345637,25.4234963 35.4745541,24.8264436 36.5853659,24.8780488 C37.6904931,24.9077801 38.6845673,25.5576646 39.155122,26.5580488 L49.6273171,48.8019512 C49.840907,49.2555645 49.8074028,49.786948 49.5385294,50.2101415 C49.2696561,50.6333351 48.8028468,50.8894209 48.3014634,50.8887817 L13.1707317,50.8887817 C12.6633247,50.8887817 12.1921375,50.625908 11.9255749,50.1941601 C11.6590123,49.7624122 11.6351207,49.223395 11.862439,48.7697561 L18.0497561,36.3892683 Z M12.4390244,18.2839024 C12.4390244,15.0510161 15.0597966,12.4302439 18.2926829,12.4302439 C21.5255693,12.4302439 24.1463415,15.0510161 24.1463415,18.2839024 C24.1463415,21.5167888 21.5255693,24.137561 18.2926829,24.137561 C15.0597966,24.137561 12.4390244,21.5167888 12.4390244,18.2839024 Z'
      ]
    },
    financial: {
      viewBox: '0 0 60 59',
      paths: [
        'M3.125,51.250002 L11.875,51.250002 C12.0409641,51.2506699 12.2003237,51.1850364 12.317679,51.067681 C12.4350343,50.9503257 12.5006679,50.7909662 12.500005,50.625002 L12.500005,45.000002 C12.500005,44.3096461 11.9403559,43.750002 11.25,43.750002 L3.75,43.750002 C3.05964406,43.750002 2.49999495,44.3096461 2.49999495,45.000002 L2.49999495,50.625002 C2.49933213,50.7909662 2.56496566,50.9503257 2.68232099,51.067681 C2.79967631,51.1850364 2.95903585,51.2506699 3.125,51.250002 L3.125,51.250002 Z',
        'M18.75,31.250002 C18.0596441,31.250002 17.499995,31.8096461 17.499995,32.500002 L17.499995,50.625002 C17.4993321,50.7909662 17.5649657,50.9503257 17.682321,51.067681 C17.7996763,51.1850364 17.9590359,51.2506699 18.125,51.250002 L26.875,51.250002 C27.0409641,51.2506699 27.2003237,51.1850364 27.317679,51.067681 C27.4350343,50.9503257 27.5006679,50.7909662 27.500005,50.625002 L27.500005,32.500002 C27.500005,31.8096461 26.9403559,31.250002 26.25,31.250002 L18.75,31.250002 Z',
        'M33.75,36.250002 C33.0596441,36.250002 32.499995,36.8096461 32.499995,37.500002 L32.499995,50.625002 C32.4993321,50.7909662 32.5649657,50.9503257 32.682321,51.067681 C32.7996763,51.1850364 32.9590359,51.2506699 33.125,51.250002 L41.875,51.250002 C42.0409641,51.2506699 42.2003237,51.1850364 42.317679,51.067681 C42.4350343,50.9503257 42.5006679,50.7909662 42.500005,50.625002 L42.500005,37.500002 C42.500005,36.8096461 41.9403559,36.250002 41.25,36.250002 L33.75,36.250002 Z',
        'M48.75,18.750002 C48.0596441,18.750002 47.499995,19.3096461 47.499995,20.000002 L47.499995,50.625002 C47.4993321,50.7909662 47.5649657,50.9503257 47.682321,51.067681 C47.7996763,51.1850364 47.9590359,51.2506699 48.125,51.250002 L56.875,51.250002 C57.0409641,51.2506699 57.2003237,51.1850364 57.317679,51.067681 C57.4350343,50.9503257 57.5006679,50.7909662 57.500005,50.625002 L57.500005,20.000002 C57.500005,19.3096461 56.9403559,18.750002 56.25,18.750002 L48.75,18.750002 Z',
        'M2.5,58.750002 L57.5,58.750002 C58.8807119,58.750002 60,57.6307139 60,56.250002 C60,54.8692901 58.8807119,53.750002 57.5,53.750002 L2.5,53.750002 C1.11928813,53.750002 0,54.8692901 0,56.250002 C0,57.6307139 1.11928813,58.750002 2.5,58.750002 Z',
        'M50.27,9.81000201 C50.4400859,9.80691034 50.6041932,9.87273359 50.725,9.99250201 L52.865,12.135002 C53.0998768,12.3692869 53.4182528,12.5005945 53.75,12.5 C53.9139262,12.5006701 54.0763125,12.4683629 54.2275,12.405002 C54.6949787,12.211771 55,11.7558425 55,11.250002 L55,1.25000201 C55,0.559646078 54.4403559,-1.66089364e-13 53.75,-1.66089364e-13 L43.75,-1.66089364e-13 C43.2437278,-0.000903794526 42.7869038,0.303659199 42.5930392,0.771343802 C42.3991746,1.2390284 42.5065579,1.77746653 42.865,2.13500201 L45.4175,4.68750201 C45.6554912,4.92400295 45.663231,5.30656884 45.435,5.55250201 L37.4,14.265002 C36.8990401,14.8014311 36.1314255,14.9967528 35.435,14.765002 L26.13,11.665002 C23.4633971,10.7637219 20.5198585,11.3169973 18.3625,13.125002 L5.5,23.850002 C4.1738263,24.9545715 3.99418058,26.9250782 5.09875006,28.251252 C6.20331954,29.5774257 8.17382624,29.7570715 9.5,28.652502 L22.3625,17.932502 C22.8622799,17.521351 23.5378586,17.3949158 24.1525,17.597502 L33.4575,20.697502 C36.4879776,21.7087815 39.8298385,20.8520446 42,18.507502 L49.835,10.007502 C49.9489187,9.8877728 50.1048815,9.8169621 50.27,9.81000201 Z'
      ]
    },
    slides: {
      viewBox: '0 0 79 60',
      paths: [
        'M60.8958333,0 L18.1041667,0 C15.3772607,0 13.1666667,2.23857625 13.1666667,5 L13.1666667,55 C13.1666667,57.7614237 15.3772607,60 18.1041667,60 L60.8958333,60 C63.6227393,60 65.8333333,57.7614237 65.8333333,55 L65.8333333,5 C65.8333333,2.23857625 63.6227393,0 60.8958333,0 Z M48.2953333,32.6333333 L33.6770417,41.26 C32.7524674,41.7982005 31.6143196,41.7948479 30.6928528,41.2512097 C29.7713861,40.7075715 29.2071876,39.70659 29.2134886,38.6266667 L29.2134886,21.3733333 C29.2071876,20.29341 29.7713861,19.2924285 30.6928528,18.7487903 C31.6143196,18.2051521 32.7524674,18.2017995 33.6770417,18.74 L48.298625,27.3666667 C49.2189915,27.9167684 49.7834946,28.9187016 49.7828188,30.0009523 C49.7821417,31.083203 49.2163867,32.0844118 48.2953333,32.6333333 Z',
        'M3.29166667,6.66666667 C1.47372937,6.66666667 0,8.15905083 0,10 L0,51.6666667 C0,53.5076158 1.47372937,55 3.29166667,55 C5.10960397,55 6.58333333,53.5076158 6.58333333,51.6666667 L6.58333333,10 C6.58333333,8.15905083 5.10960397,6.66666667 3.29166667,6.66666667 Z',
        'M75.7083333,6.66666667 C73.890396,6.66666667 72.4166667,8.15905083 72.4166667,10 L72.4166667,51.6666667 C72.4166667,53.5076158 73.890396,55 75.7083333,55 C77.5262706,55 79,53.5076158 79,51.6666667 L79,10 C79,8.15905083 77.5262706,6.66666667 75.7083333,6.66666667 Z'
      ]
    }
  });
