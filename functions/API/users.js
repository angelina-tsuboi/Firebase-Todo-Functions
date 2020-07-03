const { admin, db } = require('../util/admin');
const config = require('../util/config');

const firebase = require('firebase');

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require('../util/validators');

// Login
exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if(!valid){
        return response.status(400).json(errors);
    }

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((token) => {
        return response.json({ token });
    })
    .catch((err) => {
        console.error(err);
        return response.status(403).json({general: 'wrong credentials, please try again'});
    })
}

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        country: request.body.country,
		password: request.body.password,
		confirmPassword: request.body.confirmPassword,
		username: request.body.username
    }

    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    let token, userId;
    db.doc(`/users/${newUser.username}`)
    .get().then((doc) => {
        if(doc.exists){ //checking if user already exsisst
            return response.status(400).json({ username: 'this username is already taken' });
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((userIdToken) => {
        token = userIdToken;
        const userCreds = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            country: newUser.country,
            username: newUser.username,
            createdAt: new Date().toISOString(),
            userId
        }
        return db.doc(`/users/${newUser.username}`).set(userCreds);//sets the data of the new user in the db
    })
    .then(()=> {
        return response.status(201).json({ token });
    })
    .catch((err) => {
        console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return response.status(400).json({ email: 'Email already in use' });
			} else {
				return response.status(500).json({ general: 'Something went wrong, please try again' });
			}
    })
}