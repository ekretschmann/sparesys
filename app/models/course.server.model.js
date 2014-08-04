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
        required: 'Please fill Course name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Course description',
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
    },
    language: {
        type: String,
        default: ''
    },
    master: {
        type: [Schema.Types.ObjectId]
    },
    visible: {
        type: Boolean,
        default: true
    }
});

mongoose.model('Course', CourseSchema);