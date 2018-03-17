Blockly.Blocks['jump_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("前にジャンプ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(225);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
