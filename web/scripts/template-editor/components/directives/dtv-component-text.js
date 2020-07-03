'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['$timeout', '$window', 'templateEditorFactory', 'templateEditorUtils',
    function ($timeout, $window, templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.data = {};

          /*jshint camelcase: false */
          $scope.tinymceOptions = {
            baseURL: '/vendor/tinymce/', //set path to load theme and skin files
            plugins: 'colorpicker textcolor lists link',
            menubar: false,
            toolbar1: 'fontselect fontsizeselect | ' +
              'bold italic underline | ' +
              'forecolor backcolor | ' +
              'link | ' +
              'numlist bullist | ' +
              'alignleft aligncenter alignright | ' +
              'removeformat',
            fontsize_formats: '24px 36px 48px 60px 72px 84px 96px 108px 120px 150px 200px 300px',
            force_p_newlines: false,
            forced_root_block: '',
            content_style: '@import url(\'https://fonts.googleapis.com/css2?family=Roboto&family=Open+Sans&family=Lato&family=Noto+Sans+JP&family=Montserrat&family=Roboto+Condensed&family=Source+Sans+Pro&family=Oswald&family=Raleway&family=Roboto+Mono&family=Poppins&family=Noto+Sans&family=Roboto+Slab&family=Merriweather&family=PT+Sans&family=Ubuntu&family=Playfair+Display&family=Muli&family=Open+Sans+Condensed&family=PT+Serif&family=Mukta&family=Nunito&family=Lora&family=Work+Sans&family=Fira+Sans&family=Rubik&family=Noto+Sans+KR&family=Noto+Serif&family=Titillium+Web&family=Nanum+Gothic&family=Noto+Sans+TC&family=Quicksand&family=Nunito+Sans&family=PT+Sans+Narrow&family=Heebo&family=Inconsolata&family=Barlow&family=Hind+Siliguri&family=Oxygen&family=Arimo&family=Dosis&family=Libre+Baskerville&family=Crimson+Text&family=Karla&family=Slabo+27px&family=Josefin+Sans&family=Bitter&family=Anton&family=Libre+Franklin&family=Cabin\');',
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats; Roboto=roboto,sans-serif;Open Sans=open sans,sans-serif;Lato=lato,sans-serif;Noto Sans JP=noto sans jp,sans-serif;Montserrat=montserrat,sans-serif;Roboto Condensed=roboto condensed,sans-serif;Source Sans Pro=source sans pro,sans-serif;Oswald=oswald,sans-serif;Raleway=raleway,sans-serif;Roboto Mono=roboto mono,sans-serif;Poppins=poppins,sans-serif;Noto Sans=noto sans,sans-serif;Roboto Slab=roboto slab,sans-serif;Merriweather=merriweather,sans-serif;PT Sans=pt sans,sans-serif;Ubuntu=ubuntu,sans-serif;Playfair Display=playfair display,sans-serif;Muli=muli,sans-serif;Open Sans Condensed=open sans condensed,sans-serif;PT Serif=pt serif,sans-serif;Mukta=mukta,sans-serif;Nunito=nunito,sans-serif;Lora=lora,sans-serif;Work Sans=work sans,sans-serif;Fira Sans=fira sans,sans-serif;Rubik=rubik,sans-serif;Noto Sans KR=noto sans kr,sans-serif;Noto Serif=noto serif,sans-serif;Titillium Web=titillium web,sans-serif;Nanum Gothic=nanum gothic,sans-serif;Noto Sans TC=noto sans tc,sans-serif;Quicksand=quicksand,sans-serif;Nunito Sans=nunito sans,sans-serif;PT Sans Narrow=pt sans narrow,sans-serif;Heebo=heebo,sans-serif;Inconsolata=inconsolata,sans-serif;Barlow=barlow,sans-serif;Hind Siliguri=hind siliguri,sans-serif;Oxygen=oxygen,sans-serif;Arimo=arimo,sans-serif;Dosis=dosis,sans-serif;Libre Baskerville=libre baskerville,sans-serif;Crimson Text=crimson text,sans-serif;Karla=karla,sans-serif;Slabo 27px=slabo 27px,sans-serif;Josefin Sans=josefin sans,sans-serif;Bitter=bitter,sans-serif;Anton=anton,sans-serif;Libre Franklin=libre franklin,sans-serif;Cabin=cabin,sans-serif;',
            setup: function (editor) {
              editor.on('paste', function (e) {
                //paste does not trigger change event
                //editor.getContent() needs timeout in order to include the change
                setTimeout(function () {
                  $scope.data.richText = editor.getContent();
                  $scope.save();
                }, 100);
              });
            }
          };
          /*jshint camelcase: true */

          function _load() {
            $scope.isMultiline = $scope.getBlueprintData($scope.componentId, 'multiline');
            var value = $scope.getAvailableAttributeData($scope.componentId, 'value');
            var richText = $scope.getAvailableAttributeData($scope.componentId, 'richText');
            var fontsize = $scope.getAvailableAttributeData($scope.componentId, 'fontsize');
            var minfontsize = $scope.getAvailableAttributeData($scope.componentId, 'minfontsize');
            var maxfontsize = $scope.getAvailableAttributeData($scope.componentId, 'maxfontsize');

            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);
            var minFontSize = templateEditorUtils.intValueFor(minfontsize, 1);
            var maxFontSize = templateEditorUtils.intValueFor(maxfontsize, 200);

            if (richText !== null && typeof richText !== 'undefined') {
              $scope.data.richText = richText;
            } else if (!!fontsizeInt) {
              $scope.data.richText = '<span style="font-size: ' + fontsizeInt + 'px;">' + value + '</span>';
            } else {
              $scope.data.richText = value;
            }

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'richText', $scope.data.richText);
            $scope.setAttributeData($scope.componentId, 'value', undefined);
          };

          $scope.registerDirective({
            type: 'rise-text',
            iconType: 'streamline',
            icon: 'text',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
