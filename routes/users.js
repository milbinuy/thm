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

  res.send('NAME: ' + JSON.stringify(doc.data().name) + '<br><br> TRANSACTION HISTORY<br><br>' + formatJSON(transactions));
});

// loop to get all transactions
function formatJSON(jsonDoc) {
  const doc = jsonDoc;
  const docLength = jsonDoc.length;
  let transactionDisplay = '';

  for (i=0;i<docLength;i++) {
    transactionDisplay += 'ACTION: ' + JSON.stringify(doc[i].action) + '<br>AMOUNT: ' + JSON.stringify(doc[i].amount) + '<br>DATE: ' + JSON.stringify(doc[i].createdAt) + '<br><br>';
  }

  return transactionDisplay;
}

function custom_sort(a, b) {
  return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
}

module.exports = router;