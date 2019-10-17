import Ember from 'ember';
import {computed} from '@ember/object';

export default Ember.Component.extend({
  selectedModule: null,
  selectedRecord: null,
  modules: [
    {
      id: 4,
      name: 'Banca'
    },
    {
      id: 6,
      name: 'Cargo'
    },
    {
      id: 11,
      name: 'Instituto'
    }
  ],
  moduleOptions: [],
  options: {
    4: ['A', 'B', 'C'],
    6: ['1', '2', '3'],
    11: ['X', 'Y', 'Z']
  },
  actions: {
    setModule: function(selected) {
      this.set('selectedModule', selected)
      this.set('moduleOptions', this.get('options')[selected.id])
    },
    isModulePresent: function() {
      return selectedModule !== null;
    }
  }
});