const expect = require("chai").expect;
const request = require("supertest");

const app = require("../index");


const addTestEnvelope = () => {

  app.envelopes.push({ title: "Gas", budget: "2000" });
};
const removeEnv = () => {

  app.envelopes = app.envelopes.filter(env => env.title !== "Gas");
};

describe("envelope routes", function () {
  describe("GET ALL envelopes", function () {
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
      return request(app).get("/envelopes/Food").expect(404);
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

    it("is case insensitive", function () {
      return request(app)
        .get(`/envelopes/gas`)
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

  describe('POST envelope', function () {
    beforeEach(addTestEnvelope);
    afterEach(removeEnv);
    it(`Rejects an envelope if it is badly formed`, function () {
      return request(app)
      .post(`/envelopes`)
      .send({budget: 100})
      .expect(400);
    });

    it(`Rejects an envelope if the budget is negative`, function () {
      return request(app)
      .post(`/envelopes`)
      .send({title:'Food', budget: -100})
      .expect(400);
    });

    it('Rejects envelopes that already exist', function (){
      return request(app)
      .post('/envelopes')
      .send({title:'Gas', budget: 100})
      .expect(409);
    });

    it('Accepts a regular envelope', function (){
      return request(app).post('/envelopes').send({title: 'Food', budget: 10}).expect(201);
    })
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
    it(`Rejects an envelope if the budget is negative`, function () {
      return request(app)
      .put(`/envelopes/Food`)
      .send({title:'Food', budget: -100})
      .expect(400);
    });
  


    it('Updates envelopes when they already exist', function () {
      return request(app)
      .put('/envelopes/Gas')
      .send({title: 'Gas', budget: 10})
      .expect(204);
    })
  });

  describe('Integration tests', function () {
    it('Can GET an envelope after POST', function () {
      request(app).post('/envelopes').send({title: 'Food', budget: 10});
      return request(app)
        .get(`/envelopes/Food`)
        .expect(200)
        .then((response) => {
          const envelope = response.body;

          expect(envelope).to.be.an.instanceOf(Object);
          expect(envelope).to.have.ownProperty("title");
          expect(envelope).to.have.ownProperty("budget");
          expect(envelope.title).to.be.an.equal("Food");
        });
    })
  })
});
