/* eslint-disable camelcase */
import ApplicationSerializer from 'ghost-admin/serializers/application';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';
import {pluralize} from 'ember-inflector';

export default ApplicationSerializer.extend(EmbeddedRecordsMixin, {
    // settings for the EmbeddedRecordsMixin.
    attrs: {
        authors: {embedded: 'always'},
        tags: {embedded: 'always'},
        odinResources: {embedded: 'always'},
        publishedAtUTC: {key: 'published_at'},
        createdAtUTC: {key: 'created_at'},
        updatedAtUTC: {key: 'updated_at'},
        email: {embedded: 'always'}
    },

    normalizeSingleResponse(store, primaryModelClass, payload) {
        let root = this.keyForAttribute(primaryModelClass.modelName);
        let pluralizedRoot = pluralize(primaryModelClass.modelName);

        if (payload[pluralizedRoot]) {
            payload[root] = payload[pluralizedRoot][0];
            delete payload[pluralizedRoot];
        }

        return this._super(...arguments);
    },

    normalizeArrayResponse() {
        return this._super(...arguments);
    },

    serialize(/*snapshot, options*/) {
        let json = this._super(...arguments);

        // Inserted locally as a convenience.
        delete json.author_id;
        // Read-only virtual properties
        delete json.uuid;
        delete json.url;
        delete json.send_email_when_published;
        // Deprecated property (replaced with data.authors)
        delete json.author;

        if (json.visibility === null) {
            delete json.visibility;
        }

        return json;
    }
});
