const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");
let envelopes = app.envelopes;

const addTestEnvelope = () => {
  console.log("Before called");
  envelopes.push({ title: "Gas", budget: "2000" });
};
const removeEnv = () => {
  console.log("After called");
  envelopes.splice(0, 1);
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
        .then((response) => expect(response.body).to.deep.equal(app.envelopes));
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
});
