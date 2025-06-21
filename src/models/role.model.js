const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, RoleSchema);