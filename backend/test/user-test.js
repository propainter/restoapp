process.env.NODE_ENV = 'test';


const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {usersCred, places} = require('./testData');
chai.use(chaiHttp);

// const app = 'http://localhost:5000';





const createUsersUtil = (app, user) => {
    chai.request(app)
    .post('/api/users/signup')
    .type('form')
    .field('email', user.email)
    .field('password', user.password)
    .field('name', user.name)
    .field('role', user.role)
    .attach('image', user.image[0],user.image[1])
    .then(res => {
      console.log(res.status)
      if(res.status === 200 || res.status === 201){
        expect(res.body.token.length).to.be.greaterThan(0);
      }else{
        // deleteItem(app, true, false);
      }
    });
  }

const createUsers = (app) => {
  for (const [key, value] of Object.entries(usersCred)) {
    console.log(key, value);
    createUsersUtil(app, value);
  }
}

const deleteItem = (app, deleteUsers=false, deletePlaces=false) => {
    var agent = chai.request.agent(app)
    agent.post('/api/users/login')
    .set('Content-Type', 'application/json')
    .send({email: usersCred.admin.email, password: usersCred.admin.password})
    .then(res => {
      // res.should.have.statusCode(200);
      let loggedInUser = res.body;
      
    //   const deleteUsers = false;
      deleteUsers && agent.get('/api/users')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .then(res => {
        // console.log(res.body);
        usersList = res.body.users;
        usersList && usersList.length > 0 && usersList.map( item => {
          item.email !== 'admin@gmail.com' &&
          agent.delete('/api/users/'+item.id)
          .set('Authorization', 'Bearer ' + loggedInUser.token)
          .then(res => {
            console.log(res.body);
          })
        })
      });
    
    //   const deletePlaces = false;
      deletePlaces && agent.get('/api/places')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .then(res => {
        // console.log(res.body.places);
        placesList = res.body.places;
        placesList && placesList.length > 0 && placesList.map( item => {
          agent.delete('/api/places/'+item.id)
          .set('Authorization', 'Bearer ' + loggedInUser.token)
          .then(res => {
            console.log(res.body);
          })
        })
      });
    
    });
}



module.exports = {
    createUsers
}