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
        required: 'Please fill Reward name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Reward name',
        trim: true
    },
    defaulthealthpoints: {
        type: Number,
        default: 1
    },
    enables: [{
        type: Schema.ObjectId,
        default: []
    }],
    ingredients: {
        type: [{
            rewardId: {
                type: Schema.ObjectId
            },
            name: {
                type: String,
                default: '',
                required: 'Please fill Reward name',
                trim: true
            },
            amount: {
                type: Number,
                default: 1
            }
        }],
        default: [{name: 'Making Fire', amount: 1}]
    },
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
