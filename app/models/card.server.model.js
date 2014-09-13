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
    alternativequestions: {
        type: [String],
        default: []
    },
    answer: {
        type: String,
        default: '',
        required: 'Please fill out Card Answer',
        trim: true
    },
    validanswers: {
        type: [String],
        default: []
    },
    validreverseanswers: {
        type: [String],
        default: []
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
    sound: {
        type: Boolean,
        default: false
    },
    bothways: {
        type: Boolean,
        default: false
    },
    lastRep: {
        type: Number,
        default: 0.0
    },
    history: {
        type: [
            {when: Number, assessment: Number}
        ],
        default: [],
        _id: false
    },
    images: {
        type: [String],
        default: []
    },
    validation: {
        type: String,
        default: 'default'
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

mongoose.model('Card', CardSchema);