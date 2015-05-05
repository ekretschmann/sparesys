'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Reward Schema
 */
var RewardSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Reward name',
        trim: true
    },
    type: {
        type: String,
        default: 'Cheap Item',
        trim: true
    },
    ingredients: [{
        name: {
            type: String,
            default: '',
            required: 'Please fill Reward name',
            trim: true
        },
        amount: {
            type: Number,
            default: 1
        },
        keep: {
            type: Boolean,
            default: false
        }
    }],
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Reward', RewardSchema);