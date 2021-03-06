'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * School Schema
 */
var SchoolSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill School name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    country: {
        type: String,
        default: '',
        required: 'Please fill Country',
        trim: true
    },
    city: {
        type: String,
        default: '',
        required: 'Please fill City',
        trim: true
    },
    teachers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    schoolclasses:
        [{
            type: Schema.ObjectId,
            ref: 'Schoolclass'
        }]
});

mongoose.model('School', SchoolSchema);
