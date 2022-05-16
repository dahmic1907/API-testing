import { assert, expect, use } from "chai";
import { describe, it } from "mocha";
import supertest from "supertest";
import User from "../Classes/user";

const request = supertest('auction-api-1.herokuapp.com/api/v1');
var user = new User();
user.generateRendomData()

var token = "", id, email, password, amount = 951;
var response;


describe('Smoke test', function () {

    it('Add new user', function (done) {
        request
            .post('/auth/register')
            .send({
                email: user.email(),
                firstName: user.firstName(),
                lastName: user.lastName(),
                password: user.password()
            })
            .set('Accept', 'application/json')
            .expect(function (res, err) {
                if (err) {
                    throw err;
                }
                response = res.body;
                
                id = response.id;
                
            })
            .expect(200, done);
    });

    it('New user logs in', function (done) {
        request
            .post('/auth/login?')
            .query({ email: user.email(), password: user.password() })
            .set('Accept', 'application/json')
            .expect(function (res, err) {
                if (err) {
                    throw err;
                }
                response = res.body;
                token = response.access_token;

                assert.equal(user.firstName(), response.credentials.firstName)
                assert.equal(user.lastName(), response.credentials.lastName)
                assert.equal(user.email(), response.credentials.email);

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
