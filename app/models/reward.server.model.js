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
        default: 'Item',
        required: 'Please fill Reward type',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    defaulthealthpoints: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        default: 1
    },
    enables: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Reward'
    },
    goals: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Reward'
    },
    ingredients: {
        type: [],
        default: []
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    basic: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Reward', RewardSchema);
