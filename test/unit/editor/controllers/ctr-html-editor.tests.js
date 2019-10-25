'use strict';
describe('controller: HtmlEditor', function() {
	var presentation = {
		id: 'test'
	}
	beforeEach(module('risevision.editor.controllers'));
	beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
	beforeEach(module(function ($provide) {
		$provide.factory('editorFactory',function(){
			return { 
				presentation: presentation
			};
		});
		$provide.factory('presentationParser',function(){
			return {
				updatePresentation: function(){},
				parsePresentation: function(){}
			};
		});
		$provide.factory('distributionParser',function(){
			return {
				updateDistribution: function(){},
				parseDistribution: function(){}
			};
		});
	}));
	var $scope, updatePresentationSpy, updateDistributionSpy, parsePresentationSpy, parseDistributionSpy;
	beforeEach(function(){
		inject(function($injector,$rootScope, $controller, editorFactory, presentationParser, distributionParser){
			$scope = $rootScope.$new();
			updatePresentationSpy = sinon.spy(presentationParser, 'updatePresentation');
			updateDistributionSpy = sinon.spy(distributionParser, 'updateDistribution');
			parsePresentationSpy = sinon.spy(presentationParser, 'parsePresentation');
			parseDistributionSpy = sinon.spy(distributionParser, 'parseDistribution');
			$controller('HtmlEditorController', {
				$scope : $scope,
				editorFactory: editorFactory,
				presentationParser: presentationParser,
				distributionParser: distributionParser
			});
			
			$scope.$digest();
		});
	});

	it('should exist',function(){
		expect($scope).to.be.truely;
		expect($scope.factory).to.be.truely;
		expect($scope.codemirrorOptions).to.be.truely;
	});

	it('should call updatePresentation and updateDistribution on init',function(){
		updatePresentationSpy.should.have.been.calledWith(presentation);
		updateDistributionSpy.should.have.been.calledWith(presentation);
	});

	it('should parse presentation and distribution when scope $destroyed', function () {
		$scope.$destroy();  
		parsePresentationSpy.should.have.been.calledWith(presentation);
		parseDistributionSpy.should.have.been.calledWith(presentation);
	});
});
