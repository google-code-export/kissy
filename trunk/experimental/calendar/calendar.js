/**
 * ����yahoo-dom-event.js,element.js,kissy.js
 */
KISSY.add('calendar', function(S) {

/**
 *  ȫ�ֶ���ļ�д
 */
Y = YAHOO;
$D = Y.util.Dom;
$E = Y.util.Event;
/**
 * calendar.js | �����ؼ� ����yui2 & kissy
 * autohr:lijing00333@163.com �γ�
 * �ļ����� gbk
 * @class Calendar
 * @param { string } �������ߴ���id 
 * @param { object } ������
 * @return { object } ����һ��calendarʵ��
 * @requires { 'element','selector','dom','event','calendar-skin' }
 * @requires { calendar-skin-default } Ƥ��
 * 
 * Y.Calenar��	
 *	˵����	������������ͨ��new Calendar��renderһ������
 *	ʹ�ã�	new Calendar(id,options);
 *	����:	id:{string}����id
 *	���ã�	selected {date} ѡ�е�����
 *			mindate:{date} ��С��ѡ����
 *			maxdate:{date} ����ѡ����
 *			popup:{boolean} �Ƿ񵯳���Ĭ��false
 *			closeable:{boolean} �Ƿ�ѡ�رգ�����״̬�������ã���Ĭ��Ϊfalse
 *			range_select:{boolean} �Ƿ�ѡ��Χ��Ĭ��Ϊfalse
 *			range:{start:date,end:date} Ĭ��ѡ��Χ
 *			multi_select:{number} ����ҳ����Ĭ��Ϊ1
 *			date:{date} Ĭ����ʾ���������ڵ��·ݣ�Ĭ��Ϊ����
 *			navigator:{boolean} �Ƿ����ѡ����ת���·ݣ�Ĭ��Ϊtrue
 *		Calendar��ʵ���ķ�����
 *			init:��ʼ��������Ϊoptions
 *			render:��Ⱦ��init��new��ʱ����ã�render����������ʱ����ʱ�̵��ã�����Ϊoptions�����Ա�ɸ���ԭ����
 *			hide:���أ�����ɾ������
 *			show:��ʾ����
 *		
 */

/**
 * @namespace Calendar
 * Լ�������ռ�
 */
Y.namespace("Calendar");
Calendar = function(){
	this.init.apply(this,arguments);
};
S.mix(Calendar.prototype, { 
	/**
	 * @constructor init
	 * ������
	 * ��ʼ����ʱ�����
	 */
	init:function(id,config){

		var that = this;
		that.id = that.C_Id = id;
		//��������б�
		that.buildParam(config);
		/*
			Calendarʵ���еĹؼ�ֵ
			that.con������������
			that.id   ��������id
			that.C_Id ��Զ��������������ID
		*/
		//�ǵ�����������������
		if(!that.popup){
			that.con = new Y.util.Element(id);
		} else {
		//������������������
			var trigger = new Y.util.Element(id);
			that.trigger = trigger;
			that.C_Id = 'C_'+Math.random().toString().replace(/.\./i,'');
			var t_node = document.createElement("div");
			t_node.id = that.C_Id;
			document.getElementsByTagName('body')[0].appendChild(t_node);
			that.con = new Y.util.Element(that.C_Id);
			//Ĭ�����ص�������������
			that.con.setStyle('top','0px');
			that.con.setStyle('position','absolute');
			that.con.setStyle('background','white');
			that.con.setStyle('visibility','hidden');
		}
		//�����¼�����
		that.buildEventCenter();
		//��Ⱦ����
		that.render();
		//�����¼�
		that.buildEvent();
		//���ر���
		return this;
	},
	/**
	 * @method buildEventCenter
	 * �����Զ����¼����Լ��¼�����
	 */
	buildEventCenter:function(){
		var that = this;
		that.EventCenter = {};
		var EventFactory = function(events){
			for(var i = 0;i<events.length;i++){
				var event_type = events[i];
				that.EventCenter[event_type] = new Y.util.CustomEvent(event_type);
			}
		};
		//�Զ����¼�����
		EventFactory(['select','switch','rangeselect','timeselect','selectcomplete','hide','show']);
		return this;
	},
	/**
	 * @method on
	 * ���¼��ӿ�
	 */
	on:function(type,foo){
		var that = this;
		that.EventCenter[type].subscribe(function(type,args){
			foo.apply(foo,args);
		});
		return this;
	},
	/**
	 * @method render
	 * ��Ⱦ�������
	 */
	render:function(o){
		var that = this;
		var o = o || {};
		that.parseParam(o);
		that.ca = [];

		that.con.addClass('c-call clearfix multi-'+that.multi_page);
		that.con.set('innerHTML','');

		for(var i = 0,_oym = [that.year,that.month]; i<that.multi_page;i++){
			if(i == 0){
				var _prev = true;
			}else{
				var _prev = false;
				_oym = that.computeNextMonth(_oym);
			}
			if(i == (that.multi_page - 1)){
				var _next = true;
			}else {
				var _next = false;	
			}
			that.ca.push(new that.Call({
				year:_oym[0],
				month:_oym[1],
				prev_arrow:_prev,
				next_arrow:_next,
				withtime:that.withtime
			},that));

			//��Ⱦ�����ں�
			that.ca[i].render();
		}
		return this;

	},
	/**
	 * @method showdate
	 * ����d���ǰ������ߺ��죬����date,chrome�²�֧��date����ʱ�������
	 */
	showdate:function(n,d){
		var uom = new Date(d-0+n*86400000);
		uom = uom.getFullYear() + "/" + (uom.getMonth()+1) + "/" + uom.getDate();
		return new Date(uom);
	},
	/**
	 * @method buildEvent
	 * �����¼�
	 */
	buildEvent:function(){
		var that = this;
		if(!that.popup)return this;
		//����հ�
		$E.on(document,'click',function(e){
			var el = $E.getTarget(e);
			if(el.id == that.C_Id)return;

			if(!$D.isAncestor($D.get(that.C_Id),el)){
				that.hide();
			}
			
		});
		//�������
		$E.on(that.id,'click',function(e){
			$E.stopEvent(e);
			if(that.con.getStyle('visibility') == 'hidden'){
				that.show();
			}else{
				that.hide();
			}
			
		})
		return this;
	},
	/**
	 * @method show
	 * ��ʾ����
	 */
	show:function(){
		var that = this;
		that.con.setStyle('visibility','');
		var _x = $D.getXY(that.trigger.get('id'))[0];
		var _y = $D.getXY(that.trigger.get('id'))[1]+Number($D.getRegion(that.trigger.get('id')).height);
		that.con.setStyle('left',_x.toString()+'px');
		that.con.setStyle('top',_y.toString()+'px');
		return this;
	},
	/**
	 * @method hide 
	 * ��������
	 */
	hide:function(){
		var that = this;
		that.con.setStyle('visibility','hidden');
		return this;
	},
	/**
	 * @method buildParam
	 * ��������
	 */
	buildParam:function(o){
		var that = this;
		if(typeof o == 'undefined' || o == null){
			var o = {};
		}
		that.date = (typeof o.date == 'undefined' || o.date == null)?new Date():o.date;
		that.selected = (typeof o.selected == 'undefined' || o.selected == null)?that.date:o.selected;
		that.multi_page = (typeof o.multi_page == 'undefined' || o.multi_page == null)?1:o.multi_page;
		that.closeable = (typeof o.closeable == 'undefined' || o.closeable == null)?false:o.closeable;
		that.range_select = (typeof o.range_select == 'undefined' || o.range_select == null)?false:o.range_select;
		that.mindate = (typeof o.mindate == 'undefined' || o.mindate == null)?false:o.mindate;
		that.maxdate = (typeof o.maxdate == 'undefined' || o.maxdate == null)?false:o.maxdate;
		that.multi_select = (typeof o.multi_select== 'undefined' || o.multi_select == null)?false:o.multi_select;
		that.navigator = (typeof o.navigator == 'undefined' || o.navigator == null)?true:o.navigator;
		that.arrow_left = (typeof o.arrow_left == 'undefined' || o.arrow_left == null)?false:o.arrow_left;
		that.arrow_right = (typeof o.arrow_right == 'undefined' || o.arrow_right == null)?false:o.arrow_right;
		that.popup = (typeof o.popup == 'undefined' || o.popup== null)?false:o.popup;
		that.withtime = (typeof o.withtime == 'undefined' || o.withtime == null)?false:o.withtime;
		that.action = (typeof o.action == 'undefined' || o.action == null)?['click']:o.action;
		if(typeof o.range != 'undefined' && o.range != null){
			var s = that.showdate(1,new Date(o.range.start.getFullYear()+'/'+(o.range.start.getMonth()+1)+'/'+(o.range.start.getDate())));
			var e = that.showdate(1,new Date(o.range.end.getFullYear()+'/'+(o.range.end.getMonth()+1)+'/'+(o.range.end.getDate())));
			that.range = {
				start:s,
				end:e
			};
		}else {
			that.range = {
				start:null,
				end:null
			};
		}
		return this;
	},
	/**
	 * @method parseParam
	 * ���¹�������
	 */
	parseParam:function(o){
		var that = this;
		if(typeof o == 'undefined' || o == null){
			var o = {};
		}
		for(var i in o){
			that[i] = o[i];
		}
		that.handleDate();
		return this;
	},
	//�õ��µ�����
	getNumOfDays:function(year,month){
		return 32-new Date(year,month-1,32).getDate();
	},
	//ģ�庯��
	templetShow : function(templet, data){
		var that = this;
		if(data instanceof Array){
			var str_in = '';
			for(var i = 0;i<data.length;i++){
				str_in += that.templetShow(templet,data[i]);
			}
			templet = str_in;
		}else{
			var value_s = templet.match(/{\$(.*?)}/g);
			if(data !== undefined && value_s != null){
				for(var i=0, m=value_s.length; i<m; i++){
					var par = value_s[i].replace(/({\$)|}/g, '');
					value = (data[par] !== undefined) ? data[par] : '';
					templet = templet.replace(value_s[i], value);
				}
			}
		}
		return templet;
	},
	/**
	 * @method handleDate
	 �� ��������������
	 */
	handleDate:function(){
		/*
		������ĳ�Ա����
		that.month
		that.year
		that.selected
		that.mindate
		that.maxdate
		*/
		var that = this;
		var date = that.date;
		that.weekday= date.getDay() + 1;//���ڼ� //ָ�����������ڼ�
		that.day = date.getDate();//����
		that.month = date.getMonth();//�·�
		that.year = date.getFullYear();//���
		return this;
	},
	//get����
	getHeadStr:function(year,month){
		return year.toString() + '��' + (Number(month)+1).toString() + '��';
	},
	//�¼�
	monthAdd:function(){
		var that = this;
		if(that.month == 11){
			that.year++;
			that.month = 0;
		}else{
			that.month++;
		}
		that.date = new Date(that.year.toString()+'/'+(that.month+1).toString()+'/'+that.day.toString());
		return this;
	},
	//�¼�
	monthMinus:function(){
		var that = this;
		if(that.month == 0){
			that.year-- ;
			that.month = 11;
		}else{
			that.month--;
		}
		that.date = new Date(that.year.toString()+'/'+(that.month+1).toString()+'/'+that.day.toString());
		return this;
	},
	//������һ���µ�����,[2009,11],��:fullYear����:��0��ʼ����
	computeNextMonth:function(a){
		var that = this;
		var _year = a[0];
		var _month = a[1];
		if(_month == 11){
			_year++;
			_month = 0;
		}else{
			_month++;
		}
		return [_year,_month];
	},
	//������ʼ����,d:Date����
	handleRange : function(d){
		var that = this;
		var d = that.showdate(1,d);
		if((that.range.start == null && that.range.end == null )||(that.range.start != null && that.range.end != null)){
			that.range.start = d;
			that.range.end = null;
			that.render();
		}else if(that.range.start != null && that.range.end == null){
			that.range.end = d;
			if(that.range.start.getTime() > that.range.end.getTime()){
				var __t = that.range.start;
				that.range.start = that.range.end;
				that.range.end = __t;
			}else{
				if(/532/.test(Y.env.ua.webkit)){//hack for chrome
					that.range.start = that.showdate(-1,that.range.start);
				}
			}
			that.EventCenter['rangeselect'].fire(that.range);
			that.render();
		}
		return this;

	},
	//constructor 
	/**
	 * TimeSelectorֻ֧��ѡ�񣬲�֧�ֳ�ʼ��
	 */
	TimeSelector:function(ft,fathor){
		//����------------------
		this.fathor = fathor;
		//this.fcon = ft.ancestor('.c-box');//cc����
		this.fcon = $D.getAncestorByClassName(ft,'c-box');
			//var con = new Y.util.Element(cc.id);
		
		this.popupannel = new Y.util.Element($D.getElementsByClassName('selectime','div',this.fcon)[0]);
		
		
		//this.fcon.query('.selectime');//��ѡʱ��ĵ�����



		if(typeof fathor._time == 'undefined'){//ȷ����ʼֵ�͵�ǰʱ��һ��
			fathor._time = new Date();
		}
		this.time = fathor._time;
		this.status = 's';//��ǰѡ���״̬��'h','m','s'�����жϸ����ĸ�ֵ
		var _el = document.createElement('div');
		_el.className = 'c-time';
		_el.innerHTML = 'ʱ�䣺<span class="h">h</span>:<span class="m">m</span>:<span class="s">s</span><!--{{arrow--><div class="cta"><button class="u"></button><button class="d"></button></div><!--arrow}}-->';
		this.ctime = new Y.util.Element(_el);
		var _bn = document.createElement('button');
		_bn.className = 'ct-ok';
		_bn.innerHTML = 'ȷ��';
		this.button = new Y.util.Element(_bn);
		//this.button = Y.Node.create('<button class="ct-ok">ȷ��</button>');
		//Сʱ
		this.h_a = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
		//����
		this.m_a = ['00','10','20','30','40','50'];
		//��
		this.s_a = ['00','10','20','30','40','50'];
				

		//�ӿ�----------------
		/**
		 * ������Ӧ������html��ֵ��������a��
		 * ������Ҫƴװ������
		 * ���أ�ƴ�õ�innerHTML,��β��Ҫ��һ���رյ�a
		 * 
		 */
		this.parseSubHtml = function(a){
			var in_str = '';
			for(var i = 0;i<a.length;i++){
				in_str += '<a href="javascript:void(0);" class="item">'+a[i]+'</a>';
			}
			in_str += '<a href="javascript:void(0);" class="x">x</a>';
			return in_str;
		};
		/**
		 * ��ʾselectime����
		 * ����������õ�innerHTML
		 */
		this.showPopup= function(instr){
			var that = this;
			this.popupannel.set('innerHTML',instr);
			
			this.popupannel.removeClass('hidden');
			var status = that.status;
			var _con = that.ctime;
			new Y.util.Element($D.getElementsByClassName('h','span',that.ctime)[0]).removeClass('on');
			new Y.util.Element($D.getElementsByClassName('m','span',that.ctime)[0]).removeClass('on');
			new Y.util.Element($D.getElementsByClassName('s','span',that.ctime)[0]).removeClass('on');
			switch(status){
				case 'h':
					new Y.util.Element($D.getElementsByClassName('h','span',that.ctime)[0]).addClass('on');
					break;
				case 'm':
					new Y.util.Element($D.getElementsByClassName('m','span',that.ctime)[0]).addClass('on');
					break;
				case 's':
					new Y.util.Element($D.getElementsByClassName('s','span',that.ctime)[0]).addClass('on');
					break;
			}
		};
		/**
		 * ����selectime����
		 */
		this.hidePopup= function(){
			var that = this;
			that.popupannel.addClass('hidden');
		};
		/**
		 * ������������������ļ��裬��������time��ʾ����
		 */
		this.render = function(){
			var that = this;
			var h = that.get('h');
			var m = that.get('m');
			var s = that.get('s');
			that.fathor._time = that.time;
			$D.getElementsByClassName('h','span',that.ctime)[0].innerHTML = h;
			$D.getElementsByClassName('m','span',that.ctime)[0].innerHTML = m;
			$D.getElementsByClassName('s','span',that.ctime)[0].innerHTML = s;
			return that;
		};
		//�����set��get��ֻ�Ƕ�time�Ĳ��������������������������
		/**
		 * set(status,v)
		 * h:2,'2'
		 */
		this.set = function(status,v){
			var that = this;
			var v = Number(v);
			switch(status){
				case 'h':
					that.time.setHours(v);
					break;
				case 'm':
					that.time.setMinutes(v);
					break;
				case 's':
					that.time.setSeconds(v);
					break;
			}
			that.render();
		};
		/**
		 * get(status)
		 */
		this.get = function(status){
			var that = this;
			var time = that.time;
			switch(status){
				case 'h':
					return time.getHours();
					break;
				case 'm':
					return time.getMinutes();
					break;
				case 's':
					return time.getSeconds();
					break;
			}
		};

		/**
		 * add()
		 * ״ֵ̬����ı�����1
		 */
		this.add = function(){
			var that = this;
			var status = that.status;
			var v = that.get(status);
			v++;
			that.set(status,v);
		};
		/**
		 * minus()
		 * ״ֵ̬����ı�����1
		 */
		this.minus= function(){
			var that = this;
			var status = that.status;
			var v = that.get(status);
			v--;
			that.set(status,v);
		};
		

		
		//����---------
		this.init = function(){
			var that = this;
			ft.set('innerHTML','');
			ft.appendChild(that.ctime);
			ft.appendChild(that.button);
			that.render();
			that.popupannel.on('click',function(e){
				var el = new Y.util.Element($E.getTarget(e));
				//var el = e.target;
				if(el.hasClass('x')){//�ر�
					that.hidePopup();
					return;
				}else if(el.hasClass('item')){//��ѡһ��ֵ
					var v = Number(el.get('innerHTML'));
					that.set(that.status,v);
					that.hidePopup();
					return;
				}
			});
			//ȷ���Ķ���
			that.button.on('click',function(e){
				var d = that.fathor.date;
				d.setHours(that.get('h'));
				d.setMinutes(that.get('m'));
				d.setSeconds(that.get('s'));
				//that.fathor.EventCenter.fire('timeselect',d);
				that.fathor.EventCenter['timeselect'].fire(d);
				if(that.fathor.popup && that.fathor.closeable){
					that.fathor.hide();
				}
			});
			//ctime�ϵļ����¼������¼������Ҽ��ļ���
			//TODO �����Ƿ�ȥ��
			/*
			that.ctime.on('keyup',function(e){
				if(e.keyCode == 38 || e.keyCode == 37){//up or left
					e.halt();
					that.add();
				}
				if(e.keyCode == 40 || e.keyCode == 39){//down or right
					e.halt();
					that.minus();
				}
			});
			*/
			//�ϵļ�ͷ����
			$E.on($D.getElementsByClassName('u','button',that.ctime)[0],'click',function(e){
				that.hidePopup();
				that.add();
			});
			//�µļ�ͷ����
			$E.on($D.getElementsByClassName('d','button',that.ctime)[0],'click',function(e){
				that.hidePopup();
				that.minus();
			});
			//����ѡ��Сʱ
			$E.on($D.getElementsByClassName('h','span',that.ctime)[0],'click',function(e){
				var in_str = that.parseSubHtml(that.h_a);
				that.status = 'h';
				that.showPopup(in_str);
			});
			//����ѡ�����
			$E.on($D.getElementsByClassName('m','span',that.ctime)[0],'click',function(e){
				var in_str = that.parseSubHtml(that.m_a);
				that.status = 'm';
				that.showPopup(in_str);
			});
			//����ѡ����
			$E.on($D.getElementsByClassName('s','span',that.ctime)[0],'click',function(e){
				var in_str = that.parseSubHtml(that.s_a);
				that.status = 's';
				that.showPopup(in_str);
			});
			


		};
		this.init();


	},
	/**
	 * @constructor Call
	 * �����ں˵Ĺ�����,���Թ��쵥���������岢���������岿�ֵ��¼�
	 */
	Call:function(config,fathor){
		//����
		this.fathor = fathor;
		this.month = Number(config.month);
		this.year = Number(config.year);
		this.prev_arrow = config.prev_arrow;
		this.next_arrow = config.next_arrow;
		this.node = null;
		this.id = '';
		this.EV = [];
		this.html = [
			//'<div class="c-box" id="{$id}">',
				'<div class="c-hd">', 
					'<a href="javascript:void(0);" class="prev {$prev}"><</a>',
					'<a href="javascript:void(0);" class="title">{$title}</a>',
					'<a href="javascript:void(0);" class="next {$next}">></a>',
				'</div>',
				'<div class="c-bd">',
					'<div class="whd">',
						'<span>��</span>',
						'<span>һ</span>',
						'<span>��</span>',
						'<span>��</span>',
						'<span>��</span>',
						'<span>��</span>',
						'<span>��</span>',
					'</div>',
					'<div class="dbd clearfix">',
						'{$ds}',
						/*
						<a href="" class="null">1</a>
						<a href="" class="disabled">3</a>
						<a href="" class="selected">1</a>
						<a href="" class="today">1</a>
						<a href="">1</a>
					*/
					'</div>',
				'</div>',
				'<div class="setime hidden">',
				'</div>',
				'<div class="c-ft {$showtime}">',
					'<div class="c-time">',
						'ʱ�䣺00:00 	&hearts;',
					'</div>',
				'</div>',
				'<div class="selectime hidden"><!--���Դ�ŵ�ѡʱ���һЩ�ؼ�ֵ-->',
				'</div>'
			//'</div><!--#c-box-->'
		].join("");
		this.nav_html = [
				'<p>',
				'��',
					'<select value="{$the_month}">',
						'<option class="m1" value="1">01</option>',
						'<option class="m2" value="2">02</option>',
						'<option class="m3" value="3">03</option>',
						'<option class="m4" value="4">04</option>',
						'<option class="m5" value="5">05</option>',
						'<option class="m6" value="6">06</option>',
						'<option class="m7" value="7">07</option>',
						'<option class="m8" value="8">08</option>',
						'<option class="m9" value="9">09</option>',
						'<option class="m10" value="10">10</option>',
						'<option class="m11" value="11">11</option>',
						'<option class="m12" value="12">12</option>',
					'</select>',
				'</p>',
				'<p>',
				'��',
					'<input type="text" value="{$the_year}" onfocus="this.select()"></input>',
				'</p>',
				'<p>',
					'<button class="ok">ȷ��</button><button class="cancel">ȡ��</button>',
				'</p>'
		].join("");


		//����
		/**
		 * @method renderUI
		 * Call�ķ���
		 * ��ȾUI
		 */
		this.renderUI = function(){
			var cc = this;
			cc.HTML = '';
			var _o = {};
			_o.prev = '';
			_o.next = '';
			_o.title = '';
			_o.ds = '';
			if(!cc.prev_arrow){
				_o.prev = 'hidden';
			}
			if(!cc.next_arrow){
				_o.next = 'hidden';
			}
			if(!cc.fathor.showtime){
				_o.showtime = 'hidden';
			}
			_o.id = cc.id = 'cc-'+Math.random().toString().replace(/.\./i,'');
			_o.title = cc.fathor.getHeadStr(cc.year,cc.month);
			cc.createDS();
			_o.ds = cc.ds;
			var _html = cc.fathor.con.get('innerHTML');
			var _next_cc_body = document.createElement('div');
			_next_cc_body.innerHTML = cc.fathor.templetShow(cc.html,_o);
			_next_cc_body.className = 'c-box';
			_next_cc_body.id = _o.id;
			cc.fathor.con.appendChild(_next_cc_body);
			cc.node = new Y.util.Element(cc.id);
			if(cc.fathor.withtime){
				var ft = new Y.util.Element($D.getElementsByClassName('c-ft','div',cc.id)[0]);
				ft.removeClass('hidden');
				cc.timmer = new cc.fathor.TimeSelector(ft,cc.fathor);
			}
			return this;
		};
		/**
		 * @method buildEvent
		 * Call�ķ���
		 * ���¼�
		 */
		this.buildEvent = function(){
			var cc = this;
			var con = new Y.util.Element(cc.id);
			var setime_node = new Y.util.Element($D.getElementsByClassName('setime','div',cc.id)[0]);
			//�������
			//flush event
			$E.purgeElement($D.getElementsByClassName('dbd','div',con.get('id')));
			$E.on($D.getElementsByClassName('dbd','div',con.get('id')),'click',function(e){
				$E.stopEvent(e);
				var el = $E.getTarget(e);
				if($D.hasClass(el,'null'))return;
				if($D.hasClass(el,'disabled'))return;
				var selectedd = Number(el.innerHTML);
				/*
				//��opera10.5�У�setDate,setMonth,setYear����ʧЧ
				var d = new Date();
				d.setDate(selectedd);
				d.setMonth(cc.month);
				d.setYear(cc.year);
				*/
				var d = new Date(cc.year+'/'+(cc.month+1)+'/'+selectedd);
				cc.fathor.date = d;
				cc.fathor.EventCenter['select'].fire(d);
				if(cc.fathor.popup && cc.fathor.closeable){
					cc.fathor.hide();
				}
				if(cc.fathor.range_select){
					cc.fathor.handleRange(d);
				}
				cc.fathor.render({selected:d});
			});

			//��ǰ
			$E.purgeElement($D.getElementsByClassName('prev','a',con.get('id')), false, "click");
			$E.on($D.getElementsByClassName('prev','a',con.get('id')),'click',function(e){
				$E.stopEvent(e);
				cc.fathor.monthMinus().render();
				cc.fathor.EventCenter['switch'].fire(new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
			});
			//���
			$E.purgeElement($D.getElementsByClassName('next','a',con.get('id')), false, "click");
			$E.on($D.getElementsByClassName('next','a',con.get('id')),'click',function(e){
				$E.stopEvent(e);
				cc.fathor.monthAdd().render();
				cc.fathor.EventCenter['switch'].fire(new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
			});
			//�������
			if(cc.fathor.navigator){
				$E.purgeElement($D.getElementsByClassName('title','a',con.get('id')), false, "click");
				$E.on($D.getElementsByClassName('title','a',con.get('id')),'click',function(e){
					$E.stopEvent(e);
					try{
						cc.timmer.hidePopup();
					}catch(e){}
					setime_node.set('innerHTML','');
					var in_str = cc.fathor.templetShow(cc.nav_html,{
						the_month:cc.month+1,
						the_year:cc.year
					});
					setime_node.set('innerHTML',in_str);
					setime_node.removeClass('hidden');
					//input�ϵ����¼��ļ���
					$E.on(con.getElementsByTagName('input').item(0),'keydown',function(e){
						$E.stopEvent(e);
						var el = $E.getTarget(e);
						if(e.keyCode == 38){//up
							el.value = Number(el.value)+1;
							el.select();
						}
						if(e.keyCode == 40){//down
							el.value = Number(el.value)-1;
							el.select();
						}
						if(e.keyCode == 13){//enter
							var _month = setime_node.getElementsByTagName('select').item(0).value;
							var _year  = setime_node.getElementsByTagName('input').item(0).value;
							cc.fathor.render({
								date:new Date(_year+'/'+_month+'/01')
							})
							cc.fathor.EventCenter['switch'].fire(new Date(_year+'/'+_month+'/01'));
							setime_node.addClass('hidden');
						}
					});
				});
				$E.purgeElement($D.getElementsByClassName('setime','div',con.get('id')), false, "click");
				$E.on($D.getElementsByClassName('setime','div',con.get('id')),'click',function(e){
					$E.stopEvent(e);
					var el = $E.getTarget(e);
					if($D.hasClass(el,'ok')){
						var _month = setime_node.getElementsByTagName('select').item(0).value;
						var _year  = setime_node.getElementsByTagName('input').item(0).value;
						cc.fathor.render({
							date:new Date(_year+'/'+_month+'/01')
						})
						cc.fathor.EventCenter['switch'].fire(new Date(_year+'/'+_month+'/01'));
						setime_node.addClass('hidden');
					}else if($D.hasClass(el,'cancel')){
						setime_node.addClass('hidden');
					}
				});
			}
			return this;

		};
		/**
		 * @method getNode
		 * Call�ķ���
		 * �õ���������
		 */
		this.getNode = function(){
			var cc = this;
			return cc.node;
		};
		/**
		 * @method createDS
		 * Call�ķ���
		 * ���������б�
		 */
		this.createDS = function(){
			var cc = this;

			var s = '';
			var startweekday = new Date(cc.year+'/'+(cc.month+1)+'/01').getDay();//���µ�һ�������ڼ�
			var k = cc.fathor.getNumOfDays(cc.year,cc.month + 1) + startweekday;
			
			for(var i = 0;i< k;i++){
				//prepare data {{
				if(/532/.test(Y.env.ua.webkit)){//chrome�£����ڵļ����������������1
					var _td_s = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+1-startweekday).toString());
				}else {
					var _td_s = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+2-startweekday).toString());
				}
				var _td_e = new Date(cc.year+'/'+Number(cc.month+1)+'/'+(i+1-startweekday).toString());
				//prepare data }}
				if(i < startweekday){//null
					s += '<a href="javascript:void(0);" class="null">0</a>';
				}else if( cc.fathor.mindate instanceof Date
							&& new Date(cc.year+'/'+(cc.month+1)+'/'+(i+2-startweekday)).getTime() < cc.fathor.mindate.getTime()  ){//disabled
					s+= '<a href="javascript:void(0);" class="disabled">'+(i - startweekday + 1)+'</a>';
					
				}else if(cc.fathor.maxdate instanceof Date
							&& new Date(cc.year+'/'+(cc.month+1)+'/'+(i+1-startweekday)).getTime() > cc.fathor.maxdate.getTime()  ){//disabled
					s+= '<a href="javascript:void(0);" class="disabled">'+(i - startweekday + 1)+'</a>';


				}else if((cc.fathor.range.start != null && cc.fathor.range.end != null) //����ѡ��Χ
							&& (
								_td_s.getTime()>=cc.fathor.range.start.getTime() && _td_e.getTime() < cc.fathor.range.end.getTime()) ){
							
							
						if(i == (startweekday + (new Date()).getDate() - 1) 
							&& (new Date()).getFullYear() == cc.year 
							&& (new Date()).getMonth() == cc.month){//���첢��ѡ��
							s+='<a href="javascript:void(0);" class="range today">'+(i - startweekday + 1)+'</a>';
						}else{
							s+= '<a href="javascript:void(0);" class="range">'+(i - startweekday + 1)+'</a>';
						}

				}else if(i == (startweekday + (new Date()).getDate() - 1) 
							&& (new Date()).getFullYear() == cc.year 
							&& (new Date()).getMonth() == cc.month){//today
					s += '<a href="javascript:void(0);" class="today">'+(i - startweekday + 1)+'</a>';

				}else if(i == (startweekday + cc.fathor.selected.getDate() - 1) 
							&& cc.month == cc.fathor.selected.getMonth() 
							&& cc.year == cc.fathor.selected.getFullYear()){//selected
					s += '<a href="javascript:void(0);" class="selected">'+(i - startweekday + 1)+'</a>';
				}else{//other
					s += '<a href="javascript:void(0);">'+(i - startweekday + 1)+'</a>';
				}
			}
			if(k%7 != 0){
				for(var i = 0;i<(7-k%7);i++){
					s += '<a href="javascript:void(0);" class="null">0</a>';
				}
			}
			cc.ds = s;
			return this;
		};
		/**
		 * @method render
		 * Call�ķ���
		 * ��Ⱦ
		 */
		this.render = function(){
			var cc = this;
			cc.renderUI();
			cc.buildEvent();
			return this;
		};


	}//Call constructor over
	
	
});

S.Calendar = Calendar;

});

	

