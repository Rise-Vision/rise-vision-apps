'use strict';
xdescribe('service: scheduleSelectorFactory:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('schedule',function () {
      return {
        list: sinon.stub().returns(Q.resolve({
          items: [1, 2]
        })),
        addPresentation: sinon.stub().returns(Q.resolve()),
        removePresentation: sinon.stub().returns(Q.resolve())
      };
    });
    $provide.service('playlistFactory', function() {
      return {
        newPresentationItem: sinon.stub().returns({id: 'playlistItemId'}),
        initPlayUntilDone: sinon.stub().returns(Q.resolve(true))
      };
    });
    $provide.service('templateEditorFactory', function() {
      return {
        presentation: {
          id: 'presentationId'
        }
      };
    });
    $provide.service('ScrollingListService', function() {
      return sinon.stub().returns({
        listService: 'listService'
      });
    });
    $provide.service('$state', function() {
      return {
        go: sinon.spy()
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.service('translateFilter', function(){
      return function(key){
        return key;
      };
    });
  }));
  var scheduleSelectorFactory, schedule, templateEditorFactory, playlistFactory, $state, ScrollingListService, processErrorCode;
  beforeEach(function(){
    inject(function($injector){  
      scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');
      schedule = $injector.get('schedule');
      templateEditorFactory = $injector.get('templateEditorFactory');
      playlistFactory = $injector.get('playlistFactory');
      $state = $injector.get('$state');
      ScrollingListService = $injector.get('ScrollingListService');
      processErrorCode = $injector.get('processErrorCode');
    });
  });

  it('should exist',function(){
    expect(scheduleSelectorFactory).to.be.ok;

    expect(scheduleSelectorFactory.getSchedulesComponent).to.be.a('function');    
    expect(scheduleSelectorFactory.load).to.be.a('function');
    expect(scheduleSelectorFactory.selectItem).to.be.a('function');
    expect(scheduleSelectorFactory.isSelected).to.be.a('function');
    expect(scheduleSelectorFactory.select).to.be.a('function');
    expect(scheduleSelectorFactory.addSchedule).to.be.a('function');
  });

  it('should init values',function(){
    expect(scheduleSelectorFactory.search).to.be.ok;
    expect(scheduleSelectorFactory.search.sortBy).to.equal('name');
    expect(scheduleSelectorFactory.selectedCount).to.equal(0);
  });

  describe('getSchedulesComponent:', function() {
    it('should return the component object', function() {
      expect(scheduleSelectorFactory.getSchedulesComponent()).to.deep.equal({
        type: 'rise-schedules',
        hasSelectedSchedules: true
      });
    });

    it('should load selected schedules', function(done) {
      var component = scheduleSelectorFactory.getSchedulesComponent();

      expect(component.hasSelectedSchedules).to.be.true;
      expect(scheduleSelectorFactory.selectedSchedules).to.deep.equal([]);
      expect(scheduleSelectorFactory.loadingSchedules).to.be.true;

      schedule.list.should.have.been.calledWith({
        sortBy: 'name',
        filter: 'presentationIds:~\"' + templateEditorFactory.presentation.id + '\"'
      });
      
      setTimeout(function() {
        expect(scheduleSelectorFactory.selectedSchedules).to.deep.equal([1, 2]);
        expect(component.hasSelectedSchedules).to.be.true;

        expect(scheduleSelectorFactory.loadingSchedules).to.be.false;

        done();
      }, 10);

    });

    it('should handle failure to get selected schedules',function(done){
      schedule.list.returns(Q.reject({result: {error: { message: 'ERROR; could not load schedules'}}}));

      var component = scheduleSelectorFactory.getSchedulesComponent();

      setTimeout(function() {
        expect(scheduleSelectorFactory.errorMessage).to.be.ok;
        processErrorCode.should.have.been.calledWith('Schedules', 'load', sinon.match.object);
        expect(scheduleSelectorFactory.apiError).to.be.ok;

        expect(scheduleSelectorFactory.loadingSchedules).to.be.false;

        done();
      }, 10);
    });

  });

  describe('load:', function() {
    it('should reset search and selected count', function() {
      scheduleSelectorFactory.search = 'oldSearch';
      scheduleSelectorFactory.selectedCount = 4;

      scheduleSelectorFactory.load();

      expect(scheduleSelectorFactory.search).to.deep.equal({
        sortBy: 'name',
        filter: 'NOT presentationIds:~\"' + templateEditorFactory.presentation.id + '\"'
      });
      expect(scheduleSelectorFactory.selectedCount).to.equal(0);
    });

    it('should load unselected schedules', function() {
      scheduleSelectorFactory.load();

      ScrollingListService.should.have.been.calledWith(schedule.list, scheduleSelectorFactory.search);
      expect(scheduleSelectorFactory.unselectedSchedules).to.deep.equal({
        listService: 'listService'
      });
    });

  });

  describe('selectItem:', function() {
    beforeEach(function() {
      scheduleSelectorFactory.selectedSchedules = [];
      scheduleSelectorFactory.unselectedSchedules = {
        items: {
          list: []
        }
      };
    });

    it('should deselect if selected', function() {
      var item = {
        isSelected: true
      };

      scheduleSelectorFactory.selectItem(item);

      expect(item.isSelected).to.be.false;
    });

    it('should select if deselected', function() {
      var item = {
        isSelected: false
      };

      scheduleSelectorFactory.selectItem(item);

      expect(item.isSelected).to.be.true;
    });

    it('should use opposite of default value if undefined', function() {
      var item = {};

      scheduleSelectorFactory.selectItem(item, true);

      expect(item.isSelected).to.be.false;

      item = {};

      scheduleSelectorFactory.selectItem(item, false);

      expect(item.isSelected).to.be.true;
    });

    it('should update selectedCount', function() {
      scheduleSelectorFactory.selectedSchedules.push({
        isSelected: false
      });
      scheduleSelectorFactory.unselectedSchedules.items.list.push({
        isSelected: true
      });

      scheduleSelectorFactory.selectItem({});

      expect(scheduleSelectorFactory.selectedCount).to.equal(2);
    });

  });

  describe('isSelected:', function() {
    it('should deselect if selected', function() {
      var item = {
        isSelected: true
      };

      expect(scheduleSelectorFactory.isSelected(item)).to.be.true;
    });

    it('should select if deselected', function() {
      var item = {
        isSelected: false
      };

      expect(scheduleSelectorFactory.isSelected(item)).to.be.false;
    });

    it('should return default value if undefined', function() {
      var item = {};

      expect(scheduleSelectorFactory.isSelected(item, true)).to.be.true;

      item = {};

      expect(scheduleSelectorFactory.isSelected(item, false)).to.be.false;
    });

  });

  describe('select:', function() {
    beforeEach(function() {
      scheduleSelectorFactory.selectedSchedules = [];
      scheduleSelectorFactory.unselectedSchedules = {
        items: {
          list: []
        }
      };
    });

    it('should update selected and unselected schedules and refresh list', function(done) {
      scheduleSelectorFactory.selectedCount = 2;
      scheduleSelectorFactory.selectedSchedules.push({
        id: 'item1',
        isSelected: false
      },
      {
        id: 'item2',
        isSelected: true
      });
      scheduleSelectorFactory.unselectedSchedules.items.list.push({
        id: 'item3',
        isSelected: false
      },
      {
        id: 'item4',
        isSelected: true
      });

      scheduleSelectorFactory.select();

      expect(scheduleSelectorFactory.loadingSchedules).to.be.true;
      playlistFactory.newPresentationItem.should.have.been.calledWith(templateEditorFactory.presentation);
      playlistFactory.initPlayUntilDone.should.have.been.calledWith({id: 'playlistItemId'}, templateEditorFactory.presentation, true);

      schedule.removePresentation.should.have.been.called;
      schedule.removePresentation.should.have.been.calledWith(['item1'], templateEditorFactory.presentation.id);
      
      setTimeout(function() {
        schedule.addPresentation.should.have.been.called;
        schedule.addPresentation.should.have.been.calledWith(['item4'], '{"id":"playlistItemId"}');

        schedule.list.should.have.been.called;

        done();
      }, 10);
    });

    it('should skip adding Presentation if unselected schedules are not selected', function(done) {
      scheduleSelectorFactory.selectedCount = 1;
      scheduleSelectorFactory.selectedSchedules.push({
        id: 'item1',
        isSelected: false
      },
      {
        id: 'item2',
        isSelected: true
      });
      scheduleSelectorFactory.unselectedSchedules.items.list.push({
        id: 'item3',
        isSelected: false
      },
      {
        id: 'item4',
        isSelected: false
      });

      scheduleSelectorFactory.select();

      expect(scheduleSelectorFactory.loadingSchedules).to.be.true;
      playlistFactory.newPresentationItem.should.not.have.been.called;
      playlistFactory.initPlayUntilDone.should.not.have.been.called;

      schedule.removePresentation.should.have.been.called;
      schedule.removePresentation.should.have.been.calledWith(['item1'], templateEditorFactory.presentation.id);
      
      setTimeout(function() {
        schedule.addPresentation.should.not.have.been.called;

        schedule.list.should.have.been.called;

        done();
      }, 10);
    });

    
    it('should skip removing Presentation if selected schedules are not unselected', function(done) {
      scheduleSelectorFactory.selectedCount = 1;
      scheduleSelectorFactory.selectedSchedules.push({
        id: 'item1',
        isSelected: true
      },
      {
        id: 'item2',
        isSelected: true
      });
      scheduleSelectorFactory.unselectedSchedules.items.list.push({
        id: 'item3',
        isSelected: false
      },
      {
        id: 'item4',
        isSelected: true
      });

      scheduleSelectorFactory.select();

      expect(scheduleSelectorFactory.loadingSchedules).to.be.true;
      playlistFactory.newPresentationItem.should.have.been.calledWith(templateEditorFactory.presentation);
      playlistFactory.initPlayUntilDone.should.have.been.calledWith({id: 'playlistItemId'}, templateEditorFactory.presentation, true);

      schedule.removePresentation.should.not.have.been.called;
      
      setTimeout(function() {
        schedule.addPresentation.should.have.been.called;
        schedule.addPresentation.should.have.been.calledWith(['item4'], '{"id":"playlistItemId"}');

        schedule.list.should.have.been.called;

        done();
      }, 10);
    });

    it('should skip both operations if selected count is 0', function(done) {
      scheduleSelectorFactory.selectedCount = 0;
      scheduleSelectorFactory.selectedSchedules.push({
        id: 'item1',
        isSelected: true
      },
      {
        id: 'item2',
        isSelected: true
      });
      scheduleSelectorFactory.unselectedSchedules.items.list.push({
        id: 'item3',
        isSelected: false
      },
      {
        id: 'item4',
        isSelected: false
      });

      scheduleSelectorFactory.select();

      expect(scheduleSelectorFactory.loadingSchedules).to.not.be.true;
      playlistFactory.newPresentationItem.should.not.have.been.called;
      playlistFactory.initPlayUntilDone.should.not.have.been.called;

      schedule.removePresentation.should.not.have.been.called;
      
      setTimeout(function() {
        schedule.addPresentation.should.not.have.been.called;

        schedule.list.should.not.have.been.called;

        done();
      }, 10);
    });
  });

  it('addSchedule:', function() {
    scheduleSelectorFactory.addSchedule();

    $state.go.should.have.been.calledWith('apps.schedules.add', {
      presentationItem: templateEditorFactory.presentation
    });
  });

});
