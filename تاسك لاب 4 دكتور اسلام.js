"use strict";

let blindSignatures = require('blind-signatures');

let SpyAgency = require('./spyAgency.js').SpyAgency;

function makeDocument(coverName) {
  return `The bearer of this signed document, ${coverName}, has full diplomatic immunity.`;
}

function blind(msg, n, e) {
  
  return blindSignatures.blind({
    message: msg,
    N: agency.n,
    E: agency.e,
  });
}

function unblind(blindingFactor, sig, n) {
  return blindSignatures.unblind({
    signed: sig,
    N: n,
    r: blindingFactor,
  });
}


let agency = new SpyAgency();
let coverNames = ["Agent X", "Agent Y", "Agent Z", "Agent A", "Agent B", "Agent C", "Agent D", "Agent E", "Agent F", "Agent G"];
let documents = coverNames.map(makeDocument);
let blindDocs = [];
let blindingFactors = [];

documents.forEach((doc, index) => {
  let { blinded, r } = blind(doc, agency.n, agency.e);
  blindDocs.push(blinded);
  blindingFactors.push(r);



agency.signDocument(blindDocs, (selected, verifyAndSign) => {
  let blindedFactorsForVerification = blindingFactors.map((bf, i) => (i === selected ? undefined : bf));
  
  let originalDocsForVerification = documents.map((doc, i) => (i === selected ? undefined : doc));
  
  let blindedSignature = verifyAndSign(blindedFactorsForVerification, originalDocsForVerification);
  
  let signature = unblind(blindingFactors[selected], blindedSignature, agency.n);\
  
  let isValid = blindSignatures.verify({
    
    unblinded: signature,
    N: agency.n,
    E: agency.e,
    message: documents[selected],
  });

  console.log(Signature valid for selected document: ${isValid});
});

  
