'use strict';

module.exports = SSNDashFilter;

function SSNDashFilter() {
  return function(ssn, emptyValue, unmask) {
    if (!emptyValue) {
      emptyValue = 'N/A';
    }
    if(ssn && ssn.length === 9){
      if(unmask) {
        //== syntax
        //== when unmask is true, show original SSN (note that it might still be XXX-XX-1234, if the API only return masked SSN)
        ssn = ssn.substr(0,3) + '-' + ssn.substr(3,2) + '-' + ssn.substr(5,4);
      } else {
        //== otherwise show masked SSN
        ssn = 'XXX-XX-' + ssn.substr(5,4);
      }
    }
    else{
      ssn = emptyValue
    }
    return ssn;
  }
}
