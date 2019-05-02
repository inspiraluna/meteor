/// BCRYPT

import {Meteor} from "meteor/meteor";
import { HTTP } from 'meteor/http'
import { getSettings} from "meteor/doichain:settings";

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.config({sendVerificationEmail: true , forbidClientAccountCreation:false});

  _.extend(Accounts,{
    sendVerificationEmail: function(userId, email, extraTokenData){

      const {email: realEmail, user, token} = Accounts.generateVerificationToken(userId, email, extraTokenData);
      const url = Accounts.urls.verifyEmail(token);
      const options = Accounts.generateOptionsForEmail(realEmail, user, url, 'verifyEmail');
      //Email.send(options);
      console.log('now requesting email permission');
      //TODO - set request doi template and redirect param from accounts-password
      //TODO parse form data and store it inside dapp (use old feature of florian)
      requestDOI(options.to,options.to,null,true);

      return {email: realEmail, user, token, url, options};
    },
    sendEnrollmentEmail: function(userId, email, extraTokenData){

      const {email: realEmail, user, token} = Accounts.generateResetToken(userId, email, 'enrollAccount', extraTokenData);
      const url = Accounts.urls.enrollAccount(token);
      const options = Accounts.generateOptionsForEmail(realEmail, user, url, 'enrollAccount')

      console.log('sendEnrollmentEmail over Doichain requested.');
      requestDOI(options.to,options.to,null,true);
      return {email: realEmail, user, token, url, options};
    }
  });

});
function requestDOI(recipient_mail, sender_mail, data,  log) {
  const syncFunc = Meteor.wrapAsync(request_DOI);
  return syncFunc(recipient_mail, sender_mail, data,  log);
}

function request_DOI(recipient_mail, sender_mail, data,  log, callback) {

  const dappUrl = getUrl(); //TODO this is default - alternatively get it from settings.json - alternatively get it from db
  //check if userId and Token is already in settings
  let dAppLogin = getSettings('dAppLogin');
  if(dAppLogin===undefined){ //if not in settings
    //get dApp username and password from settings and request a userId and token
    const dAppUsername = getSettings('dAppUsername','admin');
    const dAppPassword = getSettings('dAppPassword','password');
    const paramsLogin = {
      "username": dAppUsername,
      "password":dAppPassword
    };

    const urlLogin = dappUrl+'/api/v1/login';
    const headersLogin = [{'Content-Type':'application/json'}];

    const realDataLogin= { params: paramsLogin, headers: headersLogin };
    const resultLogin = HTTP.post(urlLogin, realDataLogin);
    //console.log("resultLogin",resultLogin)
    if(resultLogin===undefined ||
        resultLogin.data == undefined ||
        resultLogin.data.data == undefined){
    } throw "login to Doichain dApp failed: "+dappUrl+" please check credentials"+paramsLogin;
    dAppLogin = getSettings('dAppLogin',resultLogin.data.data);
  }

  console.log('sendVerificationEmail over Doichain requested.',dAppLogin);

  const urlOptIn = dappUrl+'/api/v1/opt-in';
  let dataOptIn = {};

  if(data){
    dataOptIn = {
      "recipient_mail":recipient_mail,
      "sender_mail":sender_mail,
      "data":JSON.stringify(data)
    }
  }else{
    dataOptIn = {
      "recipient_mail":recipient_mail,
      "sender_mail":sender_mail
    }
  }

  const headersOptIn = {
    'Content-Type':'application/json',
    'X-User-Id':dAppLogin.userId,
    'X-Auth-Token':dAppLogin.authToken
  };

  try{
    const realDataOptIn = { data: dataOptIn, headers: headersOptIn};
    console.log(urlOptIn);
    console.log(dataOptIn);
    const resultOptIn = HTTP.post(urlOptIn, realDataOptIn);
    if(resultOptIn===undefined ||
        resultOptIn.data == undefined ||
        resultOptIn.data.data == undefined){
    } throw "login to Doichain dApp failed: "+dappUrl+" please check credentials"+paramsLogin;
    console.log("RETURNED VALUES: ",resultOptIn);
    callback(null,resultOptIn.data);
  }
  catch(e){
    callback(e,null);
  }
}

/**
 * Returns URL of local dApp to connect to for sending out DOI-requests
 * @returns String
 */
function getUrl() {
  let ssl = getSettings('app.ssl',false); //default true!
  let port = getSettings('app.port',3000);
  let host = getSettings('app.host','localhost');
  let protocol = "https://";
  if(!ssl) protocol = "http://";

  if(host!==undefined) return protocol+host+":"+port+"/";
  return Meteor.absoluteUrl();
}