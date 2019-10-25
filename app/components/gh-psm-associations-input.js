import Component from '@ember/component';
const brokkUrl = 'https://vqs32o851c.execute-api.us-east-1.amazonaws.com/production/';
export default Component.extend({
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
                return unique.map(e => e.id).includes(element.id) ? unique : [...unique, element];
            }, []);
            this.set('selectedExaminingBoards', selected);
        },
        selectInstitute(selected) {
            selected = selected.reduce((unique, element) => {
                return unique.map(e => e.id).includes(element.id) ? unique : [...unique, element];
            }, []);
            this.set('selectedInstitutes', selected);
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