import supertest from "supertest";
import { app } from "./app.js";

const request = supertest;

describe("POST /render", function () {
  it("should parse if-else statement", function (done) {
    request(app)
      .post("/render")
      .send({
        template:
          "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
        substitutions: { last_name: "Doe", gender: "male" },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({ result: "Hello Mr. Doe" })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should parse for loop", function (done) {
    request(app)
      .post("/render")
      .send({
        template: "<? for (let i = 0; i < 5; i++) { ?> Test <? + i } ?>",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({ result: " Test 0,  Test 1,  Test 2,  Test 3,  Test 4" })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should parse iteration + conditions + substitutions", function (done) {
    request(app)
      .post("/render")
      .send({
        template:
          "<? for (let i = 0; i < 5; i++) { ?> line - <? + i } ?> Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
        substitutions: { last_name: "Doe", gender: "male" },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({
        result:
          " line - 0,  line - 1,  line - 2,  line - 3,  line - 4 Hello Mr. Doe",
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should parse substitutions + array iteration", function (done) {
    request(app)
      .post("/render")
      .send({
        template:
          "Hi I'm <?= name ?>. I'm <?= age ?>. My languages: <? for (let i = 0; i < languages.length; i++) { languages[i] } ?>",
        substitutions: {
          name: "Roman",
          age: "34",
          languages: ["russian", "english"],
        },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({
        result: "Hi I'm Roman. I'm 34. My languages: russian, english",
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should send error message if no template", function (done) {
    request(app)
      .post("/render")
      .send({
        substitutions: {
          name: "Roman",
          age: "34",
          languages: ["russian", "english"],
        },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({ erorrMessage: "template is required" })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
  it("should send parsing error if substitution skipped", function (done) {
    request(app)
      .post("/render")
      .send({
        template:
          "Hello <? if (gender === 'male') { ?>Mr.<? } else { ?>Mrs.<? } ?> <?= last_name ?>",
        substitutions: { last_name: "Doe" },
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect({
        erorrMessage: "An error occurred while parsing the template",
        detail: "gender is not defined",
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
