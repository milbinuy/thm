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
    res.send('Error: userid is required');
  }

  if (!amount) {
    res.status(400);
    res.send('Error: amount is required');
  }

  if (amount<=0) {
    res.status(400);
    res.send('Error: amount cannot be negative');
  }

  // Validate user
  const userRef = db.collection('thm-users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    res.status(400);
    res.send('Error: userid not found');
  }

  // Debit transaction
  await userRef.update({balance: doc.data().balance + amount});

  const transRef = db.collection('thm-transactions');

  var m = new Date();
  var dateString =
    m.getUTCFullYear() + "/" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
    ("0" + m.getUTCDate()).slice(-2) + " " +
    ("0" + m.getUTCHours()).slice(-2) + ":" +
    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    ("0" + m.getUTCSeconds()).slice(-2);

  await transRef.add({
    action: "debit",
    createdAt: dateString,
    amount,
    userId
  })

  res.status(200);
  res.send('Debit transaction successful');
});

/*  POST Credit Transaction  */
router.post('/credit', async function(req, res, next) {
    const userId = req.body.userId;
    const amount = req.body.amount;
    
    // Validate param
    if (!userId) {
      res.status(400);
      res.send('Error: userid is required');
    }
  
    if (!amount) {
      res.status(400);
      res.send('Error: amount is required');
    }
  
    if (amount<=0) {
      res.status(400);
      res.send('Error: amount cannot be negative');
    }
  
    // Validate user
    const userRef = db.collection('thm-users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      res.status(400);
      res.send('Error: userid not found');
    }

    // Credit transaction
    if (doc.data().balance < amount) {
      res.status(400);
      res.send('Credit transaction failed: Insufficient balance');
    }

    else {
      await userRef.update({balance: doc.data().balance - amount});

      const transRef = db.collection('thm-transactions');

      var m = new Date();
      var dateString =
        m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);

      await transRef.add({
        action: "credit",
        createdAt: dateString,
        amount,
        userId
      })

      res.status(200);
      res.send('Credit transaction successful');
    }
  });

module.exports = router;