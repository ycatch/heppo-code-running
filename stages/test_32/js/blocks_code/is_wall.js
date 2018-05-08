Blockly.JavaScript['is_wall'] = function(block) {
  var code = '_self.isWall(_self._player)';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
