Blockly.Blocks['run_foward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Run Foward");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};