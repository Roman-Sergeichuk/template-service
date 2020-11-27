import supertest from "supertest"
import { app } from './app.js'


const request = supertest()

describe('POST /render', function() {
    it('responds with json', function(done) {
      request(app)
        .post('/render')
        .send({
            "template": "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
            "substitutions": {"last_name": "Doe", "gender": "male"}
        })
        .set('application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });