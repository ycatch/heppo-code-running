Blockly.JavaScript['is_ball'] = function(block) {
  var code = '_self.isBall()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['is_wall'] = function(block) {
  var code = '_self.isWall()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.JavaScript['jump_forward'] = function(block) {
  var code = '_self.jumpFoward();\n';
  return code;
};
Blockly.JavaScript['run_foward'] = function(block) {
  var code = '_self.runFoward(7);\n';
  return code;
};
