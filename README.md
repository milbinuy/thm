# API

## GET balance

    get('/balance', async function(req, res, next)

###### Description 
- Get balance and transaction

###### Parameters 
- userId - id of user

###### What the function returns
- User info and transaction history

## POST debit

    post('/debit', async function(req, res, next)

###### Description 
- Perform debit transaction

###### Parameters 
- userId - id of user
- amount - amount of debit

###### What the function returns
- Status code and transaction result

## POST credit

    post('/credit', async function(req, res, next)

###### Description 
- Perform credit transaction

###### Parameters 
- userId - id of user
- amount - amount of credit

###### What the function returns
- Status code and transaction result
