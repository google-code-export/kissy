/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-09-17 09:41:41
Revision: 149
*/
/**
 * KISSY.Monitor ǰ�����ܼ�ؽű�
 *
 * @creator     ��<lifesinger@gmail.com>
 * @depends     raw js
 */

var KISSY = window.KISSY || {};

(function() {

    var scripts = document.getElementsByTagName('script'),
        currentScript = scripts[scripts.length - 1],
        ua = navigator.userAgent;

    /**
     * ��ȡԪ��
     */
    function get(id) {
        return typeof id === "string" ? document.getElementById(id) : id;
    }

    /**
     * ����¼�
     */
    function addEvent(el, type, listener) {
        if (window.attachEvent) {
            el.attachEvent("on" + type, function() {
                listener.call(el);
            });
        } else {
            el.addEventListener(type, listener, false);
        }
    }

    /**
	 * ��ȡ����ϵͳ��Ϣ
	 */
	function getOSInfo() {
        // Ref: http://msdn.microsoft.com/en-us/library/ms537503%28VS.85%29.aspx
        var token = [
            // ˳���޹أ�����ռ��������
            ["Windows NT 5.1", "WinXP"],
            ["Windows NT 6.0", "WinVista"],
            ["Windows NT 6.1", "Win7"],
            ["Windows NT 5.2", "Win2003"],
            ["Windows NT 5.0", "Win2000"],
            ["Macintosh", "Macintosh"],
            ["Windows","WinOther"],
            ["Ubuntu", "Ubuntu"],
            ["Linux", "Linux"]
        ];

        for(var i = 0, len = token.length; i < len; ++i) {
            if(ua.indexOf(token[i][0]) != -1) {
                return token[i][1];
            }
        }
        return "Other";
	}

	/**
	 * ��ȡ�������Ϣ
	 */
	function getBrowserInfo() {
        // Ref: http://www.useragentstring.com/pages/useragentstring.php
		var token = [ // ˳���й�
                "Opera", // ĳЩ�汾��αװ�� MSIE, Firefox
                "Chrome", // ĳЩ�汾��αװ�� Safari
                "Safari", // ĳЩ�汾��αװ�� Firefox
                "MSIE 6",
                "MSIE 7",
                "MSIE 8",
                "Firefox"
            ];

		for (var i = 0, len = token.length; i < len; ++i) {
			if(ua.indexOf(token[i]) != -1) {
                return token[i].replace(" ", "");
            }
		}
		return "Other";
	}

    /**
	 * ��ȡ��Ļ�ֱ���
	 */
	function getScreenInfo() {
        var screen = window.screen;
		return screen ? screen.width + "x" + screen.height : "";
	}


    // public api
    KISSY.Monitor = {

        /**
         * ҳͷ���Ĳ���ʱ��
         */
        startTime: 0,

        /**
         * ҳβ���Ĳ���ʱ��
         */
        endTime: 0,


        /**
         * ��������У�������ͼƬ�������ʱ���
         */
        sectionMaxImgLoadTime: 0,

        /**
         * ��ʼ��
         */
        init: function(cfg) {
            var config = cfg || {},
                apiUrl = config["apiUrl"] || "http://igw.monitor.taobao.com/monitor-gw/receive.do",
                pageId = "pageId" in config ? config["pageId"] : 0,
                sampleRate = "sampleRate" in config ? config["sampleRate"] : 10000,
                sections = config["sections"] || [],
                self = this;

            // �� pageId ʱ��������
            if(!pageId) return;

            // ������ȡ 0 Ϊ����ֵ
            if(parseInt(Math.random() * sampleRate)) return;
            
            this.startTime = window["g_ks_monitor_st"]; // ��ȡҳͷ���Ĳ���ʱ��
            if(!this.startTime) return; // ����ʼ����ֵʱ���ż���

            this.endTime = +new Date; // ��ȡҳβ���Ĳ���ʱ�� ע���˴�����Ϊ�ýű����е��˴���ʱ��
            this.sectionMaxImgLoadTime = this.endTime;

            // monitor sections
            if(sections.length > 0) {
                // TODO: ֧�ֶ�� section �ļ��
                this.monitorSection(sections[0]);
            }

            // onload event
            addEvent(window, "load", function() {
                self.sendData(+new Date, apiUrl, pageId);
            });
        },

        /**
         * ���ҳ������ļ���ʱ��
         */
        monitorSection: function(id) {
            var section = get(id);
            if (!section || section.nodeType !== 1) return;

            var images = section.getElementsByTagName("img"), self = this;
            for (var i = 0, len = images.length; i < len; ++i) {
                addEvent(images[i], "load", function() {
                    var currTime = +new Date;
                    if (currTime > self.sectionMaxImgLoadTime) {
                        self.sectionMaxImgLoadTime = currTime;
                    }
                });
            }
        },

        /**
         * ��������
         */
        sendData: function(onLoadTime, apiUrl, pageId) {
            new Image().src = [
                apiUrl,
                "?page_id=", pageId,
                "&os=", getOSInfo(), // operation system
                "&bt=", getBrowserInfo(), // browser type
                "&scr=", getScreenInfo(), // screen info
                "&fl=", (onLoadTime - this.startTime), // full load time
                "&dl=", (this.endTime - this.startTime), // dom load time
                "&sl=", (this.sectionMaxImgLoadTime - this.endTime) // section load time
            ].join("");
        }
    };

    // run it
    try {
        eval(currentScript.innerHTML);
    } catch(ex) { }

})();

/**
 * ע�⣺
 *  1. doScroll �������л���ʱ����׼ȷ�����Ҿ������� onload ����
 *     ����������������ֱ��ȡ����ʱ��
 *     ��Ϊ���ܼ�أ�Ŀǰ fl, dl, rt �Ѿ����Ա��ҳ������
 *
 *  2. ��� js �ǳ��󣬵� js ������ʱ���п�������ͼƬҲ�������������
 *     ��ʱ��ز���ͼƬ�� onload����Ϊ�Ѿ���ɣ�
 *     ������ detail �Ⱦ��󲿷�ҳ����ԣ���������������
 */
