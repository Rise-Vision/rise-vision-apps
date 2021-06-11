import {expect} from 'chai';
import { CardDescriptionPipe } from './card-description.pipe';

describe('CardDescriptionPipe', () => {
  const cardDescription = new CardDescriptionPipe();
  
  it("should exist",function(){
    expect(cardDescription).to.be.ok;
    expect(cardDescription.transform).to.be.a('function');
  });

  it("should deal with null values", function() {
    expect(cardDescription.transform()).to.equal("");
  });

  it("should deal with empty values", function() {
    expect(cardDescription.transform({})).to.equal("Credit Card ending in ****");
  });

  it("should deal with card brand", function() {
    expect(cardDescription.transform({
      brand: 'visa'
    })).to.equal("Visa ending in ****");
  });

  it("should deal with snake_case card brand", function() {
    expect(cardDescription.transform({
      brand: 'american_express'
    })).to.equal("American Express ending in ****");
  });

  it("should deal with last4", function() {
    expect(cardDescription.transform({
      last4: '4242'
    })).to.equal("Credit Card ending in 4242");
  });
});
