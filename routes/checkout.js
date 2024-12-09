// checkout.js continued
const express = require("express");
const braintree = require("braintree");
const dotenv = require("dotenv").config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

const router = express.Router();

router.get("/", (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.send(response.clientToken);
  });
});

router.post("/", (req, res) => {
  const { paymentMethodNonce, deviceData, amount, merchantAccountId } =
    req.body;
  gateway.transaction.sale(
    {
      deviceData: deviceData,
      paymentMethodNonce: paymentMethodNonce,
      amount: amount,
      merchantAccountId: merchantAccountId,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
        console.log(error);
      }
    }
  );
});

module.exports = router;
