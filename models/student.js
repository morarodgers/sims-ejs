const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: [true, 'Please provide the first name of the student'],
        maxlegth: 50,
    },
    secondName: { 
        type: String,
        required: [true, 'Please provide the second name of the student'],
        maxlegth: 50,
    },
    surname: { 
        type: String,
        required: [true, 'Please provide the surname name of the student'],
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
        type: String,
        required: [true, 'Please provide the class name']
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: [true, 'Please select the gender']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

StudentSchema.methods.formatBirthDate = function () {
    let dateOfBirth = '';
    if (this.dateOfBirth) {
        let day = new Date(this.dateOfBirth).getUTCDate();
        let month = new Date(this.dateOfBirth).getUTCMonth() + 1;
        let year = new Date(this.dateOfBirth).getUTCFullYear();
        if (day < 10) {
            day = day.toString().padStart(2, "0");
        }
        dateOfBirth = `${month}/${day}/${year}`; 
    }
    return dateOfBirth;
}

module.exports = mongoose.model('Student',StudentSchema)