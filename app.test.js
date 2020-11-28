import supertest from "supertest"
import { app } from './app.js'


const request = supertest;

describe('POST /render', function() {
    it('Hello Mr. Doe', function(done) {
      request(app)
      .post('/render')
        .send({
            "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
            "substitutions": {"last_name": "Doe", "gender": "male"}
        })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({"result":"Hello Mr. Doe"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  

  describe('POST /render', function() {
    it('Iteration', function(done) {
      request(app)
      .post('/render')
        .send({
          "template": "<? for (let i = 0; i < 5; i++) { ?> Gleb <? + i } ?>"
      })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({"result": ' Gleb 0,  Gleb 1,  Gleb 2,  Gleb 3,  Gleb 4'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('POST /render', function() {
    it('Iteration + conditions + substitutions', function(done) {
      request(app)
      .post('/render')
        .send({
          "template": "<? for (let i = 0; i < 5; i++) { ?> line - <? + i } ?> Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
          "substitutions": {"last_name": "Doe", "gender": "male"}
      })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({"result":" line - 0,  line - 1,  line - 2,  line - 3,  line - 4 Hello Mr. Doe"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });


  describe('POST /render', function() {
    it('Substitutions + array iteration', function(done) {
      request(app)
      .post('/render')
        .send({
          "template": "Hi I'm <?= name ?>. I'm <?= age ?>. My languages: <? for (let i = 0; i < languages.length; i++) { languages[i] } ?>",
          "substitutions": {"name": "Roman", "age": "34", "languages": ["russian", "english"]}
      })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({"result":"Hi I'm Roman. I'm 34. My languages: russian, english"})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  }); 


  describe('POST /render', function() {
    it('No template', function(done) {
      request(app)
      .post('/render')
        .send({
          "substitutions": {"name": "Roman", "age": "34", "languages": ["russian", "english"]}
      })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({"erorrMessage":"template is required"})
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  }); 

  describe('POST /render', function() {
    it('Parsing error', function(done) {
      request(app)
      .post('/render')
        .send({
            "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
            "substitutions": {"last_name": "Doe"}
        })
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .expect({
          "erorrMessage": "An error occurred while parsing the template",
          "detail": "gender is not defined"
      })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

// var app = express();
 
// app.get("/", function (request, response){
     
//     response.send("Hello Test");
// });
 
// app.listen(3000);
 



// const request = supertest;
 
// // var app = require("./app").app;
 
// it("should return Hello Test", function(done){
     
//     request(app)
//         .get("/")
//         .expect("Hello Test")
//         .end(done);
// });


