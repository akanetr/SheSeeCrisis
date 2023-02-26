/*:
 *
 * @plugindesc サイドビュー戦闘にて、スキル・アイテム使用時の武器アニメーションを設定するプラグイン
 * @author hiz
 * 
 * @help
 * 
 * アイテム (スキル) メモ:
 *   <hzwamin:[motion],[wtypeid]>   # モーション[motion]・武器[wtypeid]の武器アニメーションを表示
 *                                  # ※ [motion]・[wtypeid]は省略可（通常攻撃のアニメーションを使用）
 *                                  # 　モーションの指定はモーション一覧参照。
 *                                  # 　武器の指定は、データベース[システム]の[SV]攻撃モーションの画像リスト
 *                                  # 　1番上（なし）を0として上から順に0・1・2・・・を指定。
 * 例）
 *   <hzwanim>              # 通常攻撃時の武器アニメーションを表示
 *   <hzwanim:thrust>       # 通常攻撃時の武器で突きモーションを表示
 *   <hzwanim:swing,3>      # フレイルの振りモーションを表示
 *   <hzwanim:guard>        # 防御モーションを表示
 *   
 * モーション一覧
 * ・攻撃モーション
 *   thrust         # 突き
 *   swing          # 振り
 *   missile        # 飛び道具
 * ・その他モーション
 *   guard          # 防御
 *   spell          # 魔法
 *   skill          # スキル
 *   item           # アイテム
 *   damage         # ダメージ
 *   evade          # 回避
 *   victory        # 勝利
 *   escape         # 逃走
 */

(function() {
    var _Game_Actor_performAction = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        var parm = action.item().meta.hzwanim;
        if(parm !== undefined) {
            var parms = parm.split !== undefined ? parm.split(",") : [];
            // 武器画像IDの設定
            var wtypeId = 0;
            if(parms.length > 1) {
                // モーションの手動設定
                wtypeId = Number(parms[1]);
            } else {
                // 通常攻撃の武器画像ID設定
                var weapons = this.weapons();
                wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
            }
            // モーションの設定
            var motion = "";
            if(parms.length > 0) {
                // モーションの手動設定
                motion = parms[0];
            } else {
                // 通常攻撃のモーション設定
                var weapons = this.weapons();
                var attackMotion = $dataSystem.attackMotions[wtypeId];
                if (attackMotion) {
                    if (attackMotion.type === 0) {
                        motion = 'thrust';
                    } else if (attackMotion.type === 1) {
                        motion = 'swing';
                    } else if (attackMotion.type === 2) {
                        motion = 'missile';
                    }
                    this.startWeaponAnimation(attackMotion.weaponImageId);
                }
            }
            if(motion === 'thrust' || motion === 'swing' || motion === 'missile') {
                //
                // 武器モーションの場合
                // 
                
                // 武器画像を表示するための準備
                var weapons = this.weapons();
                var attackMotion = $dataSystem.attackMotions[wtypeId];
                // モーションを設定
                this.requestMotion(motion);
                // 武器画像を表示
                this.startWeaponAnimation(attackMotion.weaponImageId);
            } else {
                //
                // 武器モーション以外の場合
                // 
                
                // モーションを設定
                this.requestMotion(motion);
            }
        } else {
            _Game_Actor_performAction.call(this, action);
        }
    };
})();