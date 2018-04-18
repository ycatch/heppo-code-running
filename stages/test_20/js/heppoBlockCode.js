Blockly.JavaScript['comment'] = function(block) {
  var value_comment_string = Blockly.JavaScript.valueToCode(block, 'comment_string', Blockly.JavaScript.ORDER_ATOMIC).replace(/\'+/g, "");
  var code = '// ' + value_comment_string + '\n';
  return code;
};
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
  var code = '_self.runFoward();\n';
  return code;
};
Blockly.JavaScript['start_comment'] = function(block) {
  var value_comment_string = Blockly.JavaScript.valueToCode(block, 'comment_string', Blockly.JavaScript.ORDER_ATOMIC).replace(/\'+/g, "");
  var code = '// ' + value_comment_string + '\n';
  return code;
};
