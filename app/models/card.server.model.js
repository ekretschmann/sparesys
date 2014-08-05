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
		required: 'Please fill out Card Question',
		trim: true
	},
    answer: {
        type: String,
        default: '',
        required: 'Please fill out Card Answer',
        trim: true
    },
    alternatives: {
        type: [String],
        default: []
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
    packs: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    hrt: {
        type: Number,
        default: 0.0
    },
    lastRep: {
        type: Number,
        default: 0.0
    },
    history: {
        type: [{when: Number, assessment: Number}],
        default: [],
        _id: false
    },
    style: {
        type: [Boolean],
        // read - write - listen - multiple-choice
        default: [true, true, false, false]
    },
    due: {
        type: Date
    },
    after: {
        type: Date
    }
});

mongoose.model('Card', CardSchema);