'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Schoolclass Schema
 */
var SchoolclassSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Schoolclass name',
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
    students: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

mongoose.model('Schoolclass', SchoolclassSchema);