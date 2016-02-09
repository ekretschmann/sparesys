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

    priority: {
        type: Number,
        default: 3
    },
    imagesReadFront: {
        type: Boolean,
        default: false
    },
    speechRecognitionImages: {
        type: Boolean,
        default: false
    },
    imagesReadBack: {
        type: Boolean,
        default: false
    },

    languageFront: {
        name: String,
        code: String
    },

    languageBack: {
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
    questionExtension: {
        type: String,
        default: '',
        trim: true
    },
    answer: {
        type: String,
        default: '',
        required: 'Please fill out Card Answer',
        trim: true
    },
    answerExtension: {
        type: String,
        default: '',
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
    supervisor: {
        type: Schema.ObjectId
    },
    packs: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    hrt: {
        type: Number,
        default: 0.0
    },
    readFrontForward: {
        type: Boolean,
        default: false
    },
    readBackForward: {
        type: Boolean,
        default: false
    },
    readFrontReverse: {
        type: Boolean,
        default: false
    },
    readBackReverse: {
        type: Boolean,
        default: false
    },
    speechRecognitionForward: {
        type: Boolean,
        default: false
    },
    speechRecognitionReverse: {
        type: Boolean,
        default: false
    },
    lastRep: {
        type: Number,
        default: 0.0
    },
    history: {
        type: [
            {when: Number, assessment: Number, hrt: Number, mode: String, check: String}
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
        default: 'mixed'
    },
    dueDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    slaves: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    master: {
        type: Schema.Types.ObjectId
    },
    course: {
        type: Schema.Types.ObjectId
    },
    format: {
        type: String,
        default: 'short'
    },
    acceptedAnswersForward: {
        type: [String],
        default: []
    },
    alternativeAnswersForward: {
        type: [String],
        default: []
    },
    alternativeAnswersReverse: {
        type: [String],
        default: []
    },
    invalidAnswersForward: {
        type: [String],
        default: []
    },
    acceptedAnswersReverse: {
        type: [String],
        default: []
    },
    invalidAnswersReverse: {
        type: [String],
        default: []
    },
    timedForward : {
        type: Boolean,
        default: false
    },
    limitForward: {
        type: Number,
        default: 10
    },
    timedReverse: {
        type: Boolean,
        default: false
    },
    limitReverse: {
        type: Number,
        default: 10
    },
    timedImages: {
        type: Boolean,
        default: false
    },
    limitImages: {
        type: Number,
        default: 10
    },
    packName: {
        type: String,
        default: ''
    }

});

mongoose.model('Card', CardSchema);