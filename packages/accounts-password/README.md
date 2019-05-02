# accounts-password-doichain
[Source code of released version](https://github.com/inspiraluna/meteor/tree/master/packages/accounts-password) | [Source code of development version](https://github.com/meteor/meteor/tree/devel/packages/accounts-password)
***

## Description
remove accounts-password and instead add this package and your account creation emails 
will be routed over the Doichain blockchain. This module needs a running Doichain Node & Doichain dApp in order work correctly.

Usage:
1. create a meteor project ```meteor create my-doichain-project; cd my-doichain-project```
2. Execute ```meteor add accounts-ui doichain:accounts-password-doichain```
3. Run project ```meteor```
4. Add ``{{> loginButtons}}`` to your template.

A login service that enables secure password-based login and requests the verification email or enrollment email (Double-Opt-In) over Doichain blockchain.  
See the [project page](https://www.meteor.com/accounts) on Meteor Accounts for more details.
