Blockly.JavaScript['start_comment'] = function(block) {
  var value_comment_string = Blockly.JavaScript.valueToCode(block, 'comment_string', Blockly.JavaScript.ORDER_ATOMIC).replace(/\'+/g, "");
  var code = '// ' + value_comment_string + '\n';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};
