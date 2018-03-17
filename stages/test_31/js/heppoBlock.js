Blockly.Blocks['is_ball'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("ボール？");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Blocks['is_wall'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("カベ？");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
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
Blockly.Blocks['run_foward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("前に進む");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
