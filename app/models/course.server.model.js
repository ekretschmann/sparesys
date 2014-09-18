'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
    published: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: '',
        required: 'Can not create a course without a name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Can not create a course without a description',
        trim: true
    },
    front: {
        type: String,
        default: 'Question',
        trim: true
    },
    back: {
        type: String,
        default: 'Answer',
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
    packs: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    language: {
        name: String,
        code: String
    },

    languageback: {
        name: String,
        code: String
    },
    master: {
        type: Schema.Types.ObjectId
    },
    slaves: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    visible: {
        type: Boolean,
        default: true
    },
    supervised: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Course', CourseSchema);