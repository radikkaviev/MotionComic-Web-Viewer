function object(o) {
    var f = object.f, i, len, n, prop;
    f.prototype = o;
    n = new f;
    for (i = 1, len = arguments.length; i < len; ++i)
        for (prop in arguments[i])
            n[prop] = arguments[i][prop];
    return n;
}

object.f = function () { };

$.replaceAll = function (text, searchString, replacement) {
    return text.replace(new RegExp(searchString, "g"), replacement);
};

$.cloneObject = function (source) {
    return $.extend(true, {}, source);
};

var Adv = {};
Adv.plugin = {};

Adv.core = {
    effects: {},
    effects_stop: {},
    effectIdx: 0,
    texts: {},
    name: {
        firstname: "さつき",
        lastname: "如月",
        fullname: "如月 さつき",
    },
    sprites: {},
    animations: {},
    Skippable: true,
    bg_method: "crossfade",
    is_rider: false,
    cache_scenario: {},
    Active: false,
    quakeCount: 0,
    isActive: function () {
        return this.Active;
    },

    isLoadDone: function () {
        return this.LoadScript && this.CmnImgLoad && this.BgImgLoad && this.CharaImgLoad && this.SoundLoad && this.animationLoad && this.CommonImgLoad && this.VideoLoad;
    },

    SoundPathTbl: {},
    BgPathTbl: [],
    CharaPathTbl: [],
    Casecade: [],
    LoadScript: false,
    CmnImgLoad: false,
    BgImgLoad: false,
    CharaImgLoad: false,
    SoundLoad: false,
    VideoLoad: false,
    CommonImgLoad: false,
    animationLoad: false,
    isMouth: false,
    config: {
        skipSpeed: "30",
        autoSpeed: "1300",
        autoSpeedWithText: "60"
    },
    variable: {
        sf: {},
        tf: {}
    },
    tmp: {
        checking_macro: false,
        ready_audio: false,
        audio_context: false,
        num_anim: 0,
        map_bgm: {},
        map_se: {},
        sleep_game: null,
        sleep_game_next: false,
        base_scale: 1,
        is_se_play: false,
        is_se_play_wait: false,
        is_vo_play: false,
        is_vo_play_wait: false,
        is_bgm_play: false,
        is_bgm_play_wait: false,
        is_audio_stopping: false,
        loading_make_ref: false,
        wait_id: "",
        map_chara_talk_top: {},
        video_playing: false
    },
    stat: {
        isBGMove: {},
        bg_move: {},
        isLog: false,
        videoSkip: false,
        voiceAlias: "",
        fade: {
            r: 0,
            g: 0,
            b: 0,
            sa: 0,
            ea: 0,
            isFade: false,
            time: 1000,
            currentTime: 0,
        },
        root: {
            isAni: false,
            isWait: true
        },
        link_start: false,
        scroll: {
            alias: "",
            move: "",
            pos: { x: 0, y: 0 },
            startPos: { x: 0, y: 0 },
            direct: "",
            speed: "",
            isScroll: false
        },
        map_label: {},
        map_macro: {},
        vertical: "false",
        isQuake: "false",
        QuakePos: { x: 0, y: 0 },
        maxBackLogNum: "50",
        f: {},
        mp: {},
        current_layer: "message0",
        current_page: "fore",
        is_stop: false,
        is_wait: false,
        is_trans: false,
        is_wait_anim: false,
        is_strong_stop: false,
        strong_stop_recover_index: 0,
        is_nowait: false,
        current_message_str: "\u30b2\u30fc\u30e0\u30b9\u30bf\u30fc\u30c8",
        current_save_str: "",
        current_keyframe: "",
        map_keyframe: {},
        is_script: false,
        buff_script: "",
        is_html: false,
        map_html: {},
        cssload: {},
        save_img: "",
        stack: {
            "if": [],
            "call": [],
            "macro": []
        },
        set_text_span: false,
        current_scenario: "scene1.ks",
        is_skip: 0,
        is_auto: false,
        is_wait_auto: false,
        current_bgm: "",
        current_bgm_vol: "",
        current_se: {},
        load_auto_next: false,
        enable_keyconfig: true,
        current_bgmovie: {
            storage: "",
            volume: ""
        },
        current_camera: {},
        current_camera_layer: "",
        is_move_camera: false,
        is_wait_camera: false,
        current_line: 0,
        is_hide_message: false,
        is_click_text: false,
        is_adding_text: false,
        flag_ref_page: false,
        ruby_str: "",
        ch_speed: "",
        skip_link: "true",
        log_join: "false",
        log_clear: false,
        f_chara_ptext: "false",
        flag_glyph: "false",
        current_cursor: "auto",
        font: {
            enable: false,
            color: "",
            bold: "",
            size: "",
            face: "",
            italic: ""
        },
        locate: {
            x: 0,
            y: 0
        },
        default_font: {
            color: "",
            bold: "",
            size: "",
            face: "",
            italic: "",
            edge: "",
            shadow: ""
        },
        sysview: {
            save: "./tyrano/html/save.html",
            load: "./tyrano/html/load.html",
            backlog: "./tyrano/html/backlog.html",
            menu: "./tyrano/html/menu.html"
        },
        chara_pos_mode: "true",
        chara_effect: "swing",
        chara_ptext: "",
        chara_time: "600",
        chara_memory: "false",
        chara_anim: "true",
        pos_change_time: "600",
        chara_talk_focus: "none",
        chara_brightness_value: "60",
        chara_blur_value: "2",
        chara_talk_anim: "none",
        chara_talk_anim_time: 230,
        chara_talk_anim_value: 30,
        apply_filter_str: "",
        video_stack: null,
        is_wait_bgmovie: false,
        charas: {},
        jcharas: {},
        play_bgm: true,
        play_se: true,
        map_se_volume: {},
        map_bgm_volume: {},
        map_vo: {
            vobuf: {},
            vochara: {}
        },
        vostart: false,
        log_write: true,
        buff_label_name: "",
        already_read: false,
        visible_menu_button: false,
        title: "",
        bg_map: [],
        chara_wait: {},
        ischaraChange: {}
    },

    init: function (root) {
        if(root)
            this.root = root;
        
        this.BgImgMgr = new ImageManager();
        this.CharaImgMgr = new ImageManager();
        this.SpineMgr = new SpineManager();
        this.SoundMgr = new SoundManager();
        this.CommonImgMgr = new ImageManager();
        this.VideoMgr = new VideoManager();

        this.CmnImgLoad = true;
    },

    endStorage: function () {
        var activeInstanceslength = activeInstances.length;

        for (var i = activeInstanceslength - 1; i >= 0; i--) {
            activeInstances[i].pause();
            activeInstances[i] = null;
            activeInstances.pop();
        }

        this.Active = false;
        this.isStart = true;

        this.parse = null;
        this.tag = null;
        this.exec = null;
        this.LoadScript = false;
        this.BgImgLoad = false;
        this.CharaImgLoad = false;
        this.CommonImgLoad = false;
        this.SoundLoad = false;
        this.VideoLoad = false;
        this.BgPathTbl = [];
        this.CharaPathTbl = [];
        this.VideoPathTbl = [];
        this.CommonPathTbl = [];
        this.SpinePathTbl = [];
        this.SoundPathTbl = [];
        this.charaAni = {};
        this.charaDefine = [];
        this.charaDetail = {};
        this.scenario = null;

        this.BgImgMgr.release();
        this.BgImgMgr = null;

        this.CommonImgMgr.release();
        this.CommonImgMgr = null;

        this.CharaImgMgr.release();
        this.CharaImgMgr = null;

        this.SpineMgr.release();
        this.SpineMgr = null;

        this.SoundMgr.release();
        this.SoundMgr = null;

        this.VideoMgr.release();
        this.VideoMgr = null;

        for (var name in this.sprites) {
            this.sprites[name].destroy(true);
            this.sprites[name] = null;
            delete this.sprites[name];
        }

        this.root.contain.containers["fader"].children[0].clear();
        this.root.contain.containers["fader"].children[0].beginFill((255 << 16 | 255 << 8 | 255), 1 / 255);
        this.root.contain.containers["fader"].children[0].drawRect(0, 0, this.root.size[0], this.root.size[1]);
        this.root.contain.containers["fader"].children[0].endFill();

        this.init();
    },

    end: function () {
        for (var name in this.sprites) {
            this.sprites[name].destroy(true);
            this.sprites[name] = null;
            delete this.sprites[name];
        }

        this.root.contain.containers["fader"].children[0].clear();
        this.root.contain.containers["fader"].children[0].beginFill((0 << 16 | 0 << 8 | 0), 0);
        this.root.contain.containers["fader"].children[0].drawRect(0, 0, this.root.size[0], this.root.size[1]);
        this.root.contain.containers["fader"].children[0].endFill();
    },

    StartAdv: function (lists) {
        this.endStorage();

        this.Active = true;
        this.stat.is_skip = 0;

        this.parse = object(AdvTag.plugin.parse);
        this.tag = object(AdvTag.plugin.tag);
        this.exec = object(AdvTag.plugin.exec);
        this.exec.parent = this;
        this.exec.init();

        this.scenarios = {};

        for (var name in lists) {
            this.cache_scenario[name] = this.parse.parseScenario(lists[name]);
        }

        var query = QueryString.parse(location.search.substr(1));
        var parseScenario = lists["main"];
        this.LoadScript = true;

        this.charaDetail = [];
        this.charaAni = [];
        this.charaDefine = [];

        this.scenario = this.parse.parseScenario(parseScenario);
        this.scenario.link_label = [];

        this.SoundMgr = new SoundManager();

        var islink = false;
        for (var name in this.cache_scenario) {
            var scenario = this.cache_scenario[name];

            for (var iCount = 0; iCount < scenario.array_s.length; iCount++) {
                if (scenario.array_s[iCount].name === "link") {
                    if (!islink) {
                        scenario.link_label.push(iCount);
                    }

                    if (scenario.array_s[iCount].name === "s") {
                        islink = false;
                    }

                    else
                        islink = true;

                }

                if (["playbgm", "playse", "playvoice"].indexOf(scenario.array_s[iCount].name) !== -1) {
                    var filename = scenario.array_s[iCount].pm.name;

                    if (scenario.array_s[iCount].pm.audio === undefined) {
                        if (scenario.array_s[iCount].name === "playbgm") {
                            scenario.array_s[iCount].pm.audio = "http://circle-dev.success-corp.jp:7000/scr_resource/" + "Sound/bgm/" + filename;
                        }

                        else if (scenario.array_s[iCount].name === "playse") {
                            scenario.array_s[iCount].pm.audio = "http://circle-dev.success-corp.jp:7000/scr_resource/" + "Sound/se/" + filename;
                        }

                        else {
                            scenario.array_s[iCount].pm.audio = "http://circle-dev.success-corp.jp:7000/scr_resource/" + "Sound/voice/" + filename;
                        }


                    }

                    var last = scenario.array_s[iCount].pm.audio.lastIndexOf("resource/")
                    this.SoundPathTbl.push(scenario.array_s[iCount].pm.audio.substr(last, scenario.array_s[iCount].pm.audio.length));
                    this.SoundPathTbl = this.SoundPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);
                }

                if (scenario.array_s[iCount].name === "bg") {
                    this.BgPathTbl.push("http://circle-dev.success-corp.jp:7000/scr_resource/Img/" + "ADV/BG/" + scenario.array_s[iCount].pm.file);
                    this.BgPathTbl = this.BgPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);
                }

                if (scenario.array_s[iCount].name === "bg_show") {
                    if (scenario.array_s[iCount].pm.image !== undefined) {
                        var last = scenario.array_s[iCount].pm.image.lastIndexOf("resource/")
                        this.BgPathTbl.push(scenario.array_s[iCount].pm.image.substr(last, scenario.array_s[iCount].pm.image.length));
                        this.BgPathTbl = this.BgPathTbl.reduce(function (a, b) {
                            if (a.indexOf(b) < 0)
                                a.push(b);

                            return a;
                        }, []);
                    }
                }

                if (scenario.array_s[iCount].name === "playvideo") {
                    var last = scenario.array_s[iCount].pm.video.lastIndexOf("resource/")
                    this.VideoPathTbl.push(scenario.array_s[iCount].pm.video.substr(last, scenario.array_s[iCount].pm.video.length));

                    this.VideoPathTbl = this.VideoPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);
                }

                if (scenario.array_s[iCount].name === "chara_mod" || scenario.array_s[iCount].name === "chara_show") {
                    if (scenario.array_s[iCount].pm.image !== undefined)
                    {
                        var last = scenario.array_s[iCount].pm.image.lastIndexOf("resource/")
                        this.CharaPathTbl.push(scenario.array_s[iCount].pm.image.substr(last, scenario.array_s[iCount].pm.image.length));
                    }
                        
                    this.CharaPathTbl = this.CharaPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);

                    if (this.charaDetail[scenario.array_s[iCount].pm.name] === undefined)
                        this.charaDetail[scenario.array_s[iCount].pm.name] = [];


                    if (scenario.array_s[iCount].name === "chara_mod")
                    {
                        var last = scenario.array_s[iCount].pm.face.lastIndexOf("resource/")
                        this.CharaPathTbl.push(scenario.array_s[iCount].pm.face.substr(last, scenario.array_s[iCount].pm.face.length));
                    }
                        

                    this.charaDetail[scenario.array_s[iCount].pm.name].push(scenario.array_s[iCount].pm.face);
                    this.charaDetail[scenario.array_s[iCount].pm.name] = this.charaDetail[scenario.array_s[iCount].pm.name].reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);
                }

                if (scenario.array_s[iCount].name === "test") {
                    var images = listFiles(scenario.array_s[iCount].pm.package).images;

                    for (var i = 0; i < images.length; i++) {
                        this.CharaPathTbl.push(images[i]);
                    }

                    this.CharaPathTbl = this.CharaPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);
                }

                if (scenario.array_s[iCount].name === "spine") {
                   this.SpinePathTbl.push(scenario.array_s[iCount].pm.name);
                }

                if (scenario.array_s[iCount].name === "select") {
                    var last = scenario.array_s[iCount].pm.image.lastIndexOf("resource/")
                    this.CommonPathTbl.push(scenario.array_s[iCount].pm.image.substr(last, scenario.array_s[iCount].pm.image.length));
                    this.CommonPathTbl = this.CommonPathTbl.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);

                        return a;
                    }, []);

                }
            }
        }
        this.defineCount = 0;
        this.DefineLoad();
    },

    DefineLoad: function () {
        if (this.charaDefine.length === 0) {
            this.ResourceLoad();
        }

        else {
            $.ajax({
                type: "GET",
                url: RESOURCE_URI + "./Define/" + this.charaDefine[this.defineCount].file + ".ssk",
                success: function (json) {
                    this.currentDefine = this.charaDefine[this.defineCount];
                    var parse = this.parse.parseScenario(json);

                    if (this.charaDetail[this.currentDefine.name]) {
                        var length = parse.array_s.length;
                        for (var iCount = 0; iCount < length; iCount++) {
                            if (this.charaDetail[this.currentDefine.name].indexOf(parse.array_s[iCount].pm.face) !== -1) {
                                this.CharaPathTbl.push("http://circle-dev.success-corp.jp:7000/scr_resource/Img/" + "ADV/Chara/" + parse.array_s[iCount].pm.file);

                                if (parse.array_s[iCount].pm.ani !== undefined) {
                                    if (this.charaAni[this.currentDefine.name] === undefined)
                                        this.charaAni[this.currentDefine.name] = {};

                                    if (this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face] === undefined)
                                        this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face] = {};

                                    if (this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face][parse.array_s[iCount].pm.ani] === undefined)
                                        this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face][parse.array_s[iCount].pm.ani] = [];

                                    this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face][parse.array_s[iCount].pm.ani].push(parse.array_s[iCount].pm.file);

                                    this.stat.chara_wait[this.currentDefine.name] = true;
                                    this.stat.ischaraChange[this.currentDefine.name] = false;
                                }

                                else {
                                    if (this.charaAni[this.currentDefine.name] === undefined)
                                        this.charaAni[this.currentDefine.name] = {};

                                    if (this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face] === undefined)
                                        this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face] = {};

                                    this.charaAni[this.currentDefine.name][parse.array_s[iCount].pm.face]["sprite"] = parse.array_s[iCount].pm.file;
                                }
                            }
                        }
                    }

                    this.defineCount++;

                    if (this.defineCount === this.charaDefine.length)
                        this.ResourceLoad();
                    else
                        this.DefineLoad();

                }.bind(this),
                error: function () {
                    console.log("error");
                }
            });
        }

    },

    ResourceLoad: function () {
        this.BgPathTbl = this.BgPathTbl.reduce(function (a, b) {
            if (a.indexOf(b) < 0)
                a.push(b);

            return a;
        }, []);

        this.CharaPathTbl = this.CharaPathTbl.reduce(function (a, b) {
            if (a.indexOf(b) < 0)
                a.push(b);

            return a;
        }, []);

        if (Object.keys(this.SoundPathTbl).length <= 0) {
            this.SoundLoad = true;
        }

        else {
            this.SoundMgr.add(this.SoundPathTbl)
                .load(function () { this.SoundLoad = true; }.bind(this));
        }

        if (this.BgPathTbl.length <= 0) {
            this.BgImgLoad = true;
        }

        else {
            this.BgImgMgr.add(this.BgPathTbl)
                .load(function () { this.BgImgLoad = true; }.bind(this));
        }

        if (this.CommonPathTbl.length <= 0) {
            this.CommonImgLoad = true;
        }

        else {
            this.CommonImgMgr.add(this.CommonPathTbl).load(function () { this.CommonImgLoad = true; }.bind(this));
        }

        if (this.CharaPathTbl.length <= 0) {
            this.CharaImgLoad = true;
        }

        else {
            this.CharaImgMgr.add(this.CharaPathTbl).load(function () { this.CharaImgLoad = true; }.bind(this));
        }

        if (this.VideoPathTbl.length <= 0) {
            this.VideoLoad = true;
        }

        else {
            this.VideoMgr.add(this.VideoPathTbl).load(function () { this.VideoLoad = true; }.bind(this));
        }

        if(this.SpinePathTbl.length <= 0)
        {
            this.animationLoad = true;
        }

        else
        {
            this.SpineMgr.add(this.SpinePathTbl).load(function () { this.animationLoad = true; }.bind(this));
        }
    },

    isStart: true,

    Start: function () {
        var tag_obj = this.scenario.array_s;
        var map_label = this.scenario.map_label;
        this.stat.map_label = map_label;
        this.stat.is_strong_stop = false;

        var array_tag = $.extend(true, [], tag_obj);
        if (typeof insert == "object") array_tag.splice(index + 1, 0, insert);
        
        this.exec.buildTagIndex(array_tag, this.exec.current_order_index, "yes");
    },

    Update: function ( deltatime ) {
        if (this.isStart) {
            this.isStart = false;
            this.Start();
        }

        for(var name in Adv.core.effects)
        {
            Adv.core.effects[name].draw( deltatime );
        }
    }
};

Adv.core.CmnImgLoad = false;

Adv.core.CmnImgLoadSuccess = function () {
    Adv.core.CmnImgLoad = true;
};