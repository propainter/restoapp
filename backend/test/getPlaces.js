process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const {usersCred, places} = require('./testData');
chai.use(chaiHttp);


const conn = require('../models/Db');

describe('GET /notes', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err));
  })

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err));
  })

  it('OK, getting notes has no notes', () => {
    var agent = chai.request.agent(app)
    const user = usersCred.ownerone;
    agent.post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send({email: user.email, password: user.password})
    .then(res => {
        let loggedInUser = res.body;
        // console.log(loggedInUser);
        agent
        .get('/api/places/')
        .set('Authorization', 'Bearer ' + loggedInUser.token)
        .set('Content-Type', 'application/json')
        .then( res => {
            // console.log(res.body);
            // expect(res.body.length, 1)
            places.forEach(place => {
                const placesAlreadyPresent = res.body.places.filter(item => item.title === place.title);
                if(res.body.places.length == 0 || placesAlreadyPresent.length == 0){
                    agent
                    .post('/api/places/')
                    .set('Authorization', 'Bearer ' + loggedInUser.token)
                    .type('form')
                    .field('title', place.title)
                    .field('description', place.description)
                    .field('address', place.address)
                    .attach('image', place.image[0], place.image[1])
                    .then(res => {
                        console.log("lola", res.body);
                        // expect(res.body.length, 1)
                    }).catch(err => console.log(err))
                }
            });
            
        });

    });
  });  
});



describe('GET /places', () => {
    before((done) => {
      conn.connect()
        .then(() => done())
        .catch((err) => done(err));
    })
  
    after((done) => {
      conn.close()
        .then(() => done())
        .catch((err) => done(err));
    })

    it('OK, getting places', () => {
        chai.request(app).get('/api/places')
        // .set('Authorization', 'Bearer ' + loggedInUser.token)
        .set('Content-Type', 'application/json')
        .then(res => {
            console.log(res.body);
        })
    });

});
