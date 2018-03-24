Blockly.Blocks['start_comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("//");
    this.appendValueInput("comment_string")
        .setCheck("String")
        .appendField("Start");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};