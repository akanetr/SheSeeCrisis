//=============================================================================
// MOG_SkipWindowLog.js
//=============================================================================

/*:
 * @plugindesc (v1.1) Desativa a janela de Log.
 * @author Moghunter
 *
 * @param Lag Time
 * @desc Definição do tempo de espera após a ação.
 * @default 10 
 *
 * @help  
 * =============================================================================
 * +++ MOG - Skip Window Log (v1.1) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Desativa a janela de Log.
 *
 * =============================================================================
 * HISTÓRICO
 * ============================================================================= 
 * v1.1 - Compatibilidade com MOG Flash Damage.
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_SkipWindowLog = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_SkipWindowLog');
    Moghunter.winLogSpeed = Number(Moghunter.parameters['Lag Time'] || 10);
	
//=============================================================================
// ** Window BattleLog
//=============================================================================

//==============================
// * Refresh 
//==============================
Window_BattleLog.prototype.refresh = function(text) { 
   this.visible = false;
};

//==============================
// * Message Speed
//==============================
Window_BattleLog.prototype.messageSpeed = function() {
	if (Imported.MOG_FlashDamage) {if ($gameTemp._flashDamage) {return 0}};
    return Moghunter.winLogSpeed;
};
