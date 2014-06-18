'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Card Schema
 */
var CardSchema = new Schema({
	question: {
		type: String,
		default: '',
		required: 'Please fill Card question',
		trim: true
	},
    answer: {
        type: String,
        default: '',
        required: 'Please fill Card answer',
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
    packs: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

mongoose.model('Card', CardSchema);