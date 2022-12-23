const expect = require('chai').expect;
const request = require('supertest');

const app = require('../index');

describe('envelope routes', function() {

    describe('GET envelope', function() {


        it('returns an array', function () {
            return request(app)
                .get('/envelopes')
                .expect(200)
                .then((response) => {expect(response.body).to.be.an.instanceOf(Array)});
        });

    });

    describe('PUT envelope', function() {
        
    })



});