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
    }
});

mongoose.model('Course', CourseSchema);