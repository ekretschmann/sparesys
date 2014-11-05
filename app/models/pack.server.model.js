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

    modes: {
        type: [String],
        default: ['forward']
    },
    checks: {
        type: String,
        default: 'default'
    },
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
        type: Schema.ObjectId,
        ref: 'Course'
    },
    cards: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Card'
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
    },
    master: {
        type: [Schema.Types.ObjectId]
    }
});

mongoose.model('Pack', PackSchema);