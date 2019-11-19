import Component from '@ember/component';
import ghostPaths from 'ghost-admin/utils/ghost-paths';
import {inject as service} from '@ember/service';

import _ from 'lodash/lodash';

const brokkUrl = 'https://vqs32o851c.execute-api.us-east-1.amazonaws.com/production/';

export default Component.extend({
    store: service(),
    init(){
        this._super(...arguments);
        this.store.query('odin-resource', {limit: 'all'});
        this.set('availableResources', this.store.peekAll('odin-resource'));
        this.set('selectedExaminingBoards', this.get('selectedAssociations').filter((resource) => resource.moduleId == this.get('examiningBoard').id));
        this.set('selectedInstitutes', this.get('selectedAssociations').filter((resource) => resource.moduleId == this.get('institute').id));
    },
    availableResources: null,
    examiningBoards: null,
    selectedExaminingBoards: null,
    institutes: null,
    selectedInstitutes: null,
    examiningBoard: {
        id: 4,
        name: 'Examining Boards',
        getFunction: 'getExaminingBoards'
    },
    institute: {
        id: 11,
        name: 'Institutes',
        getFunction: 'getInstitutes'
    },
    actions: {
        selectExaminingBoard(selected) {
            let previous = this.get('selectedExaminingBoards');
            let next = selected
            if (previous.length > next.length){
                this.set('selectedExaminingBoards', selected);
                this.set('selectedAssociations', selected.concat(this.get('selectedInstitutes')));
            }else{
                let added = selected[selected.length-1];
                let availableResources = this.get('availableResources');
                let duplicate = previous.find((resource) => {
                    return resource.resourceId == added.id && resource.moduleId == this.get('examiningBoard').id && resource.productId == 1;
                });
                if(duplicate) return;
                let resourceToAdd = availableResources.filter((resource) => {
                    added.id == resource.resourceId && this.get('examiningBoard').id == resource.moduleId && resource.productId == 1;
                });
                if(_.isEmpty(resourceToAdd)){
                    resourceToAdd = this.store.createRecord('odin-resource', {
                        moduleId: this.get('examiningBoard').id,
                        resourceId: added.id.toString(),
                        productId: '1',
                        label: added.sigla
                    });
                }
                this.get('selectedAssociations').pushObject(resourceToAdd);
                this.get('selectedExaminingBoards').pushObject(resourceToAdd);
            }
        },
        selectInstitute(selected) {
            let previous = this.get('selectedInstitutes');
            let next = selected
            if(previous.length > next.length){
                this.set('selectedInstitutes', selected);
                this.set('selectedAssociations', selected.concat(this.get('selectedExaminingBoards')));
            }else{
                let added = selected[selected.length-1];
                let availableResources = this.get('availableResources');
                let duplicate = previous.find((resource) => {
                    return resource.resourceId == added.id && resource.moduleId == this.get('institute').id && resource.productId == 1;
                });
                if(duplicate) return;
                let resourceToAdd = availableResources.filter((resource) => {
                    added.id == resource.resourceId && this.get('institute').id == resource.moduleId && resource.productId == 1;
                });
                if(_.isEmpty(resourceToAdd)){
                    resourceToAdd = this.store.createRecord('odin-resource', {
                        moduleId: this.get('institute').id,
                        resourceId: added.id.toString(),
                        productId: '1',
                        label: added.sigla
                    });
                }
                this.get('selectedAssociations').pushObject(resourceToAdd);
                this.get('selectedInstitutes').pushObject(resourceToAdd);
            }
        },
        getExaminingBoards() {
            if (!this.examiningBoards) {
                let collection = fetch(brokkUrl + 'product/1/examining_boards').then(response => response.json()).then(data => data);
                this.set('examiningBoards', collection);
            }
        },
        getInstitutes() {
            if (!this.institutes) {
                let collection = fetch(brokkUrl + 'product/1/institutes').then(response => response.json()).then(data => data);
                this.set('institutes', collection);
            }
        }
    }
});
