Blockly.Blocks['start_comment'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("//");
    this.appendValueInput("comment_string")
        .setCheck("String")
        .appendField("スタート");
    this.setInputsInline(true);
    this.setNextStatement(true, null);
    this.setColour("#808080");
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
