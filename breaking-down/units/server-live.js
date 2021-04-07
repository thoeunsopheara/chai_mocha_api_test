
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { baseUrl } = require("../common");

chai.use(chaiHttp);


describe("Server is running", function(){
    it('Server is running', function(done){
        chai
        .request(baseUrl)
        .get("/")
        .end(function(err, res){
            expect(res).to.have.status(200);
            expect(res.rext).to.equal("Hurray! Its live.");
            done();
        });
    });
});