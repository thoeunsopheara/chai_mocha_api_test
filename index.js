const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
const baseUrl = "http://localhost:3200";

chai.use(chaiHttp);

/** This is for test server is live or not */
describe("Test Server is running or not", function () {
  it("Server is live", function (done) {
    chai
      .request(baseUrl)
      .get("/")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Hurray! Its live.");
        done();
      });
  });
});

/** The following is test order crud operation */
describe("Test order operation", function () {
  let token;
  let id = 0;
  const order = {
    name: "Sandine (Milo)",
    customer_email: "oyetoketoby80@gmail.com",
    customer_name: "Oyetoke Toby",
    quantity: 5,
    customer_address: "Aboru, Lagos",
  };

  it("request a token", function (done) {
    chai
      .request(baseUrl)
      .post("/request-token")
      .end(function (err, res) {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("token");
        token = res.body.token;
        done();
      });
  });

  it("create an order", function (done) {
    chai
      .request(baseUrl)
      .post("/new_order")
      .set("Authorization", `Basic ${token}`)
      .send(order)
      .end(function (err, res) {
        expect(res.body).to.have.property("data");
        expect(res.body.message).to.equal("Order created successfully");
        id = res.body.data._id;
        done();
      });
  });

  it("get one order", function (done) {
    chai
      .request(baseUrl)
      .get(`/orders/${id}`)
      .set("Authorization", `Basic ${token}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id");
        expect(res.body._id).to.equal(id);
        done();
      });
  });

  it("get all orders", function (done) {
    chai
      .request(baseUrl)
      .get("/orders")
      .set("Authorization", `Basic ${token}`)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        const order = res.body.find((o) => o._id == id);
        expect(order).to.be.an("object");
        expect(order).to.have.property("_id");
        done();
      });
  });

  it("update an order", function (done) {
    const updateOrderBody = {
      name: "Sandine (Milo)",
      customer_email: "oyetoketoby80@gmail.com",
      customer_name: "Oyetoke ",
      quantity: 5,
      customer_address: "Aboru, Lagos",
      status: "pending",
    };
    chai
      .request(baseUrl)
      .put(`/orders/${id}`)
      .set("Authorization", `Basic ${token}`)
      .send(updateOrderBody)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("data");
        expect(res.body.message).to.equal("Updated Succesfully");
        expect(res.body.data.status).to.equal(updateOrderBody.status);
        done();
      });
  });

  it("delete an order", function (done) {
    chai
      .request(baseUrl)
      .delete("/orders/" + id)
      .set("Authorization", "Basic " + token)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Deleted Succesfully");
        chai
          .request(baseUrl)
          .get("/orders/" + id)
          .set("Authorization", "Basic " + token)
          .end(function (err, res) {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("Order not found");
            done();
          });
      });
  });
});
