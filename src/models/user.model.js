'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const UserSchema = new Schema({
    usr_id: {type: Number, required: true},
    usr_slug: {type: String, required: true},
    usr_name: {type: String, required: true},
    usr_password: {type: String, required: true},
    usr_email: {type: String, required: true},
    usr_phone: {type: String, default: ''},
    usr_avatar: {type: String, default: ''},
    usr_salf: {type: String, default: ''},
    usr_sex: {type: String, default: ''},
    usr_status: {type: String, default: 'active', enum: ['active', 'block']},
    usr_date_of_birth: {type: String, default: ''},
    usr_role: {type: Schema.Types.ObjectId, ref: 'Role'},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, UserSchema)
