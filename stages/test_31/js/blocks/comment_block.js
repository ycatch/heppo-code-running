Blockly.Blocks['comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("//");
    this.appendValueInput("comment_string")
        .setCheck("String")
        .appendField("*");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#808080");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
