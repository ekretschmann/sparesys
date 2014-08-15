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
    master: {
        type: Schema.Types.ObjectId
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