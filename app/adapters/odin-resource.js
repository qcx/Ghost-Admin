import ApplicationAdapter from 'ghost-admin/adapters/application';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

export default ApplicationAdapter.extend({
  pathForType: function(modelName) {
    var underscored = underscore(modelName);
    return pluralize(underscored);
  }
});