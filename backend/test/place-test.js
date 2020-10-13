const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const {usersCred, places} = require('./testData');


const createPlaceUtil = (app, user, place) => {
    var agent = chai.request.agent(app)
    agent.post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send({email: user.email, password: user.password})
    .then(res => {
        // res.should.have.statusCode(200);
    
        let loggedInUser = res.body;
        agent
        // .get('/api/places/user/' + loggedInUser.userId)
        .get('/api/places/')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .set('Content-Type', 'application/json')
        .then( res => { 
            const placesAlreadyPresent = res.body.places.filter(item => item.title === place.title);
            placesAlreadyPresent.length == 0 && agent
            .post('/api/places')
            .set('Authorization', 'Bearer ' + loggedInUser.token)
            .type('form')
            .field('title', place.title)
            .field('description', place.description)
            .field('address', place.address)
            .attach('image', place.image[0], place.image[1])
            .then(res => {
                console.log(res.body)

            })
        });

    });
}

const createPlace = (app) => {
    places.userone.forEach(place => {setTimeout(function(){ createPlaceUtil(app, usersCred.ownerone, place); }, 3000);})
    places.usertwo.forEach(place => {setTimeout(function(){ createPlaceUtil(app, usersCred.ownertwo, place); }, 3000);})
}

module.exports = {
    createPlace
}