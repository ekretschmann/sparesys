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
    students: [{
        type: Schema.ObjectId,
        ref: 'User',
        default: []
    }],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    //courses: {
    //    type: [Schema.Types.ObjectId],
    //    default: []
    //},
    courses:
        [{
        type: Schema.ObjectId,
        ref: 'Course'
    }],
    school: {
        type: Schema.ObjectId
    }
});

mongoose.model('Schoolclass', SchoolclassSchema);