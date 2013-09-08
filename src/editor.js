
function BodyPart (name) {
    this.name = type;
    this.modelUri = "";
}
 
BodyPart.prototype.getInfo = function() {
    return this.name + ' ' + this.modelUri ;
};


//model : container for parts (arms, torso, head, legs)
function Model (name, price, sizeCategory) {
  this.name = name;
  this.price = price;
  this.sizeCategory = sizeCategory;
  
  this.head = new BodyPart();
  this.torso = new BodyPart();
  this.leftArm = new BodyPart();
  this.rightArm = new BodyPart();
  this.leftLeg = new LeftLeg();
  this.rightLeg = new RightLeg();
}

Model.prototype.setPartModel = function(part, modelUri)
{
	
};
