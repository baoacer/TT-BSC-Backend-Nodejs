'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

// const grantList = [
//     { role: 'admin', resource: 'profile', actions: 'update:any', attributes: '*' },
//     { role: 'admin', resource: 'balance', actions: 'update:any', attributes: '*, !mount' },

//     { role: 'shop', resource: 'profile', actions: 'update:own', attributes: '*' },
//     { role: 'shop', resource: 'balance', actions: 'update:own', attributes: '*, !mount' },

//     { role: 'user', resource: 'profile', actions: 'update:own', attributes: '*' },
//     { role: 'user', resource: 'profile', actions: 'read:own', attributes: '*' },
// ]

const RoleSchema = new Schema({
    rol_name: {type: String, default: 'user', enum: ['admin', 'user', 'shop']},
    rol_slug: {type: String, required: true}, // 00091
    rol_description: {type: String, default: ''},
    rol_status: {type: String, default: 'active', enum: ['active', 'block']},
    rol_grants: [
        {
            resource: {type: Schema.Types.ObjectId, ref: 'Resource', required: true},
            actions: {type: [String], required: true}, 
            attributes: {type: String, default: '*'},
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, RoleSchema)
