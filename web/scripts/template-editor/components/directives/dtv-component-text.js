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
          $scope.sliderOptions = {
            hideLimitLabels: true,
            hidePointerLabels: true
          };

          $scope.tinymceOptions = {
            plugins: "code colorpicker textcolor wordcount",
            skin_url: "//s3.amazonaws.com/rise-common/styles/tinymce/rise",
            font_formats: getFontFormats(),
            formats: {
              fontsize: { inline: "span", split: false, styles: { fontSize: "%value" } },
              lineHeight: { inline: "span", styles: { lineHeight: "%value" } },
              paragraph: { block: "p", styles: { margin: "0" } }
            },
            content_css: _googleFontUrls,
            style_formats_merge: true,
            fontsize_formats: FONT_SIZES,
            min_height: 175,
            menubar: false,
            toolbar1: "fontselect fontsizeselect | " +
              "forecolor backcolor | " +
              "bold italic underline | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist indent outdent lineheight | " +
              "removeformat code",
            setup: function(editor) {
              editor.addButton("lineheight", {
                type: "listbox",
                text: "Line Height",
                title: "Line Height",
                icon: false,
                values: [
                  {text:"Single", value: "1"},
                  {text:"Double", value: "2"}
                ],
                onselect: function () {
                  applyLineHeight(editor, this.value());
                },
                onPostRender: function () {
                  _lineHeightTool = this;
                }
              });
  
              editor.on("init", function() {
                var mceContainerDivWidth = document.querySelector(".mce-container-body").offsetWidth;
                var placeholderWidth = _prefs.getInt("rsW");
  
                if (placeholderWidth > mceContainerDivWidth) {
                  document.querySelector(".mce-edit-area iframe").contentDocument.body.style.width = placeholderWidth + "px";
                } else {
                  document.querySelector(".mce-edit-area iframe").style.width = placeholderWidth + "px";
                }
  
                  addCustomFontsToFrame(editor);
  
                if (_isLoading) {
                  addCustomFontsToDocument($scope.settings.additionalParams.customFonts.fonts);
                    if(!$scope.settings.additionalParams.data) {
                    editor.execCommand("FontName", false, "verdana,geneva,sans-serif");
                    editor.execCommand("FontSize", false, "24px");
                  }
                    editor.formatter.apply("paragraph");
                    editor.formatter.register("lineHeight", {inline : "span", styles : {lineHeight : "%value"}});
                  _lineHeightTool.value("2");
                  _lineHeightTool.value("1");
                    applyLineHeight(editor, "1");
                }
                else {
                  editor.selection.select(editor.getBody(), true);
                  editor.selection.collapse(false);
  
                  if (_customFontToSelect) {
                    editor.execCommand("FontName", false, _customFontToSelect.replace(/'/g, "\\'").toLowerCase() + ",sans-serif");
                    _customFontToSelect = "";
                  }
                }
  
                _isLoading = false;
              });
  
              editor.on("ExecCommand", function(args) {
                initCommands(editor, args);
              });
  
              editor.on("NodeChange", function() {
                updateLineHeight(editor);
              });
  
            },
            init_instance_callback: function(editor) {
              var oldApply = editor.formatter.apply,
                oldRemove = editor.formatter.remove;
                editor.formatter.apply = function apply(name, vars, node) {
                var args = {
                  command: name,
                  value: vars.value
                };
  
                oldApply(name, vars, node);
                editor.fire("ExecCommand", args);
              };
  
              editor.formatter.remove = function remove(name, vars, node) {
                var args = {
                  command: name,
                  value: (vars && vars.value) ? vars.value : null
                };
  
                oldRemove(name, vars, node);
                editor.fire("ExecCommand", args);
              };
            }
          };

          function _load() {
            $scope.isMultiline = $scope.getBlueprintData($scope.componentId, 'multiline');
            var value = $scope.getAvailableAttributeData($scope.componentId, 'value');
            var fontsize = $scope.getAvailableAttributeData($scope.componentId, 'fontsize');
            var minfontsize = $scope.getAvailableAttributeData($scope.componentId, 'minfontsize');
            var maxfontsize = $scope.getAvailableAttributeData($scope.componentId, 'maxfontsize');

            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);
            var minFontSize = templateEditorUtils.intValueFor(minfontsize, 1);
            var maxFontSize = templateEditorUtils.intValueFor(maxfontsize, 200);

            $scope.sliderOptions.floor = minFontSize;
            $scope.sliderOptions.ceil = maxFontSize;
            $scope.sliderOptions.onEnd = $scope.save;

            $scope.value = value;
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'value', $scope.value);

            if ($scope.showFontSize) {
              $scope.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
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
