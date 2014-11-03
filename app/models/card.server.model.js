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


    languageFront: {
        name: String,
        code: String
    },

    languageback: {
        name: String,
        code: String
    },
    modes: {
        type: [String],
        default: ['forward']
    },
    question: {
        type: String,
        default: '',
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
    invalidanswers: {
        type: [String],
        default: []
    },
    validreverseanswers: {
        type: [String],
        default: []
    },
    invalidreverseanswers: {
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
    supervisor: {
        type: Schema.ObjectId,
    },
    packs: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    hrt: {
        type: Number,
        default: 0.0
    },
    readFront: {
        type: Boolean,
        default: false
    },
    readBack: {
        type: Boolean,
        default: false
    },
    speechRecognitionFront: {
        type: Boolean,
        default: false
    },
    speechRecognitionBack: {
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
    check: {
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
    },
    course: {
        type: Schema.Types.ObjectId
    },
    format: {
        type: String,
        default: 'short'
    }
});

mongoose.model('Card', CardSchema);