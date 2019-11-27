import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  moduleId: attr('string'),
  resourceId: attr('string'),
  productId: attr('string'),
  label: attr('string')
});