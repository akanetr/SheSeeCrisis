//=============================================================================
// KZR_LightAnimation.js
// Version : 1.01
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.01 2017/02/12 マップ上でアニメーションが表示されないのを修正
// 1.00 2017/02/02 公開
//=============================================================================

/*:
 * @plugindesc 全体攻撃を１体分のみ表示することで、戦闘アニメーションを軽量化します。
 * @author ぶちょー
 *
 * @help
 * プラグインコマンドはありません。
 */

var Imported = Imported || {};
    Imported.KZR_LightAnimation = true;

//-----------------------------------------------------------------------------
// Game_Battler
//

var _kzr_LA01_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    _kzr_LA01_Game_Battler_initMembers.call(this);
    this._needCreateSprites = true;
};

//-----------------------------------------------------------------------------
// Sprite_Animation
//

var _kzr_LA01_Sprite_Animation_createSprites = Sprite_Animation.prototype.createSprites;
Sprite_Animation.prototype.createSprites = function() {
    var needCreateSprites = true;
    if (this._target._battler) {
        needCreateSprites = this._target._battler._needCreateSprites;
    } else if (this._target.parent._battler) {
        needCreateSprites = this._target.parent._battler._needCreateSprites;
    }
    if (needCreateSprites) {
        _kzr_LA01_Sprite_Animation_createSprites.call(this);
    } else {
        this._duplicated = true;
    }
};

//-----------------------------------------------------------------------------
// Window_BattleLog
//

var _kzr_LA01_Window_BattleLog_showNormalAnimation = Window_BattleLog.prototype.showNormalAnimation;
Window_BattleLog.prototype.showNormalAnimation = function(targets, animationId, mirror) {
    var animation = $dataAnimations[animationId];
    if (animation) {
        var notForAll = (animation.position != 3);
        for (var i in targets) {
            targets[i]._needCreateSprites = (i === '0' || notForAll);
        }
    }
    _kzr_LA01_Window_BattleLog_showNormalAnimation.call(this, targets, animationId, mirror);
};
