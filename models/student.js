const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: [true, 'Please provide the first name of the student'],
        minlength: 3,
        maxlegth: 50,
    },
    secondName: { 
        type: String,
        required: [true, 'Please provide the second name of the student'],
        minlength: 3,
        maxlegth: 50,
    },
    surname: { 
        type: String,
        required: [true, 'Please provide the surname name of the student'],
        minlength: 3,
        maxlegth: 50,
    },
    dateOfBirth:{
        type : Date,
        required: [true, 'Please the student date of birth']
    },
    admNumber:{
        type : Number,
        required: [true, 'Please provide the student admission number']
    },
    className:{
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the class name']
        //ref: 'class'
    }
})

module.exports = mongoose.model('Student',StudentSchema)