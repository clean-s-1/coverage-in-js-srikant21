
function inferBreach(value, lowerLimit, upperLimit) {
  if (value < lowerLimit) {
    return 'TOO_LOW';
  }
  if (value > upperLimit) {
    return 'TOO_HIGH';
  }
  return 'NORMAL';
}

function classifyTemperatureBreach(coolingType, temperatureInC) {
  let lowerLimit = 0;
  let upperLimit = getUpperLimit(coolingType);
  return inferBreach(temperatureInC, lowerLimit, upperLimit);
}

function getUpperLimit(coolingType){
  return {
    PASSIVE_COOLING: 35,
    HI_ACTIVE_COOLING: 45,
    MED_ACTIVE_COOLING: 40
  }[coolingType];
}

function checkAndAlert(alertTarget, batteryChar, temperatureInC) {
  const breachType = classifyTemperatureBreach(batteryChar['coolingType'], temperatureInC);
  if (alertTarget == 'TO_CONTROLLER') {
    sendToController(breachType);
  } else if (alertTarget == 'TO_EMAIL') {
    sendToEmail(breachType);
  }
}

function sendToController(breachType) {
  const header = 0xfeed;
  console.log(`${header}, ${breachType}`);
}

function sendToEmail(breachType) {
  const recepient = 'a.b@c.com';
  if (breachType == 'TOO_LOW') {
    showConsoleMessage(recepient,'low');
  } else if (breachType == 'TOO_HIGH') {
    showConsoleMessage(recepient,'high');
  }
}

function showConsoleMessage(recepient,tempMode){
  console.log(`To: ${recepient}`);
  console.log(`Hi, the temperature is too ${tempMode}`);
}

module.exports =
    {inferBreach, classifyTemperatureBreach, checkAndAlert, sendToController, sendToEmail};
