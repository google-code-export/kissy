/*
Copyright (c) 2009, Kissy UI Library. All rights reserved.
MIT Licensed.
http://kissy.googlecode.com/

Date: 2009-09-16 22:52:30
Revision: 148
*/
/**
 * ǰ�����ܼ�ؽű�
 * hubble.js
 * @author: yubo@taobao.com
 */

(function() {

    var API_URL = "http://igw.monitor.taobao.com/monitor-gw/receive.do",
        PAGE_ID = 1000, // Լ����1000 - detail
        SAMPLE_RATE = 10000, // ���������֮һ
        ua = navigator.userAgent,
        startTime = window.HUBBLE_st, // ��ȡҳͷ���Ĳ���ʱ��
        endTime = window.HUBBLE_et || window.HUBBLE_dr, // ��ȡҳβ���Ĳ���ʱ�� ע��HUBBLE_dr �Ǽ�����ǰ�Ĳ���
        //sectionId = "description", // Ҫ��ؼ���ʱ������� id
        sectionMaxImgLoadTime = endTime; // ��������У�������ͼƬ�������ʱ���

    // ������ȡ 0 Ϊ����ֵ
    if(parseInt(Math.random() * SAMPLE_RATE)) return;

    // ��ֵʱ���ż���
    if(!startTime || !endTime) return;

    /**
     * ����¼�
     */
    var addEvent = function(el, type, listener) {
        if (window.attachEvent) {
            el.attachEvent("on" + type, function() {
                listener.call(el);
            });
        } else {
            el.addEventListener(type, listener, false);
        }
    };

    /**
	 * ��ȡ����ϵͳ��Ϣ
	 */
	var getOSInfo = function() {
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
	};

	/**
	 * ��ȡ�������Ϣ
	 */
	var getBrowserInfo = function() {
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
	};

    /**
	 * ��ȡ��Ļ�ֱ���
	 */
	var getScreenInfo = function() {
        var screen = window.screen;
		return screen ? screen.width + "x" + screen.height : "";
	};

    /**
	 * ���ҳ������ļ���ʱ��
	 */
	var monitorSection = function(id) {
        var section = typeof id === "string" ? document.getElementById(id) : id;
        if(!section) return;

        var images = section.getElementsByTagName("img");
        for (var i = 0, len = images.length; i < len; ++i) {
            addEvent(images[i], "load", function() {
                var currTime = +new Date;

                if (currTime > sectionMaxImgLoadTime) {
                    sectionMaxImgLoadTime = currTime;
                }
            });
        }
	};

    /**
     * ��������
     */
    var sendData = function() {
        var onLoadTime = +new Date;
        try {
            new Image().src = [
                API_URL,
                "?page_id=", PAGE_ID,
                "&os=", getOSInfo(), // operation system
                "&bt=", getBrowserInfo(), // browser type
                "&scr=", getScreenInfo(), // screen info
                "&fl=", (onLoadTime - startTime), // full load time
                "&dl=", (endTime - startTime), // dom load time
                "&sl=", (sectionMaxImgLoadTime - endTime) // section load time
            ].join("");
        } catch(ex) {}
    };

    // monitor section
    //if(sectionId) monitorSection(sectionId);

	// onload event
    addEvent(window, "load", sendData);

    // public api
    window.Hubble = {
      monitorSection: monitorSection
    };

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
