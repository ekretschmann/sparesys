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
    cardDefaults: {
        type: {
            languageFront: {
                name: String,
                code: String
            },

            languageback: {
                name: String,
                code: String
            },
            checks: String,
            forward: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                readFront: {
                    type: Boolean,
                    default: false
                },
                readBack: {
                    type: Boolean,
                    default: false
                },
                speechRecognition: {
                    type: Boolean,
                    default: false
                },
                timed: {
                    type: Boolean,
                    default: false
                },
                timeLimit: {
                    type: Number,
                    default: 10
                }
            },
            reverse: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                readFront: {
                    type: Boolean,
                    default: false
                },
                readBack: {
                    type: Boolean,
                    default: false
                },
                speechRecognition: {
                    type: Boolean,
                    default: false
                },
                timed: {
                    type: Boolean,
                    default: false
                },
                timeLimit: {
                    type: Number,
                    default: 10
                }
            },
            images: {
                enabled: {
                    type: Boolean,
                    default: false
                },
                readFront: {
                    type: Boolean,
                    default: false
                },
                readBack: {
                    type: Boolean,
                    default: false
                },
                speechRecognition: {
                    type: Boolean,
                    default: false
                },
                timed: {
                    type: Boolean,
                    default: false
                },
                timeLimit: {
                    type: Number,
                    default: 10
                }
            }
        },
        default: {
            languageFront: {
                name: '---',
                code: ''
            },

            languageback: {
                name: '---',
                code: ''
            },
            checks: 'mixed',
            forward: {
                enabled: true,
                readFront: false,
                readBack: false,
                speechRecognition: false
            },
            reverse: {
                enabled: false,
                readFront: false,
                readBack: false,
                speechRecognition: false
            },
            images: {
                enabled: false,
                readFront: false,
                readBack: false,
                speechRecognition: false
            }

        }
    },
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
    packs: [{
        type: Schema.ObjectId,
        ref: 'Pack',
        default: []
    }],
    languageFront: {
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
    },
    speechrecognition: {
        type: String,
        default: 'no'
    },
    teaching: {
        type: Boolean,
        default: false
    },
    readfront: {
        type: Boolean,
        default: false
    },
    readback: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Course', CourseSchema);
