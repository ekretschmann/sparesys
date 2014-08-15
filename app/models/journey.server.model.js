'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Journey Schema
 */
var JourneySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    createdCourse: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Journey', JourneySchema);