const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true, 'A name is required in this field'],
		unique:false
		
	},
	email:{
		type:String,
		required:[true, 'An Email is required in this field'],
		unique:true,
		lowercase:true,
		validate: [validator.isEmail]
	},
	passwordResetToken:String,
	passwordResetExpires: Date,
	photo:String,
	role:{
		type:String,
		enum:['user', 'guide', 'lead-guide', 'admin'],
		default:'user'
	},
	password:{
		type:String,
		required:[true,'Please provide a password'],
		minlength:8,
		select:false
	},
	confirmPassword:{
		type:String,
		required:[true,'Please provide a valid password'],
		validate:{
			//THIS ONLY WORKS ON CREATING AND SAVING
			validator: function(el){
				return el === this.password
			},
			message:'Password are not the same' 
		}
	},
	passwordChangedAt: Date,
	active:{
		type:Boolean,
		default: true,
		select: false
	}

}) 


userSchema.pre('save', async function(next){
	//ONLY RUN IF THE PASSWORD WAS ACTUALLY MODIFIED
	if(!this.isModified('password')) return next()
	
	//HASH THE PASSWORD WITH A COST OF 12
	this.password = await bcrypt.hash(this.password,12)	
	//DELETE THE PREVIOUS CONFIRMED PASSWORD
	this.confirmPassword = undefined

	next()
})


userSchema.pre('save', function(next){
	if(!this.isModified('password') || this.isNew) return next()

	this.passwordChangedAt = Date.now() - 1000
	next()
})


// use with deleting users
userSchema.pre(/^find/, function(next){
	// this points to the current query
	this.find({active: {$ne : false}})

	next()
})


//CREATING a METHOD FOR LOGIN THAN IS AVAILABLE TO ALL DOCUMENTS HENCE CAN BE CALLED WITH USE REQUIRE()
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
	return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter =  function(JWTTimeStamp){
	if(this.passwordChangedAt){
 		const changedTimeStamp =  parseInt(this.passwordChangedAt.getTime() /1000,10)
		console.log(changedTimeStamp, JWTTimeStamp)

		return JWTTimeStamp < changedTimeStamp
	}
	
	//FALSE MEANS NOT CHANGED
	return false
}

userSchema.methods.createPasswordResetToken = function(){
	const resetToken = crypto.randomBytes(32).toString('hex')

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000

	console.log({resetToken}, this.passwordResetToken)

	return resetToken

}






const User = mongoose.model('User',userSchema)

module.exports = User