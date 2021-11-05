const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// salt를 이용해서 비밀번호 암호화, saltRounds는 몇자리 수인지 설정
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 100
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
// user 정보를 저장하기 전(pre)에 어떠한 행동을 할 수 있게 만듦
userSchema.pre('save', function( next ){
    // 바로 위의 schma user 정보를 나타냄
    var user = this;
    // 비밀번호를 암호화 시킨다. 혹은 비밀번호가 바뀌었을 때만 암호화시킨다
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            // hash는 암호화된 비밀번호를 나타냄
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        });
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword => 암호화 X 비밀번호 랑 암호화된 비밀번호랑 비교해야 함
    // 어떻게? -> plainPassword를 암호화를 한 다음 비교를 해야함 (암호화된 것을 복구할 수 없기 때믄)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
            cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
const User = mongoose.model('User', userSchema)

module.exports = { User }