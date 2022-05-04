import { assert, expect } from "chai";
import { describe, it } from "mocha";
import supertest from "supertest";

const request = supertest('auction-api-1.herokuapp.com/api/v1');


var token = "", id, email, password, amount = 901;
var response;


describe('Smoke test', function () {

    it('Add new user', function (done) {
        request
            .post('/auth/register')
            .send({
                email: "user.user12b@gmail.com",
                firstName: "New",
                lastName: "User",
                password: 'user12345'
            })
            .set('Accept', 'application/json')
            .expect(function (res, err) {
                if (err) {
                    throw err;
                }
                response = res.body;
                id = response.id;
                email = response.email;
                password = response.password;
            })
            .expect(200, done);
    });

    it('New user logs in', function (done) {
        request
            .post('/auth/login?')
            .query({ email: email, password: 'user12345' })
            .set('Accept', 'application/json')
            .expect(function (res, err) {
                if (err) {
                    throw err;
                }
                response = res.body;
                token = response.access_token;

                assert.equal("New", response.credentials.firstName)
                assert.equal("User", response.credentials.lastName)
                assert.equal(email, response.credentials.email);

            })
            .expect(200, done);
    });

    it('Get refreshed token for user', () => {
        request
            .get('/auth/token/refresh')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                if (err) throw err;
                response = res.body;
                token = response.access_token;
            })
            .expect(200);
    });

    it('Validate token for logged user', () => {
        request
            .get('/auth/token/validate')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
                if (err) throw err;
                response = res.body;
                token = response.access_token;
            })
            .expect(200);
    });

    it('New user places bid for product with id = 2', function (done) {
        request
            .post('/bid')
            .set('Authorization', 'Bearer ' + token)
            .send({
                "product": {
                    "id": 2
                },
                "user": {
                    "id": id
                },
                "amount": ++amount
            })
            .set('Accept', 'application/json')
            .expect(function (res, err) {
                if (err) {
                    throw err;
                }
                response = res.body;

                assert.equal(2, response.product.id);
                assert.equal(id, response.user.id);
                assert.equal(amount, response.amount);
            })
            .expect(200, done);
    });
 
});