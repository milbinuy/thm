# API

## GET balance

    /balance

###### Description 
- Get balance and transaction

###### Query Parameters 
- userId - id of user

###### What the function returns
- User info and transaction history

## POST debit

    /debit

###### Description 
- Perform debit transaction

###### Request Body 
- userId - id of user
- amount - amount of debit

###### What the function returns
- Status code and transaction result

## POST credit

    /credit

###### Description 
- Perform credit transaction

###### Request Body 
- userId - id of user
- amount - amount of credit

###### What the function returns
- Status code and transaction result
