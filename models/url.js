var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var urlSchema = new Schema ({
  originalUrl: {
    type: String,
    unique: false
  },
  uniqueNumber: {
    type: Number,
    unique: true
  }
})
urlSchema.pre('save', function(next) {
  console.log('before save')
  next()
})
urlSchema.post('save', function(next) {
  console.log('after save')

})


var Url = mongoose.model('Url', urlSchema);



module.exports = Url;
