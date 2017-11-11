import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  email: string,
  password: string,
  userName: string,

  profile: {
    name: string
  },

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
  gravatar: (size: number) => string
};

const userSchema = new mongoose.Schema({
  email: String,
  usernaNme: { type: String, unique: true },
  password: String,

  profile: {
    name: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
 userSchema.pre('save', function saveHook(next) {
   const user = this;

   // proceed further only if the password is modified or the user is new
   if (!user.isModified('password')) return next();

   return bcrypt.genSalt((saltError, salt) => {
     if (saltError) {
       return next(saltError);
     }

     return bcrypt.hash(user.password, salt, (hashError, hash) => {
       if (hashError) {
         return next(hashError);
       }

       // replace a password string with hash value
       user.password = hash;
       return next();
   });
 });
});

userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
