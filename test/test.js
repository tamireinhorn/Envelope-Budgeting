const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");
let envelopes = app.envelopes;

const addTestEnvelope = () => {

  envelopes.push({ title: "Gas", budget: "2000" });
};
const removeEnv = () => {

  envelopes = envelopes.filter(env => env.title !== "Gas");
};

describe("envelope routes", function () {
  describe("GET envelopes", function () {
    beforeEach(addTestEnvelope);
    afterEach(removeEnv);
    it("returns an array", function () {
      return request(app)
        .get("/envelopes")
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an.instanceOf(Array);
        });
    });

    it("has length of one", function () {
      return request(app)
        .get("/envelopes")
        .expect(200)
        .then((response) => {
          expect(response.body).to.have.lengthOf(1)});
    });

    it("is the envelopes array", function () {
      return request(app)
        .get("/envelopes")
        .expect(200)
        .then((response) => expect(response.body).to.deep.equal(envelopes));
    });
  });


  describe("DELETE envelope", function () {
    beforeEach(addTestEnvelope);
    afterEach(removeEnv);
    it("does not delete envelopes that do not exist", function () {
      return request(app).delete("/envelopes/n").expect(404);
    });

    it("removes an envelope", function () {
      let initialEnvelopes;
      return request(app)
        .get("/envelopes")
        .then((response) => (initialEnvelopes = response.body))
        .then(() => request(app).delete("/envelopes/Gas").expect(204))
        .then(() => request(app).get("/envelopes"))
        .then((response) => response.body)
        .then((finalEnvelopes) => {
          expect(finalEnvelopes).to.not.be.deep.equal(initialEnvelopes);
          let deletedEnvelope = finalEnvelopes.find(
            (env) => env.title === "Gas"
          );
          expect(deletedEnvelope).to.be.undefined;
        });
    });
  });
  
  
  describe("GET specific envelope", function () {
    beforeEach(addTestEnvelope);
    afterEach(removeEnv);
    it("cannot find envelopes that are not there", function () {
      return request(app).get("/envelopes/200").expect(404);
    });

    it("returns an envelope if it exists", function () {
      return request(app)
        .get(`/envelopes/Gas`)
        .expect(200)
        .then((response) => {
          const envelope = response.body;

          expect(envelope).to.be.an.instanceOf(Object);
          expect(envelope).to.have.ownProperty("title");
          expect(envelope).to.have.ownProperty("budget");
          expect(envelope.title).to.be.an.equal("Gas");
        });
    });
  });

  describe('PUT envelope', function () {
    beforeEach(addTestEnvelope);
    afterEach(removeEnv);
    it(`Rejects an envelope if it is badly formed`, function () {
      return request(app)
      .put(`/envelopes/Food`)
      .send({budget: 100})
      .expect(400);
    });

    it('Creates an envelope if it is the first', function () {

      return request(app)
      .put('/envelopes/Food')
      .send({title: 'Food', budget: 100})
      .expect(201);
    });

    it('Updates envelopes when they already exist', function () {
      return request(app)
      .put('/envelopes/Gas')
      .send({title: 'Gas', budget: 10})
      .expect(200);
    })
  })
});
