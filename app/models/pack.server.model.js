'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pack Schema
 */
var PackSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pack name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    updated: {
        type: Date
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    course: {
        type: Schema.ObjectId
    },
    cards: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    due: {
        type: Date
    },
    after: {
        type: Date
    },
    slaves: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

mongoose.model('Pack', PackSchema);