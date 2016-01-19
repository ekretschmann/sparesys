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
    journey: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: 'Home'
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
    basis: {
        type: Schema.Types.ObjectId
    },
//{"keep":false,"amount":1,"name":"Soil","rewardId":"5639bb18486fca0000104e84"},
    ingredients: {

        type: [{
            name: {
                type: String,
                default: '',
                trim: true
            },
            rewardId: {
                type: Schema.ObjectId
            },
            keep: {
                type: Boolean,
                default: false
            },
            amount: {
                type: Number,
                default: 1
            }
        }]
        //default: [{name: 'Making Fire', amount: 1}]
    },
    //ingredients: {
    //    type: [],
    //    default: []
    //},
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
    },
    icon: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Reward', RewardSchema);
