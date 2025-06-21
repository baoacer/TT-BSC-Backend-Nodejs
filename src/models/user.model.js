'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    password: {type: String},
    phone: {type: String},
    address: {type: String},
    isActive: { type: Boolean, default: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role'},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, UserSchema)
