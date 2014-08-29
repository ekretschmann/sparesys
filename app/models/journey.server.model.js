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
    },
    createdPack: {
        type: Boolean,
        default: false
    },
    createdCard: {
        type: Boolean,
        default: false
    },
    editedCourse: {
        type: Boolean,
        default: false
    },
    editedPack: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Journey', JourneySchema);