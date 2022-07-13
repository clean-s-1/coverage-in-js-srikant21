const alerts = require('../typewise-alert');
const {expect} = require('chai');
const sinon = require('sinon');

describe('typewise alerts', function() {
  beforeEach(function() {
    if (null == this.sinon) {
      this.sinon = sinon.createSandbox();
    } else {
      this.sinon.restore();
    }
    this.sinon.stub(console, 'log');
  });

  it('infers a value lower than the minimum as TOO_LOW', () => {
    expect(alerts.inferBreach(20, 50, 100)).equals('TOO_LOW');
  });

  it('infers a value more than the maximum as TOO_HIGH ', () => {
    expect(alerts.inferBreach(110, 50, 100)).equals('TOO_HIGH');
  });

  it('infers a value more than the maximum as TOO_HIGH ', () => {
    expect(alerts.inferBreach(60, 50, 100)).equals('NORMAL');
  });

  it('classify temperature breach with PASSIVE COOLING type with value 0', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 0)).equals(
        'TOO_LOW',
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', -1)).equals(
        'TOO_LOW',
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 20)).equals(
        'NORMAL',
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 35', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 35)).equals(
        'TOO_HIGH',
    );
  });

  it('classify temperature breach with PASSIVE COOLING type with value 49', () => {
    expect(alerts.classifyTemperatureBreach('PASSIVE_COOLING', 40)).equals(
        'TOO_HIGH',
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', -1)).equals(
        'TOO_LOW',
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', 20)).equals(
        'NORMAL',
    );
  });

  it('classify temperature breach with HI ACTIVE COOLING type with value 50', () => {
    expect(alerts.classifyTemperatureBreach('HI_ACTIVE_COOLING', 50)).equals(
        'TOO_HIGH',
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value -1', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', -1)).equals(
        'TOO_LOW',
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value 20', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', 20)).equals(
        'NORMAL',
    );
  });

  it('classify temperature breach with MED ACTIVE COOLING type with value 41', () => {
    expect(alerts.classifyTemperatureBreach('MED_ACTIVE_COOLING', 41)).equals(
        'TOO_HIGH',
    );
  });

  it('call the sendToController function with breach type with value TOO_LOW', () => {
    const breachType = 'TOO_LOW';
    alerts.sendToController(breachType);
    expect( console.log.calledOnce ).to.be.true;
    expect( console.log.calledWith('65261, TOO_LOW') ).to.be.true;
  });

  it('call the sendToMail function with TOO_LOW', () => {
    const breachType = 'TOO_LOW';
    alerts.sendToEmail(breachType);
    expect( console.log.calledWith('To: a.b@c.com') ).to.be.true;
    expect( console.log.calledWith('Hi, the temperature is too low') ).to.be.true;
  });

  it('call the sendToMail function with TOO_HIGH', () => {
    const breachType = 'TOO_HIGH';
    alerts.sendToEmail(breachType);
    expect(console.log.calledWith('To: a.b@c.com') ).to.be.true;
    expect(console.log.calledWith('Hi, the temperature is too high')).to.be.true;
  });

  it('call the checkAndAlert function with TO_CONTROLLER', () => {
    const mockAlertTarget = 'TO_CONTROLLER';
    const mockTemperatureInc = 30;
    const mockBatteryChar = {
      coolingType: 'PASSIVE_COOLING',
    };
    alerts.checkAndAlert(mockAlertTarget, mockBatteryChar, mockTemperatureInc);
    expect( console.log.calledWith('65261, NORMAL') ).to.be.true;
  });

  it('call the checkAndAlert function with TO_EMAIL', () => {
    const mockAtype = 'TO_EMAIL';
    const mockTempInc2 = 50;
    const mockBatChar2 = {
      coolingType: 'HI_ACTIVE_COOLING',
    };
    const logMessage = 'To: a.b@c.com';
    const logMessage2 = 'Hi, the temperature is too high';
    alerts.checkAndAlert( mockAtype, mockBatChar2, mockTempInc2);
    expect( console.log.calledWith(logMessage) ).to.be.true;
    expect( console.log.calledWith(logMessage2)).to.be.true;
  });
});