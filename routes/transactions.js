const admin = require('firebase-admin');
const db = admin.firestore();

var express = require('express');
var router = express.Router();

/*  POST Debit Transaction  */
router.post('/debit', async function(req, res, next) {
  const userId = req.body.userId;
  const amount = req.body.amount;
  
  // Validate param
  if (!userId) {
    res.status(400);
    res.send('{"statusCode": 400, "result":"userid is required"}');
  }

  if (!amount) {
    res.status(400);
    res.send('{"statusCode": 400, "result":"amount is required"}');
  }

  if (amount<=0) {
    res.status(400);
    res.send('{"statusCode": 400, "result":"amount cannot be negative"}');
  }

  // Validate user
  const userRef = db.collection('thm-users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    res.status(400);
    res.send('{"statusCode": 400, "result":"userid not found"}');
  }

  // Debit transaction
  await userRef.update({balance: doc.data().balance + amount});

  const transRef = db.collection('thm-transactions');

  await transRef.add({
    action: "debit",
    amount,
    createdAt: Date.now(),
    userId
  })

  res.status(200);
  res.send('{"statusCode": 200, "result":"debit transaction successful"}');
});

/*  POST Credit Transaction  */
router.post('/credit', async function(req, res, next) {
    const userId = req.body.userId;
    const amount = req.body.amount;
    
    // Validate param
    if (!userId) {
      res.status(400);
      res.send('{"statusCode": 400, "result":"userid is required"}');
    }
  
    if (!amount) {
      res.status(400);
      res.send('{"statusCode": 400, "result":"amount is required"}');
    }
  
    if (amount<=0) {
      res.status(400);
      res.send('{"statusCode": 400, "result":"amount cannot be negative"}');
    }
  
    // Validate user
    const userRef = db.collection('thm-users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      res.status(400);
      res.send('{"statusCode": 400, "result":"userid not found"}');
    }

    // Credit transaction
    if (doc.data().balance < amount) {
      res.status(400);
      res.send('{"statusCode": 400, "result":"credit transaction failed insufficient balance"}');
    }
    else {
      await userRef.update({balance: doc.data().balance - amount});

      const transRef = db.collection('thm-transactions');

      await transRef.add({
        action: "credit",
        amount,
        createdAt: Date.now(),
        userId
      })

      res.status(200);
      res.send('{"statusCode": 200, "result":"credit transaction successful"}');
    }
  });

module.exports = router;