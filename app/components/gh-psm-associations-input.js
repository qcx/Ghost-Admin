import Component from '@ember/component';
import ghostPaths from 'ghost-admin/utils/ghost-paths';
import {inject as service} from '@ember/service';

import _ from 'lodash/lodash';

const brokkUrl = 'https://vqs32o851c.execute-api.us-east-1.amazonaws.com/production/';

export default Component.extend({
    url: `${ghostPaths().apiRoot}/odin_associations`,
    ajax: service(),
    examiningBoards: null,
    selectedExaminingBoards: [],
    examiningBoardsIds: [],
    institutes: null,
    selectedInstitutes: [],
    institutesIds: [],
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
            selected = selected.reduce((unique, element) => {
                if(unique.map(e => e.id).includes(element.id)){
                    return unique;
                }
                return [...unique, element];
            }, []);
            let previous = this.get('selectedExaminingBoards');
            let next = selected
            if(previous.length > next.length){
                let diff = this.compareState(previous, next);
                if(!diff) return;
                this.deleteAssociation(diff.association_id);
                this.set('selectedExaminingBoards', selected);
            }else{
                let diff = this.compareState(next, previous);
                if(!diff) return;
                let data = this.buildData(this.get('examiningBoard'), selected[selected.length-1]);
                this.createAssociation(data).then((id) => {
                    selected[selected.length-1].association_id = id;
                    this.set('selectedExaminingBoards', selected);
                });
            }
        },
        selectInstitute(selected) {
            selected = selected.reduce((unique, element) => {
                if(unique.map(e => e.id).includes(element.id)){
                    return unique;
                }
                return [...unique, element];
            }, []);
            let previous = this.get('selectedInstitutes');
            let next = selected
            if(previous.length > next.length){
                let diff = this.compareState(previous, next);
                if(!diff) return;
                this.deleteAssociation(diff.association_id);
                this.set('selectedInstitutes', selected);
            }else{
                let diff = this.compareState(next, previous);
                if(!diff) return;
                let data = this.buildData(this.get('institute'), selected[selected.length-1]);
                this.createAssociation(data).then((id) => {
                    selected[selected.length-1].association_id = id;
                    this.set('selectedInstitutes', selected);
                });
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
    },
    compareState(previous, next){
        let diff = _.differenceBy(previous, next, 'id');
        return diff[0];
    },
    buildData(module, resource) {
        return JSON.stringify({
            odin_associations: [{
                post_id: this.postId,
                module_id: module.id,
                resource_id: resource.id
            }]
        });
    },
    createAssociation(data) {
        return this.ajax.post(this.url, {
            data: data,
            processData: false,
            contentType: 'application/json',
            dataType: 'text',
            xhr: () => {
                return new window.XMLHttpRequest();
            }
        }).then((response) => {
            return JSON.parse(response).odin_associations[0].id;
        });
    },
    deleteAssociation(id) {
        let url = this.url+`/${id}`;
        return this.ajax.del(url);
    }
});