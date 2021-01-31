const admin = require('firebase-admin');
const db = admin.firestore();

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/balance', async function(req, res, next) {
  const userid = req.query.userid;
  
  if (!userid) {
    res.status(400);
    res.send('Error: userid is required');
  }

  const userref = db.collection('thm-users').doc(userid);
  const doc = await userref.get();

  if (!doc.exists) {
    res.status(400);
    res.send('Error: userid not found');
  }

  const transref = db.collection('thm-transactions');
  let transactions = [];
  const transdoc = await (await transref.where('userId', '==', userid).get()).forEach(t => transactions.push(t.data()));

  res.send('{"name":' + JSON.stringify(doc.data().name) + ', "balance":' + JSON.stringify(doc.data().balance) + ', "transactionHistory":'+ JSON.stringify(transactions) + '}');
});

module.exports = router;