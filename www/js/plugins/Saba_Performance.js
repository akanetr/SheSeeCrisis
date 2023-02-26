


1 //============================================================================= 
2 // Saba_Performance.js 
3 //============================================================================= 
4 /*:ja 
5  * @plugindesc まだテスト版です。OFFにする場合は 0 を入力してください 
6  * @author Sabakan 
7  * 
8  * @param notDrawAtBitmapSnap 
9  * @desc snap作成時に canvas を経由しないようにします。<br>■副作用:　小。画面遷移系を変更している場合はエラーになります。 
10  * @default 1 
11  * 
12  * @param recycleCanvas 
13  * @desc Canvas を使い回すことで生成コストを下げます。また、必要でないときは作成しないようにします。■副作用:　中。 
14  * @default 1 
15  * 
16  * @param skipSnapForBackgroundByNewGame 
17  * @desc ゲーム開始時にSnapForBackgroundをしないようにします。<br>■副作用:　小。ゲーム開始時に特殊な処理をしている場合は無効にしてください 
18  * @default 1 
19  * 
20  * @param skipSnapForBackgroundByMapChange 
21  * @desc マップ移動時にSnapForBackgroundをしないようにします。<br>■副作用:　小 
22  * @default 1 
23  * 
24  * @param usePixiSpriteToDrawWindow_Base 
25  * @desc PIXI.Spriteを使ってWindow_Baseを描画します。<br>■副作用:　中。Windowの描画を変更している場合は無効にしてください 
26  * @default 1 
27  * 
28  * @param useFilterToChangePictureTone 
29  * @desc PIXI のフィルタを使ってピクチャの色調を変化させます。<br>■副作用:　大。グレー効果は効かなくなります 
30  * @default 1 
31  * 
32  * @param reduceWindowInitializeProcess 
33  * @desc ウィンドウの初期化の無駄な処理を減らします<br>■副作用:　なし 
34  * @default 1 
35  * 
36  * @param alternateBitmapClearMethod 
37  * @desc Bitmap.clear() メソッドを高速な方法に切り替えます<br>■副作用:　中。Bitmap.clear()を呼ぶと、CanvasRenderingContext2Dのスタイルもクリアされます 
38  * @default 1 
39  * 
40  * @param usePixiSpriteToDrawIcon 
41  * @desc PIXI.Spriteを使ってIconを描画します。<br>■副作用:　中。アイコンのZ順に影響が出ることがあります 
42  * @default 1 
43  * 
44  * @param usePixiSpriteToDrawFace 
45  * @desc PIXI.Spriteを使ってFaceを描画します。<br>■副作用:　中。顔グラのZ順に影響が出ることがあります 
46  * @default 1 
47  * 
48  * @param usePixiSpriteToDrawCharacter 
49  * @desc PIXI.Spriteを使ってCharacterを描画します。<br>■副作用:　中。キャラグラのZ順に影響が出ることがあります 
50  * @default 1 
51  * 
52  * @param usePixiGraphicsToDrawMenuBg 
53  * @desc 
54  * @default 1 
55  * 
56  * @param skipUnnecessaryRefresh 
57  * @desc ウィンドウの初期化の無駄な処理を減らします<br>■副作用:　なし 
58  * @default 1 
59  * 
60  * @param lazyInitializationBitmapAtSprite_Timer 
61  * @desc タイマー用の Bitmap を、必要になるまで作成しないようにします<br>■副作用:　小 
62  * @default 1 
63  * 
64  * @param lazyInitializationWeather 
65  * @desc 天気用の Bitmap を、必要になるまで作成しないようにします<br>■副作用:　小 
66  * @default 1 
67  * 
68  * @param lazyCreationWindow_MapName 
69  * @desc マップネームウィンドウを、必要になるまで作成しないようにします<br>■副作用:　小 
70  * @default 1 
71  * 
72  * @param lazyCreationWindow_ScrollText 
73  * @desc スクロールテキストウィンドウを、必要になるまで作成しないようにします<br>■副作用:　小 
74  * @default 1 
75  * 
76  * @param useSpriteToDrawSprite_Destination 
77  * @desc 
78  * @default 1 
79  * 
80  * @param skipWindow_CommandFirstCreateContents 
81  * @desc 不要な createContents をスキップします<br>■副作用:　小。通常は影響がないはずです 
82  * @default 1 
83  * 
84  * @param useDefaultTextColor 
85  * @desc pixelを調べずにテキストカラーを取得するようにします<br>■副作用:　小。テキストカラーを変更していても、それが反映されません 
86  * @default 1 
87  * 
88  * @param reduceLoadingGlobalInfo 
89  * @desc 
90  * @default 1 
91  * 
92  * @param notLoadingVolumeZeroAudio 
93  * @desc config でボリュームが 0 に設定したオーディオを読み込まないようにします<br>■副作用:　小。ボリュームを 0 から 1 以上にあげると、最初から再生されます 
94  * @default 1 
95  * 
96  * @param usePixiByWindow_BattleLogBg 
97  * @desc バトルログの背景を PIXI を使って描画しますbr>■副作用:　小 
98  * @default 1 
99  * 
100  * @help 
101  * ・MV1.3 WebGL モード限定です 
102  * ・canvas 呼び出しで固まってしまう機種に対して効果を発揮します 
103  */ 
104 var Saba; 
105 (function (Saba) { 
106 
 
107 var parameters = PluginManager.parameters('Saba_Performance'); 
108 
 
109 /** 
110  * 子供を destroy しつつ削除します 
111  */ 
112 PIXI.Container.prototype.destroyAndRemoveChildren = function() { 
113     for (var i = this.children.length; i >= 0; i--) { 
114         if (this.children[i]) { 
115             this.children[i].destroy({children: true, texture: true}); 
116         } 
117     } 
118     this.removeChildren(); 
119 }; 
120 
 
121 Saba.toPixiColor = function(color) { 
122     var r = parseInt(color.substring(1, 3), 16); 
123     var g = parseInt(color.substring(3, 5), 16); 
124     var b = parseInt(color.substring(5, 7), 16); 
125     var intColor = (r << 16) | (g << 8) | b; 
126     return intColor; 
127 }; 
128 
 
129 
 
130 if (parseInt(parameters['notDrawAtBitmapSnap'])) { 
131     /** 
132      * snap作成時に canvas を経由しない。 
133      * メニューのオープンが速くなる。 
134      */ 
135     var renderTexture; 
136     Bitmap.snap = function(stage) { 
137         var width = Graphics.width; 
138         var height = Graphics.height; 
139         // var bitmap = new Bitmap(width, height); 
140         if (! renderTexture) { 
141             renderTexture = PIXI.RenderTexture.create(width, height); 
142         } 
143         if (stage) { 
144             Graphics._renderer.render(stage, renderTexture); 
145             stage.worldTransform.identity(); 
146             return new PIXI.Sprite(new PIXI.Texture(renderTexture)); 
147             // context.drawImage(canvas, 0, 0); 
148         } else { 
149             //TODO: Ivan: what if stage is not present? 
150         } 
151         return null; 
152     }; 
153     /** 
154      * Bitmap.blur が使えなくなるのでフィルタで代用 
155      */ 
156     Scene_MenuBase.prototype.createBackground = function() { 
157         this._backgroundSprite = SceneManager.backgroundBitmap(); 
158         var blurFilter = new PIXI.filters.BlurFilter(1); 
159         this._backgroundSprite.filters = [blurFilter]; 
160         var destroy = this._backgroundSprite.destroy; 
161         this._backgroundSprite.destroy = function(options) { 
162             // DO nothing 
163             this.filters = null; 
164         }; 
165         this.addChild(this._backgroundSprite); 
166     }; 
167     SceneManager.snapForBackground = function() { 
168         this._backgroundBitmap = this.snap(); 
169         this._backgroundBitmap.isBackgroundBitmap = true; 
170         // this._backgroundBitmap.blur(); 
171     }; 
172     Spriteset_Battle.prototype.createBackground = function() { 
173     }; 
174 } 
175 
 
176 
 
177 
 
178 if (parseInt(parameters['recycleCanvas'])) { 
179     PIXI.extras.TilingSprite.prototype.destroy = function() { 
180         PIXI.Sprite.prototype.destroy.call(this); 
181     }; 
182     PIXI.DisplayObject.prototype.returnChildCanvas = function() { 
183         if (this.returnCanvas) { 
184             this.returnCanvas(); 
185         } 
186     }; 
187     PIXI.Container.prototype.returnChildCanvas = function() { 
188         if (this.returnCanvas) { 
189             this.returnCanvas(); 
190         } 
191         for (var i = 0; i < this.children.length; i++) { 
192             var child = this.children[i]; 
193             if (child.returnChildCanvas) { 
194                 child.returnChildCanvas(); 
195             } 
196         } 
197     }; 
198     /** 
199      * 一度作成した canvas を使い回すことで、初期化のコストを減らす。 
200      * ゲームの起動、シーン遷移などが速くなる。 
201      */ 
202     SceneManager.changeScene = function() { 
203         if (this.isSceneChanging() && !this.isCurrentSceneBusy()) { 
204             if (this._scene) { 
205                 this._scene.terminate(); 
206                 this._scene.returnChildCanvas(); 
207                 this._previousClass = this._scene.constructor; 
208                 this._previousScene = this._scene; 
209             } 
210             this._scene = this._nextScene; 
211             if (this._scene) { 
212                 this._scene.create(); 
213                 this._nextScene = null; 
214                 this._sceneStarted = false; 
215                 this.onSceneCreate(); 
216             } 
217             if (this._exiting) { 
218                 this.terminate(); 
219             } 
220             if (this._previousScene) { 
221                 this._previousScene.destroy({children: true, texture: true}); 
222                 this._previousScene.visible = false; 
223                 this._previousScene = null; 
224             } 
225         } 
226     }; 
227     SceneManager.renderScene = function() { 
228         if (this.isCurrentSceneStarted()) { 
229             Graphics.render(this._scene); 
230         } else if (this._scene) { 
231             this.onSceneLoading(); 
232         } 
233     }; 
234 
 
235     Window.prototype.returnCanvas = function() { 
236         if (this.contents && this.contents.returnCanvas) { 
237             this.contents.returnCanvas(); 
238         } 
239     }; 
240     Sprite.prototype.returnCanvas = function() { 
241         if (this.bitmap && this.bitmap.returnCanvas) { 
242             this.bitmap.returnCanvas(); 
243         } 
244     }; 
245     var canvasCacheMap = {}; 
246     function getCanvasCache(width, height) { 
247         var key = width + '_' + height; 
248         canvasCacheMap[key] = canvasCacheMap[key] || []; 
249         if (canvasCacheMap[key].length > 0) { 
250             return canvasCacheMap[key].pop(); 
251         } 
252         var canvasCache = {}; 
253         canvasCache._canvas = document.createElement('canvas'); 
254         canvasCache._context = canvasCache._canvas.getContext('2d'); 
255 
 
256         canvasCache._canvas.width = width; 
257         canvasCache._canvas.height = height; 
258 
 
259         return canvasCache; 
260     } 
261     function putCanvasCache(bitmap) { 
262         var canvasCache = {}; 
263         canvasCache._canvas = bitmap._canvas; 
264         canvasCache._context = bitmap._context; 
265         var key = bitmap._canvas.width + '_' + bitmap._canvas.height; 
266         canvasCacheMap[key] = canvasCacheMap[key] || []; 
267         canvasCacheMap[key].push(canvasCache); 
268     } 
269     Bitmap.prototype.returnCanvas = function() { 
270         if (this._disposed) { 
271             return; 
272         } 
273         this._disposed = true; 
274         if (! this._context) { 
275             return; 
276         } 
277         //this._baseTexture.destroy(); 
278         putCanvasCache(this); 
279     }; 
280     Bitmap.prototype.destroy = function() { 
281         this._context = null; 
282         this._canvas = null; 
283         if (this._baseTexture) { 
284             this._baseTexture.destroy(); 
285         } 
286         this._baseTexture = null; 
287         this._image = null; 
288         this._url = null; 
289         this.textColor = null; 
290         this.outlineColor = null; 
291         this._loadListeners = null; 
292     }; 
293     Bitmap.prototype.initialize = function(width, height) { 
294         if (width !== undefined) { 
295             width = Math.max(width || 0, 1); 
296             height = Math.max(height || 0, 1); 
297             var cache = getCanvasCache(width, height); 
298             this._canvas = cache._canvas; 
299             this._context = cache._context; 
300 
 
301             this._baseTexture = new PIXI.BaseTexture(this._canvas); 
302             this.clear(); 
303             this.paintOpacity = 255; 
304         } else { 
305             // 幅を指定しない場合は canvas を作成しない 
306             this._baseTexture = new PIXI.BaseTexture(null); 
307             this._canvas = {dummy: true};  // dummy 
308             this._canvas.width = Math.max(width || 0, 1); 
309             this._canvas.height = Math.max(height || 0, 1); 
310             this._baseTexture.source = this._canvas; 
311         } 
312         this._baseTexture.mipmap = false; 
313         this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; 
314         this._image = null; 
315         this._url = ''; 
316         this._paintOpacity = 255; 
317         this._smooth = false; 
318         this._loadListeners = []; 
319         this._isLoading = false; 
320         this._hasError = false; 
321 
 
322         /** 
323          * Cache entry, for images. In all cases _url is the same as cacheEntry.key 
324          * @type CacheEntry 
325          */ 
326         this.cacheEntry = null; 
327 
 
328         /** 
329          * The face name of the font. 
330          * 
331          * @property fontFace 
332          * @type String 
333          */ 
334         this.fontFace = 'GameFont'; 
335 
 
336         /** 
337          * The size of the font in pixels. 
338          * 
339          * @property fontSize 
340          * @type Number 
341          */ 
342         this.fontSize = 28; 
343 
 
344         /** 
345          * Whether the font is italic. 
346          * 
347          * @property fontItalic 
348          * @type Boolean 
349          */ 
350         this.fontItalic = false; 
351 
 
352         /** 
353          * The color of the text in CSS format. 
354          * 
355          * @property textColor 
356          * @type String 
357          */ 
358         this.textColor = '#ffffff'; 
359 
 
360         /** 
361          * The color of the outline of the text in CSS format. 
362          * 
363          * @property outlineColor 
364          * @type String 
365          */ 
366         this.outlineColor = 'rgba(0, 0, 0, 0.5)'; 
367 
 
368         /** 
369          * The width of the outline of the text. 
370          * 
371          * @property outlineWidth 
372          * @type Number 
373          */ 
374         this.outlineWidth = 4; 
375     }; 
376     Bitmap.prototype._onLoad = function() { 
377         if(Decrypter.hasEncryptedImages) { 
378             window.URL.revokeObjectURL(this._image.src); 
379         } 
380         this._isLoading = false; 
381         this._baseTexture.loadSource(this._image); 
382         this._canvas = this._image; 
383 
 
384         this.resize(this._image.width, this._image.height); 
385         this._baseTexture.emit('loaded', this._baseTexture); 
386         // this._context.drawImage(this._image, 0, 0); 
387         this._setDirty(); 
388         this._callLoadListeners(); 
389     }; 
390     var _Bitmap_rotateHue = Bitmap.prototype.rotateHue; 
391     Bitmap.prototype.rotateHue = function(offset) { 
392         if (offset && this.width > 0 && this.height > 0) { 
393             if (! this._context) { 
394                 // この時だけ仕方なく描画。 
395                 var cache = getCanvasCache(); 
396                 this._canvas = cache._canvas; 
397                 this._context = cache._context; 
398                 this.resize(this._image.width, this._image.height); 
399                 this._context.drawImage(this._image, 0, 0); 
400             } 
401         } 
402         _Bitmap_rotateHue.call(this, offset); 
403     }; 
404     Object.defineProperty(Sprite.prototype, 'bitmap', { 
405         set: function(value) { 
406             if (this._bitmap !== value) { 
407                 if (this._bitmap) { 
408                     this._bitmap.returnCanvas(); 
409                     this._bitmap._loadListeners = []; 
410                 } 
411                 this._bitmap = value; 
412                 if (this._bitmap) { 
413                     this.setFrame(0, 0, 0, 0); 
414                     this._bitmap.addLoadListener(this._onBitmapLoad.bind(this)); 
415                 } else { 
416                     this.texture.frame = Rectangle.emptyRectangle; 
417                 } 
418             } 
419         }, 
420         configurable: true 
421     }); 
422     Bitmap.prototype.getPixel = function(x, y) { 
423         if (! this._context) { 
424             // この時だけ仕方なく描画。 
425             var cache = getCanvasCache(); 
426             this._canvas = cache._canvas; 
427             this._context = cache._context; 
428             this.resize(this._image.width, this._image.height); 
429             this._context.drawImage(this._image, 0, 0); 
430         } 
431         var data = this._context.getImageData(x, y, 1, 1).data; 
432         var result = '#'; 
433         for (var i = 0; i < 3; i++) { 
434             result += data[i].toString(16).padZero(2); 
435         } 
436         return result; 
437     }; 
438     var _Bitmap_getAlphaPixel = Bitmap.prototype.getAlphaPixel; 
439     Bitmap.prototype.getAlphaPixel = function(x, y) { 
440         if (! this._context) { 
441             // この時だけ仕方なく描画。 
442             var cache = getCanvasCache(); 
443             this._canvas = cache._canvas; 
444             this._context = cache._context; 
445             this.resize(this._image.width, this._image.height); 
446             this._context.drawImage(this._image, 0, 0); 
447         } 
448         return _Bitmap_getAlphaPixel.call(this, x, y); 
449     }; 
450     ImageManager.loadEmptyBitmap = function() { 
451         var empty = this.cache.getItem('empty'); 
452         if (!empty) { 
453             empty = new Bitmap(1); 
454             this.cache.setItem('empty', empty); 
455         } 
456         return empty; 
457     }; 
458     Sprite.prototype._createTinter = function(w, h) { 
459         if (!this._canvas2) { 
460             this._canvas2 = document.createElement('canvas'); 
461             this._context = this._canvas2.getContext('2d'); 
462         } 
463 
 
464         this._canvas2.width = w; 
465         this._canvas2.height = h; 
466 
 
467         if (!this._tintTexture) { 
468             this._tintTexture = new PIXI.BaseTexture(this._canvas2); 
469         } 
470 
 
471         this._tintTexture.width = w; 
472         this._tintTexture.height = h; 
473         this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode; 
474     }; 
475 } 
476 
 
477 
 
478 if (parseInt(parameters['skipSnapForBackgroundByNewGame'])) { 
479     /** 
480      * Scene_Title から newGame の選択時は、snapForBackground が不必要 
481      */ 
482     Scene_Title.prototype.terminate = function() { 
483         Scene_Base.prototype.terminate.call(this); 
484         if (!SceneManager.isNextScene(Scene_Map)) { 
485             SceneManager.snapForBackground(); 
486         } 
487     }; 
488 } 
489 
 
490 if (parseInt(parameters['skipSnapForBackgroundByMapChange'])) { 
491     /** 
492      * マップ切り替え時は SceneManager.snapForBackground を呼ばないようにした 
493      */ 
494     Scene_Map.prototype.terminate = function() { 
495         Scene_Base.prototype.terminate.call(this); 
496         if (!SceneManager.isNextScene(Scene_Battle) && !SceneManager.isNextScene(Scene_Map)) { 
497             this._spriteset.update(); 
498             this._mapNameWindow.hide(); 
499             SceneManager.snapForBackground(); 
500         } 
501         $gameScreen.clearZoom(); 
502     }; 
503 } 
504 
 
505 if (parseInt(parameters['usePixiSpriteToDrawWindow_Base'])) { 
506     /** 
507      * Window の描画は drawImage が何度も走るので PIXI.Sprite で代用 
508      */ 
509     Window.prototype._refreshBack = function() { 
510         var m = this._margin; 
511         var w = this._width - m * 2; 
512         var h = this._height - m * 2; 
513         var bitmap = new Bitmap(w, h); 
514         this._windowBackSprite.bitmap = bitmap; 
515         this._windowBackSprite.setFrame(0, 0, w, h); 
516         this._windowBackSprite.move(m, m); 
517 
 
518         this._windowBackSprite._toneFilter = new ToneFilter(); 
519 
 
520         if (w > 0 && h > 0 && this._windowskin) { 
521             this._windowBackSprite.destroyAndRemoveChildren(); 
522 
 
523             var baseTexture = this.getBaseTexture(); 
524             var p = 96; 
525             var texture = new PIXI.Texture(baseTexture); 
526             texture.frame = new PIXI.Rectangle(0, 0, p, p); 
527             var backSprite = new PIXI.Sprite(texture); 
528             backSprite.width = w; 
529             backSprite.height = h; 
530             this._windowBackSprite.addChild(backSprite); 
531             // bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h); 
532 
 
533             var tileTexture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, p, p, p)); 
534             var tilingSprite = new PIXI.extras.TilingSprite(tileTexture, w, h); 
535             this._windowBackSprite.addChild(tilingSprite); 
536 
 
537             var tone = this._colorTone; 
538             this._windowBackSprite._toneFilter.reset(); 
539             this._windowBackSprite._toneFilter.adjustTone(tone[0], tone[1], tone[2]); 
540             //bitmap.adjustTone(tone[0], tone[1], tone[2]); 
541         } 
542     }; 
543     Window.prototype.getBaseTexture = function() { 
544         var baseTexture = PIXI.utils.BaseTextureCache[this._windowskin._image.src]; 
545         if (! baseTexture) { 
546             baseTexture = new PIXI.BaseTexture(this._windowskin._image, PIXI.SCALE_MODES.DEFAULT); 
547             baseTexture.imageUrl = this._windowskin._image.src; 
548             PIXI.utils.BaseTextureCache[this._windowskin._image.src] = baseTexture; 
549         } 
550         return baseTexture; 
551     }; 
552     Window.prototype._refreshFrame = function() { 
553         var w = this._width; 
554         var h = this._height; 
555         var m = 24; 
556         // var bitmap = new Bitmap(w, h); 
557 
 
558         // this._windowFrameSprite.bitmap = bitmap; 
559         this._windowFrameSprite.setFrame(0, 0, w, h); 
560 
 
561         if (w > 0 && h > 0 && this._windowskin) { 
562             // var skin = this._windowskin; 
563             var baseTexture = this.getBaseTexture(); 
564 
 
565             var parent = this._windowFrameSprite; 
566             parent.destroyAndRemoveChildren(); 
567             var p = 96; 
568             var q = 96; 
569             this._addPixiSprite(parent, baseTexture, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m); 
570             this._addPixiSprite(parent, baseTexture, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m); 
571             this._addPixiSprite(parent, baseTexture, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2); 
572             this._addPixiSprite(parent, baseTexture, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2); 
573             this._addPixiSprite(parent, baseTexture, p+0, 0+0, m, m, 0, 0, m, m); 
574             this._addPixiSprite(parent, baseTexture, p+q-m, 0+0, m, m, w-m, 0, m, m); 
575             this._addPixiSprite(parent, baseTexture, p+0, 0+q-m, m, m, 0, h-m, m, m); 
576             this._addPixiSprite(parent, baseTexture, p+q-m, 0+q-m, m, m, w-m, h-m, m, m); 
577 
 
578             // bitmap.blt(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m); 
579             // bitmap.blt(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m); 
580             // bitmap.blt(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2); 
581             // bitmap.blt(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2); 
582             // bitmap.blt(skin, p+0, 0+0, m, m, 0, 0, m, m); 
583             // bitmap.blt(skin, p+q-m, 0+0, m, m, w-m, 0, m, m); 
584             // bitmap.blt(skin, p+0, 0+q-m, m, m, 0, h-m, m, m); 
585             // bitmap.blt(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m); 
586         } 
587     }; 
588     Window.prototype._addPixiSprite = function(parent, baseTexture, sx, sy, sw, sh, dx, dy, dw, dh) { 
589         var texture = new PIXI.Texture(baseTexture); 
590         texture.frame = new PIXI.Rectangle(sx, sy, sw, sh); 
591         var sprite = new PIXI.Sprite(texture); 
592         sprite.width = dw; 
593         sprite.height = dh; 
594         sprite.position.x = dx; 
595         sprite.position.y = dy; 
596         parent.addChild(sprite); 
597     }; 
598     Window.prototype._refreshCursor = function() { 
599         var pad = this._padding; 
600         var x = this._cursorRect.x + pad - this.origin.x; 
601         var y = this._cursorRect.y + pad - this.origin.y; 
602         var w = this._cursorRect.width; 
603         var h = this._cursorRect.height; 
604         var m = 4; 
605         var x2 = Math.max(x, pad); 
606         var y2 = Math.max(y, pad); 
607         var ox = x - x2; 
608         var oy = y - y2; 
609         var w2 = Math.min(w, this._width - pad - x2); 
610         var h2 = Math.min(h, this._height - pad - y2); 
611         // var bitmap = new Bitmap(w2, h2); 
612 
 
613         // this._windowCursorSprite.bitmap = bitmap; 
614         this._windowCursorSprite.setFrame(0, 0, w2, h2); 
615         this._windowCursorSprite.move(x2, y2); 
616         var parent = this._windowCursorSprite; 
617         parent.destroyAndRemoveChildren(); 
618 
 
619         if (w > 0 && h > 0 && this._windowskin) { 
620             // var skin = this._windowskin; 
621             var p = 96; 
622             var q = 48; 
623 
 
624             var baseTexture = this.getBaseTexture(); 
625 
 
626             this._addPixiSprite(parent, baseTexture, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2); 
627             this._addPixiSprite(parent, baseTexture, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m); 
628             this._addPixiSprite(parent, baseTexture, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m); 
629             this._addPixiSprite(parent, baseTexture, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2); 
630             this._addPixiSprite(parent, baseTexture, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2); 
631             this._addPixiSprite(parent, baseTexture, p+0, p+0, m, m, ox+0, oy+0, m, m); 
632             this._addPixiSprite(parent, baseTexture, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m); 
633             this._addPixiSprite(parent, baseTexture, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m); 
634             this._addPixiSprite(parent, baseTexture, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m); 
635 
 
636             // bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, ox+m, oy+m, w-m*2, h-m*2); 
637             // bitmap.blt(skin, p+m, p+0, q-m*2, m, ox+m, oy+0, w-m*2, m); 
638             // bitmap.blt(skin, p+m, p+q-m, q-m*2, m, ox+m, oy+h-m, w-m*2, m); 
639             // bitmap.blt(skin, p+0, p+m, m, q-m*2, ox+0, oy+m, m, h-m*2); 
640             // bitmap.blt(skin, p+q-m, p+m, m, q-m*2, ox+w-m, oy+m, m, h-m*2); 
641             // bitmap.blt(skin, p+0, p+0, m, m, ox+0, oy+0, m, m); 
642             // bitmap.blt(skin, p+q-m, p+0, m, m, ox+w-m, oy+0, m, m); 
643             // bitmap.blt(skin, p+0, p+q-m, m, m, ox+0, oy+h-m, m, m); 
644             // bitmap.blt(skin, p+q-m, p+q-m, m, m, ox+w-m, oy+h-m, m, m); 
645         } 
646     }; 
647 } 
648 
 
649 if (parseInt(parameters['useFilterToChangePictureTone'])) { 
650     /** 
651      * 色調の変化の度に drawImage が走るのでフィルタで代用 
652      */ 
653     Sprite.prototype.setColorTone = function(tone) { 
654         if (!(tone instanceof Array)) { 
655             throw new Error('Argument must be an array'); 
656         } 
657         if (!this._colorTone.equals(tone)) { 
658             if (! this._toneFilter) { 
659                 this._toneFilter = new ToneFilter(); 
660                 this.filters = [this._toneFilter]; 
661             } 
662             this._colorTone = tone.clone(); 
663             this._toneFilter.reset(); 
664             this._toneFilter.adjustTone(tone[0], tone[1], tone[2]); 
665         } 
666     }; 
667 } 
668 
 
669 if (parseInt(parameters['reduceWindowInitializeProcess'])) { 
670     /** 
671      * ウィンドウの初期化で3回 _refreshAllParts が走るので1回にまとめた 
672      */ 
673     var _Window_Base_initialize = Window_Base.prototype.initialize; 
674     Window_Base.prototype.initialize = function(x, y, width, height) { 
675         this._initializing = true; 
676         _Window_Base_initialize.call(this, x, y, width, height); 
677         this._initializing = false; 
678         this._refreshAllParts(); 
679     }; 
680     var _Window__refreshAllParts = Window.prototype._refreshAllParts; 
681     Window.prototype._refreshAllParts = function() { 
682         if (this._initializing) { 
683             return; 
684         } 
685         _Window__refreshAllParts.call(this); 
686     }; 
687 } 
688 
 
689 if (parseInt(parameters['alternateBitmapClearMethod'])) { 
690     /** 
691      * Chromium の clearRect は遅い 
692      */ 
693     Bitmap.prototype.clear = function() { 
694         this._canvas.width = this._canvas.width;    // 裏技 
695         this._setDirty(); 
696         //this.clearRect(0, 0, this.width, this.height); 
697     }; 
698 } 
699 
 
700 
 
701 if (parseInt(parameters['usePixiSpriteToDrawIcon'])) { 
702     /** 
703      * drawIcon では drawImage が行われるので PIXI.Sprite で代用 
704      */ 
705     Window_Base.prototype.drawIcon = function(iconIndex, x, y) { 
706         var baseTexture = PIXI.utils.BaseTextureCache['system/IconSet']; 
707         if (! baseTexture) { 
708             var bitmap = ImageManager.loadSystem('IconSet'); 
709             if (! bitmap.isReady()) { 
710                 return; 
711             } 
712             baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT); 
713             baseTexture.imageUrl = 'system/IconSet'; 
714             PIXI.utils.BaseTextureCache['system/IconSet'] = baseTexture; 
715         } 
716 
 
717         var pw = Window_Base._iconWidth; 
718         var ph = Window_Base._iconHeight; 
719         var sx = iconIndex % 16 * pw; 
720         var sy = Math.floor(iconIndex / 16) * ph; 
721 
 
722         var texture = new PIXI.Texture(baseTexture); 
723         texture.frame = new PIXI.Rectangle(sx, sy, pw, ph); 
724         var sprite = new PIXI.Sprite(texture); 
725         sprite.position.x = x; 
726         sprite.position.y = y; 
727         sprite.alpha = this.contents.paintOpacity / 255.0; 
728         this._windowContentsSprite.addChild(sprite); 
729 
 
730         // this.contents.blt(bitmap, sx, sy, pw, ph, x, y); 
731     }; 
732 } 
733 
 
734 
 
735 if (parseInt(parameters['usePixiSpriteToDrawFace'])) { 
736     /** 
737      * drawFace では drawImage が行われるので PIXI.Sprite で代用 
738      */ 
739     Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) { 
740         if (! faceName) { 
741             return; 
742         } 
743         width = width || Window_Base._faceWidth; 
744         height = height || Window_Base._faceHeight; 
745 
 
746         var baseTexture = PIXI.utils.BaseTextureCache['face/' + faceName]; 
747         if (! baseTexture) { 
748             var bitmap = ImageManager.loadFace(faceName); 
749             if (! bitmap.isReady()) { 
750                 return; 
751             } 
752             baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT); 
753             baseTexture.imageUrl = 'face/' + faceName; 
754             PIXI.utils.BaseTextureCache['face/' + faceName] = baseTexture; 
755         } 
756 
 
757         var pw = Window_Base._faceWidth; 
758         var ph = Window_Base._faceHeight; 
759         var sw = Math.min(width, pw); 
760         var sh = Math.min(height, ph); 
761         var dx = Math.floor(x + Math.max(width - pw, 0) / 2); 
762         var dy = Math.floor(y + Math.max(height - ph, 0) / 2); 
763         var sx = faceIndex % 4 * pw + (pw - sw) / 2; 
764         var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2; 
765 
 
766         if (sx + sw > baseTexture.width || sy + sh > baseTexture.height) { 
767             console.error(faceName + ' グラフィックの描画領域が画像サイズをはみ出しています'); 
768             return; 
769         } 
770         var texture = new PIXI.Texture(baseTexture); 
771         texture.frame = new PIXI.Rectangle(sx, sy, sw, sh); 
772         var sprite = new PIXI.Sprite(texture); 
773         sprite.position.x = dx; 
774         sprite.position.y = dy; 
775         sprite.alpha = this.contents.paintOpacity / 255.0; 
776         this._windowContentsSprite.addChild(sprite); 
777 
 
778         //this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy); 
779     }; 
780 } 
781 
 
782 
 
783 if (parseInt(parameters['usePixiSpriteToDrawCharacter'])) { 
784     /** 
785      * drawCharacter では drawImage が行われるので PIXI.Sprite で代用 
786      */ 
787     Window_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) { 
788         if (! characterName) { 
789             return; 
790         } 
791         var baseTexture = PIXI.utils.BaseTextureCache['character/' + characterName]; 
792         if (! baseTexture) { 
793             var bitmap = ImageManager.loadCharacter(characterName); 
794             if (! bitmap.isReady()) { 
795               return; 
796             } 
797             baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT); 
798             baseTexture.imageUrl = 'character/' + characterName; 
799             PIXI.utils.BaseTextureCache['character/' + characterName] = baseTexture; 
800         } 
801 
 
802         var big = ImageManager.isBigCharacter(characterName); 
803         var pw = baseTexture.width / (big ? 3 : 12); 
804         var ph = baseTexture.height / (big ? 4 : 8); 
805         var n = characterIndex; 
806         var sx = (n % 4 * 3 + 1) * pw; 
807         var sy = (Math.floor(n / 4) * 4) * ph; 
808 
 
809         var texture = new PIXI.Texture(baseTexture); 
810         texture.frame = new PIXI.Rectangle(sx, sy, pw, ph); 
811         var sprite = new PIXI.Sprite(texture); 
812         sprite.position.x = x - pw / 2; 
813         sprite.position.y = y - ph; 
814         this._windowContentsSprite.addChild(sprite); 
815 
 
816         //this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph); 
817     }; 
818 } 
819 
 
820 
 
821 if (parseInt(parameters['usePixiSpriteToDrawIcon']) || 
822     parseInt(parameters['usePixiSpriteToDrawFace']) || 
823     parseInt(parameters['usePixiSpriteToDrawCharacter'])) { 
824     /** 
825      * drawXXX 系を PIXI.Sprite で代用するときに必要なもの 
826      */ 
827     Bitmap.prototype.setClearHandler = function(onClear) { 
828         this.onClear = onClear; 
829     }; 
830     var _Bitmap_clear = Bitmap.prototype.clear; 
831     Bitmap.prototype.clear = function() { 
832         _Bitmap_clear.call(this); 
833         if (this.onClear) { 
834             this.onClear(); 
835         } 
836     }; 
837     var _Window_Base_createContents = Window_Base.prototype.createContents; 
838     Window_Base.prototype.createContents = function() { 
839         _Window_Base_createContents.call(this); 
840         this.contents.setClearHandler(this.onClearContents.bind(this)); 
841         this.contents.clear(); 
842     }; 
843     var _Window_Base_destroy = Window_Base.prototype.destroy; 
844     Window_Base.prototype.destroy = function(options) { 
845         if (this.contents && this.contents.onClear) { 
846             this.contents.onClear = null; 
847         } 
848         _Window_Base_destroy.call(this, options); 
849     }; 
850 
 
851     Window_Base.prototype.onClearContents = function() { 
852         // PIXI.Sprite を消去 
853         this._windowContentsSprite.destroyAndRemoveChildren(); 
854     }; 
855 } 
856 
 
857 
 
858 if (parseInt(parameters['usePixiGraphicsToDrawMenuBg'])) { 
859     /** 
860      * メニュー背景の描画を PIXI.Graphics で代用する 
861      */ 
862     Window_MenuStatus.prototype.drawItemBackground = function(index) { 
863         if (index === this._pendingIndex) { 
864             var rect = this.itemRect(index); 
865             var color = this.pendingColor(); 
866             var graphics = new PIXI.Graphics(); 
867             graphics.beginFill(color, this.translucentOpacity() / 255.0); 
868             graphics.drawRect(rect.x, rect.y, rect.width, rect.height); 
869             this.addChild(graphics); 
870             // this.changePaintOpacity(false); 
871             // this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color); 
872             // this.changePaintOpacity(true); 
873         } 
874     }; 
875 } 
876 
 
877 
 
878 
 
879 
 
880 
 
881 if (parseInt(parameters['skipUnnecessaryRefresh'])) { 
882     /** 
883      * 以下のウィンドウの初期化時の refresh() は不要 
884      */ 
885     Window_MapName.prototype.initialize = function() { 
886         var wight = this.windowWidth(); 
887         var height = this.windowHeight(); 
888         Window_Base.prototype.initialize.call(this, 0, 0, wight, height); 
889         this.opacity = 0; 
890         this.contentsOpacity = 0; 
891         this._showCount = 0; 
892         // this.refresh(); 
893     }; 
894     Window_BattleEnemy.prototype.initialize = function(x, y) { 
895         this._enemies = []; 
896         var width = this.windowWidth(); 
897         var height = this.windowHeight(); 
898         Window_Selectable.prototype.initialize.call(this, x, y, width, height); 
899         // this.refresh(); 
900         this.hide(); 
901     }; 
902 } 
903 
 
904 
 
905 if (parseInt(parameters['lazyInitializationBitmapAtSprite_Timer'])) { 
906     /** 
907      * タイマーを表示する必要があるまでタイマーの Bitmap を作成しない。 
908      */ 
909     Sprite_Timer.prototype.initialize = function() { 
910         Sprite.prototype.initialize.call(this); 
911         this._seconds = 0; 
912         // this.createBitmap(); 
913         this.update(); 
914     }; 
915     var _Sprite_Timer_redraw = Sprite_Timer.prototype.redraw; 
916     Sprite_Timer.prototype.redraw = function() { 
917         if (! this._bitmap) { 
918             this.createBitmap(); 
919         } 
920         _Sprite_Timer_redraw.call(this); 
921     }; 
922     var _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition; 
923     Sprite_Timer.prototype.updatePosition = function() { 
924         if (! this._bitmao) { 
925             return; 
926         } 
927         _Sprite_Timer_updatePosition.call(this); 
928     }; 
929 } 
930 
 
931 
 
932 if (parseInt(parameters['lazyInitializationWeather'])) { 
933     /** 
934      * 天気を表示する直前まで Bitmap を作成しない 
935      */ 
936     Weather.prototype._createBitmaps = function() { 
937         // this._rainBitmap = new Bitmap(1, 60); 
938         // this._rainBitmap.fillAll('white'); 
939         // this._stormBitmap = new Bitmap(2, 100); 
940         // this._stormBitmap.fillAll('white'); 
941         // this._snowBitmap = new Bitmap(9, 9); 
942         // this._snowBitmap.drawCircle(4, 4, 4, 'white'); 
943     }; 
944     var _Weather_updateRainSprite = Weather.prototype._updateRainSprite; 
945     Weather.prototype._updateRainSprite = function(sprite) { 
946         if (! this._rainBitmap) { 
947             this._rainBitmap = new Bitmap(1, 60); 
948             this._rainBitmap.fillAll('white'); 
949         } 
950         _Weather_updateRainSprite.call(this, sprite); 
951     }; 
952 
 
953     var _Weather__updateStormSprite = Weather.prototype._updateStormSprite; 
954     Weather.prototype._updateStormSprite = function(sprite) { 
955         if (! this._stormBitmap) { 
956             this._stormBitmap = new Bitmap(2, 100); 
957             this._stormBitmap.fillAll('white'); 
958         } 
959         _Weather__updateStormSprite.call(this, sprite); 
960     }; 
961 
 
962     var _Weather_updateSnowSprite = Weather.prototype._updateSnowSprite; 
963     Weather.prototype._updateSnowSprite = function(sprite) { 
964         if (! this._snowBitmap) { 
965             this._snowBitmap = new Bitmap(9, 9); 
966             this._snowBitmap.drawCircle(4, 4, 4, 'white'); 
967         } 
968         _Weather_updateSnowSprite.call(this, sprite); 
969     }; 
970 } 
971 
 
972 
 
973 
 
974 if (parseInt(parameters['lazyCreationWindow_MapName'])) { 
975     /** 
976      * Window_MapName は、open() が呼ばれて、かつマップ名を表示する必要があるまで作成しない。 
977      * window 順がずれる可能性あり（最前面になる） 
978      */ 
979     var _Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow; 
980     Scene_Map.prototype.createMapNameWindow = function() { 
981         var self = this; 
982         // dummy 
983         this._mapNameWindow = { 
984             hide: function() {}, 
985             close: function() {}, 
986             open: function() { 
987                 if ($gameMap.displayName()) { 
988                     _Scene_Map_createMapNameWindow.call(self); 
989                     self._mapNameWindow.open(); 
990                 } 
991             } 
992         }; 
993         // this._mapNameWindow = new Window_MapName(); 
994         // this.addChild(this._mapNameWindow); 
995     }; 
996 } 
997 
 
998 if (parseInt(parameters['lazyCreationWindow_ScrollText'])) { 
999     /** 
1000      * Scene_Map の Window_ScrollText は、必要になるまで作成しない。 
1001      */ 
1002     var _Scene_Map_createScrollTextWindow = Scene_Map.prototype.createScrollTextWindow; 
1003     Scene_Map.prototype.createScrollTextWindow = function() { 
1004         // this._scrollTextWindow = new Window_ScrollText(); 
1005         // this.addWindow(this._scrollTextWindow); 
1006     }; 
1007     var _Scene_Map_update = Scene_Map.prototype.update; 
1008     Scene_Map.prototype.update = function() { 
1009         if ($gameMessage.scrollMode()) { 
1010             if (! this._scrollTextWindow) { 
1011                 _Scene_Map_createScrollTextWindow.call(this); 
1012             } 
1013         } 
1014         _Scene_Map_update.call(this); 
1015     }; 
1016 
 
1017     /** 
1018      * Scene_Battle の Window_ScrollText は、必要になるまで作成しない。 
1019      */ 
1020     var _Scene_Battle_createScrollTextWindow = Scene_Battle.prototype.createScrollTextWindow; 
1021     Scene_Battle.prototype.createScrollTextWindow = function() { 
1022         // this._scrollTextWindow = new Window_ScrollText(); 
1023         // this.addWindow(this._scrollTextWindow); 
1024     }; 
1025     var _Scene_Battle_update = Scene_Battle.prototype.update; 
1026     Scene_Battle.prototype.update = function() { 
1027         if ($gameMessage.scrollMode()) { 
1028             if (! this._scrollTextWindow) { 
1029                 _Scene_Battle_createScrollTextWindow.call(this); 
1030             } 
1031         } 
1032         _Scene_Battle_update.call(this); 
1033     }; 
1034 } 
1035 
 
1036 if (parseInt(parameters['useSpriteToDrawSprite_Destination'])) { 
1037     /** 
1038      * 行き先を表示するスプライトは PIXI.Texture を使う 
1039      */ 
1040     Sprite_Destination.prototype.createBitmap = function() { 
1041         var tileWidth = $gameMap.tileWidth(); 
1042         var tileHeight = $gameMap.tileHeight(); 
1043 
 
1044         var bitmap = ImageManager.loadSystem('Window'); 
1045         baseTexture = new PIXI.BaseTexture(bitmap._image, PIXI.SCALE_MODES.DEFAULT); 
1046         var texture = new PIXI.Texture(baseTexture); 
1047         texture.frame = new PIXI.Rectangle(96, 144, 12, 12); 
1048         this.texture = texture; 
1049 
 
1050         this.anchor.x = 0.5; 
1051         this.anchor.y = 0.5; 
1052         this.blendMode = Graphics.BLEND_ADD; 
1053     }; 
1054     Sprite_Destination.prototype.updateAnimation = function() { 
1055         this._frameCount++; 
1056         this._frameCount %= 20; 
1057         this.opacity = (20 - this._frameCount) * 6; 
1058         this.scale.x = (1 + this._frameCount / 20) * 4; 
1059         this.scale.y = this.scale.x; 
1060     }; 
1061 } 
1062 
 
1063 
 
1064 if (parseInt(parameters['skipWindow_CommandFirstCreateContents'])) { 
1065     /** 
1066      * Window_Command の初回の createContents は必ず無駄になるのでスキップ 
1067      */ 
1068     var _Window_Command_createContents = Window_Command.prototype.createContents; 
1069     Window_Command.prototype.createContents = function() { 
1070         // this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight()); 
1071         // this.resetFontSettings(); 
1072     }; 
1073     Window_Command.prototype.refresh = function() { 
1074         this.clearCommandList(); 
1075         this.makeCommandList(); 
1076         _Window_Command_createContents.call(this); 
1077         Window_Selectable.prototype.refresh.call(this); 
1078     }; 
1079 } 
1080 
 
1081 if (parseInt(parameters['useDefaultTextColor'])) { 
1082     /** 
1083      * テキストカラーを定義しておくことで、pixel を調べずにテキストカラーを取得する 
1084      * @param  {[type]} n [description] 
1085      * @return {[type]}   [description] 
1086      */ 
1087     Window_Base.prototype.textColor = function(n) { 
1088         switch (n) { 
1089         case 0: return '#ffffff'; 
1090         case 1: return '#20a0d6'; 
1091         case 2: return '#ff784c'; 
1092         case 3: return '#66cc40'; 
1093         case 4: return '#99ccff'; 
1094         case 5: return '#ccc0ff'; 
1095         case 6: return '#ffffa0'; 
1096         case 7: return '#808080'; 
1097         case 8: return '#c0c0c0'; 
1098         case 9: return '#2080cc'; 
1099         case 10: return '#ff3810'; 
1100         case 11: return '#00a010'; 
1101         case 12: return '#3e9ade'; 
1102         case 13: return '#a098ff'; 
1103         case 14: return '#ffcc20'; 
1104         case 15: return '#000000'; 
1105         case 16: return '#84aaff'; 
1106         case 17: return '#ffff40'; 
1107         case 18: return '#ff2020'; 
1108         case 19: return '#202040'; 
1109         case 20: return '#e08040'; 
1110         case 21: return '#f0c040'; 
1111         case 22: return '#4080c0'; 
1112         case 23: return '#40c0f0'; 
1113         case 24: return '#80ff80'; 
1114         case 25: return '#c08080'; 
1115         case 26: return '#8080ff'; 
1116         case 27: return '#ff80ff'; 
1117         case 28: return '#00a040'; 
1118         case 29: return '#00e060'; 
1119         case 30: return '#a060e0'; 
1120         case 31: return '#c080ff'; 
1121         } 
1122         return '#000000'; 
1123     }; 
1124 } 
1125 
 
1126 
 
1127 
 
1128 if (parseInt(parameters['reduceLoadingGlobalInfo'])) { 
1129     /** 
1130      * タイトル、セーブ画面、ロード画面で loadingGlobalInfo が何度も走るので減らす 
1131      */ 
1132     var _Scene_File_initialize = Scene_File.prototype.initialize; 
1133     Scene_File.prototype.initialize = function() { 
1134         this._globalInfo = DataManager.loadGlobalInfo(); 
1135         _Scene_File_initialize.call(this); 
1136     }; 
1137     Scene_File.prototype.create = function() { 
1138         Scene_MenuBase.prototype.create.call(this); 
1139         DataManager.loadAllSavefileImages(this._globalInfo); 
1140         this.createHelpWindow(); 
1141         this.createListWindow(); 
1142     }; 
1143     Scene_Load.prototype.firstSavefileIndex = function() { 
1144         return DataManager.latestSavefileId(this._globalInfo) - 1; 
1145     }; 
1146 
 
1147     var _Window_SavefileList_initialize  = Window_SavefileList.prototype.initialize; 
1148     Window_SavefileList.prototype.initialize = function(x, y, width, height) { 
1149         this._globalInfo = DataManager.loadGlobalInfo(); 
1150 
 
1151         _Window_SavefileList_initialize.call(this, x, y, width, height); 
1152     }; 
1153     Window_SavefileList.prototype.drawItem = function(index) { 
1154         var id = index + 1; 
1155         var valid = DataManager.isThisGameFileInfo(this._globalInfo[id]); 
1156         var info = this._globalInfo[id] ? this._globalInfo[id] : null; 
1157         var rect = this.itemRectForText(index); 
1158         this.resetTextColor(); 
1159         if (this._mode === 'load') { 
1160             this.changePaintOpacity(valid); 
1161         } 
1162         this.drawFileId(id, rect.x, rect.y); 
1163         if (info) { 
1164             this.changePaintOpacity(valid); 
1165             this.drawContents(info, rect, valid); 
1166             this.changePaintOpacity(true); 
1167         } 
1168     }; 
1169     DataManager.loadAllSavefileImages = function(globalInfo) { 
1170         if (! globalInfo) { 
1171             globalInfo = this.loadGlobalInfo(); 
1172         } 
1173         if (globalInfo) { 
1174             for (var i = 1; i < globalInfo.length; i++) { 
1175               var info = globalInfo[i]; 
1176                 if (this.isThisGameFileInfo(info)) { 
1177                     this.loadSavefileImages(info); 
1178                 } 
1179             } 
1180         } 
1181     }; 
1182     DataManager.isThisGameFileInfo = function(savefile) { 
1183         if (! savefile) { 
1184             return false; 
1185         } 
1186         if (StorageManager.isLocalMode()) { 
1187             return true; 
1188         } 
1189         return (savefile.globalId === this._globalId && 
1190                 savefile.title === $dataSystem.gameTitle); 
1191     }; 
1192     DataManager.isAnySavefileExists = function(globalInfo) { 
1193         if (! globalInfo) { 
1194             globalInfo = this.loadGlobalInfo(); 
1195         } 
1196         if (globalInfo) { 
1197             for (var i = 1; i < globalInfo.length; i++) { 
1198                 var info = globalInfo[i]; 
1199                 if (this.isThisGameFileInfo(info)) { 
1200                     return true; 
1201                 } 
1202             } 
1203         } 
1204         return false; 
1205     }; 
1206     DataManager.latestSavefileId = function(globalInfo) { 
1207         if (! globalInfo) { 
1208             globalInfo = this.loadGlobalInfo(); 
1209         } 
1210         var savefileId = 1; 
1211         var timestamp = 0; 
1212         if (globalInfo) { 
1213             for (var i = 1; i < globalInfo.length; i++) { 
1214                 var info = globalInfo[i]; 
1215                 if (this.isThisGameFileInfo(info) && info.timestamp > timestamp) { 
1216                     timestamp = info.timestamp; 
1217                     savefileId = i; 
1218                 } 
1219             } 
1220         } 
1221         return savefileId; 
1222     }; 
1223     Window_TitleCommand.prototype.isContinueEnabled = function() { 
1224         if (! this._globalInfo) { 
1225             this._globalInfo = DataManager.loadGlobalInfo(); 
1226         } 
1227         return DataManager.isAnySavefileExists(this._globalInfo); 
1228     }; 
1229 } 
1230 
 
1231 
 
1232 if (parseInt(parameters['notLoadingVolumeZeroAudio'])) { 
1233     var _AudioManager_playSe = AudioManager.playSe; 
1234     AudioManager.playSe = function(se) { 
1235         if (this._seVolume <= 0) { 
1236             return; 
1237         } 
1238         _AudioManager_playSe.call(this, se); 
1239     }; 
1240     var _AudioManager_playStaticSe = AudioManager.playStaticSe; 
1241     AudioManager.playStaticSe = function(se) { 
1242         if (this._seVolume <= 0) { 
1243             return; 
1244         } 
1245         _AudioManager_playStaticSe.call(this, se); 
1246     }; 
1247     var _AudioManager_playMe2 = AudioManager.playMe; 
1248     AudioManager.playMe = function(me, isCache) { 
1249         if (this._meVolume <= 0) { 
1250             return; 
1251         } 
1252         _AudioManager_playMe2.call(this, me, isCache); 
1253     }; 
1254     var _AudioManager_playBgs = AudioManager.playBgs; 
1255     AudioManager.playBgs = function(bgs, pos) { 
1256         if (this._bgsVolume <= 0) { 
1257             this.stopBgs(); 
1258             return; 
1259         } 
1260         _AudioManager_playBgs.call(this, bgs, pos); 
1261     }; 
1262     var _AudioManager_playBgm = AudioManager.playBgm; 
1263     AudioManager.playBgm = function(bgm, pos) { 
1264         if (this._bgmVolume <= 0) { 
1265             this._lastVolumeZeroBgm = bgm; 
1266             return; 
1267         } 
1268         _AudioManager_playBgm.call(this, bgm, pos); 
1269     }; 
1270     var _AudioManager_stopBgm = AudioManager.stopBgm; 
1271     AudioManager.stopBgm = function() { 
1272         this._lastVolumeZeroBgm = null; 
1273         _AudioManager_stopBgm.call(this); 
1274     }; 
1275     Object.defineProperty(AudioManager, 'bgmVolume', { 
1276         set: function(value) { 
1277             if (this._bgmVolume <= 0 && value > 0 && this._lastVolumeZeroBgm) { 
1278                 this._bgmVolume = value; 
1279                 this.playBgm(this._lastVolumeZeroBgm, 0); 
1280                 this._lastVolumeZeroBgm = null; 
1281             } else { 
1282                 this._bgmVolume = value; 
1283                 this.updateBgmParameters(this._currentBgm); 
1284             } 
1285         }, 
1286         configurable: true 
1287     }); 
1288 } 
1289 
 
1290 if (parseInt(parameters['usePixiByWindow_BattleLogBg'])) { 
1291     Window_BattleLog.prototype.createBackBitmap = function() { 
1292     }; 
1293 
 
1294     Window_BattleLog.prototype.createBackSprite = function() { 
1295         this._backSprite = new Sprite(); 
1296         this._backSprite.y = this.y; 
1297         this.addChildToBack(this._backSprite); 
1298     }; 
1299     Window_BattleLog.prototype.drawBackground = function() { 
1300         var rect = this.backRect(); 
1301         var color = this.backColor(); 
1302 
 
1303         var graphics = new PIXI.Graphics(); 
1304         graphics.beginFill(Saba.toPixiColor(color), this.backPaintOpacity() / 255/0); 
1305         graphics.drawRect(rect.x, rect.y, rect.width, rect.height); 
1306         graphics.endFill(); 
1307         this._backSprite.addChild(graphics); 
1308     }; 
1309 } 
1310 
 
1311 
 
1312 var _Sprite_refresh = Sprite.prototype._refresh; 
1313 Sprite.prototype._refresh = function() { 
1314     if (! this.texture) { 
1315         return; 
1316     } 
1317     _Sprite_refresh.call(this); 
1318 }; 
1319 
 
1320 
 
1321 })(Saba || (Saba = {})); 
 
