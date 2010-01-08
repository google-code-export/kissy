/**
 * calendar.js | KISSY ����
 * autohr:lijing00333@163.com �γ�
 * @class KISSY.Calendar
 * @param { string } �������ߴ���id 
 * @param { object } ������
 * @return { object } ����һ��calendarʵ��
 * @requires { 'yui3-node' }
 * @requires { calendar-skin-default } Ƥ��
 * 
 * KISSY.Calenar��	
 *	˵����	������������ͨ��new KISSY.Calendar��renderһ������
 *	ʹ�ã�	new KISSY.Calendar(id,options);
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
 *		KISSY.Calendar��ʵ���ķ�����
 *			init:��ʼ��������Ϊoptions
 *			render:��Ⱦ��init��new��ʱ����ã�render����������ʱ����ʱ�̵��ã�����Ϊoptions�����Ա�ɸ���ԭ����
 *			hide:���أ�����ɾ������
 *			show:��ʾ����
 *		
 */

KISSY.add("calendar", function(S) {
	var Calendar = null;
	var Y = YUI().use('node');
	Calendar = function(){
		this._init.apply(this,arguments);
	};
	S.mix(Calendar.prototype,{
        /**
         * ��ʼ��
         * @protected
         */
		_init:function(id,config){
			var that = this;
			that.id = that.C_Id = id;
			that._buildParam(config);

			if(!that.popup){
				that.con = Y.one('#'+id);
			} else {
				var trigger = Y.one('#'+id);
				that.trigger = trigger;
				that.C_Id = 'C_'+Math.random().toString().replace(/.\./i,'');
				that.con = Y.Node.create('<div id="'+that.C_Id+'"></div>');
				Y.one('body').appendChild(that.con);

				that.con.setStyle('top','0px');
				that.con.setStyle('position','absolute');
				that.con.setStyle('background','white');
				that.con.setStyle('visibility','hidden');
			}
			that._buildEventCenter();
			that.render();
			that._buildEvent();
			return this;
		},
		/**
		 * �������¼�����
		 * @protected
		 */
		_buildEventCenter:function(){
			var that = this;
			var EventFactory = function(){
				this.publish("select");
				this.publish("switch");
				this.publish("rangeselect");
				this.publish("timeselect");
				this.publish("selectcomplete");
				this.publish("hide");//later
				this.publish("show");//later
			};
			Y.augment(EventFactory, Y.Event.Target);
			that.EventCenter = new EventFactory();
			return this;
		},
		/**
		 * �󶨼��� 
		 * @method
		 */
		on:function(type,foo){
			var that = this;
			that.EventCenter.subscribe(type,foo);
			return this;
		},
		/**
		 * (����)��Ⱦ�������,�ɴ����µ�����,����ԭ������
		 * @method
		 */
		render:function(o){
			var that = this;
			var o = o || {};
			that._parseParam(o);
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
					next_arrow:_next
				},that));

				that.ca[i].render();
				/*
				that.ca[i].renderUI();
				that.con.appendChild(that.ca[i].node);
				that.ca[i].buildEvent();
				*/
			}
			return this;

		},
		/**
		 * ����d���ǰ������ߺ��죬����date��chrome��֧��date����������
		 * @method
		 */
		showdate:function(n,d){
			var uom = new Date(d-0+n*86400000);
			uom = uom.getFullYear() + "/" + (uom.getMonth()+1) + "/" + uom.getDate();
			return new Date(uom);
		},
		/**
		 * �������������¼�
		 * @protected
		 */
		_buildEvent:function(){
			var that = this;
			if(!that.popup)return this;
			//����հ�
			//flush event
			for(var i = 0;i<that.EV.length;i++){
				if(typeof that.EV[i] != 'undefined'){
					that.EV[i].detach();
				}
			}
			that.EV[0] = Y.Node.get('document').on('click',function(e){
				if(e.target.get('id') == that.C_Id)return;
				var f = e.target.ancestor(function(node){
					if(node.get('id') == that.C_Id)return true;
					else return false;
				});
				if(typeof f == 'undefined' || f == null){
					that.hide();
				}
			});
			//�������
			/*
				Y.one('#'+that.id) = that.trigger
			*/
			that.EV[1] = Y.one('#'+that.id).on('click',function(e){
				e.halt();
				if(that.con.getStyle('visibility') == 'hidden'){
					that.show();
				}else{
					that.hide();
				}
			});
			return this;
		},

		/**
		 * ��ʾ 
		 * @method
		 */
		show:function(){
			var that = this;
			that.con.setStyle('visibility','');
			var _x = that.trigger.getXY()[0];
			var _y = that.trigger.getXY()[1]+that.trigger.get('region').height;
			that.con.setStyle('left',_x.toString()+'px');
			that.con.setStyle('top',_y.toString()+'px');
			return this;
		},
		/**
		 * ���� 
		 * @method
		 */
		hide:function(){
			var that = this;
			that.con.setStyle('visibility','hidden');
			return this;
		},
		/**
		 * ���������б�
		 * ������δ��ֵ�ʹ�ռλ��null�������
		 * @protected
		 */
		_buildParam:function(o){
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
			that.EV = [];
			return this;
		},

		/**
		 * ���˲����б�
		 * @protected
		 */
		_parseParam:function(o){
			var that = this;
			if(typeof o == 'undefined' || o == null){
				var o = {};
			}
			for(var i in o){
				that[i] = o[i];
			}
			that._handleDate();
			return this;
		},
		/**
		 * �õ�ĳ���ж�����,��Ҫ���������ж�����
		 * @method
		 */
		getNumOfDays:function(year,month){
			return 32-new Date(year,month-1,32).getDate();
		},

		/**
		 * ģ�庯����Ӧ����base�� 
		 * @method
		 */
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
		 * ��������,��������������ڱ����������Ҫ�ĸ�ʽ
		 * @protected
		 */
		_handleDate:function(){
			var that = this;
			var date = that.date;
			that.weekday= date.getDay() + 1;//���ڼ� //ָ�����������ڼ�
			that.day = date.getDate();//����
			that.month = date.getMonth();//�·�
			that.year = date.getFullYear();//���
			return this;
		},
		/**
		 * �õ�����������ַ���
		 * @method
		 */
		getHeadStr:function(year,month){
			return year.toString() + '��' + (Number(month)+1).toString() + '��';
		},
		/**
		 * �·ݼ�1
		 * @method
		 */
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
		/**
		 * �·ݼ�1
		 * @method
		 */
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
		/**
		 * ������һ���µ�����,[2009,11],��:fullYear����:��0��ʼ����
		 * @method
		 */
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
		/**
		 * ������ʼ����,d:Date����
		 * @protected
		 */
		handleRange : function(d){
			var that = this;
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
				}
				that.EventCenter.fire('rangeselect',that.range);
				that.render();
			}
			return this;
		},
		/**
		 * ������������
		 * @constructor KISSY.Calendar.prototype.Call
		 * @param {object} config ,�����б���Ҫָ�����������������
		 * @param {object} fathor,ָ��KISSY.Calendarʵ����ָ�룬��Ҫ������Ĳ���
		 * @return ��������ʵ��
		 */
		Call:function(config,fathor){
			/**
			 * �����б�
			 */
			this.fathor = fathor;
			this.month = Number(config.month);
			this.year = Number(config.year);
			this.prev_arrow = config.prev_arrow;
			this.next_arrow = config.next_arrow;
			this.node = null;
			this.id = '';
			this.EV = [];
			this.html = [
				'<div class="c-box" id="{$id}">',
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
				'</div><!--#c-box-->'
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


			/**
			 * �����б�
			 */

			/**
			 * ��Ⱦ��������UI
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
				//cc.node = Y.Node.create(cc.fathor.templetShow(cc.html,_o));
				cc.fathor.con.appendChild(Y.Node.create(cc.fathor.templetShow(cc.html,_o)));
				cc.node = Y.one('#'+cc.id);
				return this;
			};
			/**
			 * �������������¼�
			 */
			this.buildEvent = function(){
				var cc = this;
				var con = Y.one('#'+cc.id);
				//flush event
				for(var i = 0;i<cc.EV.length;i++){
					if(typeof cc.EV[i] != 'undefined'){
						cc.EV[i].detach();
					}
				}
				cc.EV[0] = con.query('div.dbd').on('click',function(e){
					e.halt();
					if(e.target.hasClass('null'))return;
					if(e.target.hasClass('disabled'))return;
					var selectedd = Number(e.target.get('innerHTML'));
					var d = new Date();
					d.setDate(selectedd);
					d.setMonth(cc.month);
					d.setYear(cc.year);
					//that.callback(d);
					cc.fathor.EventCenter.fire('select',d);
					if(cc.fathor.popup && cc.fathor.closeable){
						cc.fathor.hide();
					}
					if(cc.fathor.range_select){
						cc.fathor.handleRange(d);
					}
					cc.fathor.render({selected:d});
				});
				//��ǰ
				cc.EV[1] = con.query('a.prev').on('click',function(e){
					e.halt();
					cc.fathor.monthMinus().render();
					cc.fathor.EventCenter.fire('switch',new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
				});
				//���
				cc.EV[2] = con.query('a.next').on('click',function(e){
					e.halt();
					cc.fathor.monthAdd().render();
					cc.fathor.EventCenter.fire('switch',new Date(cc.fathor.year+'/'+(cc.fathor.month+1)+'/01'));
				});
				//�������
				if(cc.fathor.navigator){
					cc.EV[3] = con.query('a.title').on('click',function(e){
						e.halt();	
						var setime_node = con.query('.setime');
						setime_node.set('innerHTML','');
						var in_str = cc.fathor.templetShow(cc.nav_html,{
							the_month:cc.month+1,
							the_year:cc.year
						});
						setime_node.set('innerHTML',in_str);
						setime_node.removeClass('hidden');
						con.query('input').on('keydown',function(e){
							if(e.keyCode == 38){//up
								e.target.set('value',Number(e.target.get('value'))+1);
								e.target.select();
							}
							if(e.keyCode == 40){//down
								e.target.set('value',Number(e.target.get('value'))-1);
								e.target.select();
							}
							if(e.keyCode == 13){//enter
								var _month = con.query('.setime').query('select').get('value');
								var _year  = con.query('.setime').query('input').get('value');
								cc.fathor.render({
									date:new Date(_year+'/'+_month+'/01')
								})
								cc.fathor.EventCenter.fire('switch',new Date(_year+'/'+_month+'/01'));
								con.query('.setime').addClass('hidden');
							}
						});
					});
					//���ȷ��
					cc.EV[4] = con.query('.setime').on('click',function(e){
						e.halt();
						if(e.target.hasClass('ok')){
							var _month = con.query('.setime').query('select').get('value');
							var _year  = con.query('.setime').query('input').get('value');
							cc.fathor.render({
								date:new Date(_year+'/'+_month+'/01')
							})
							cc.fathor.EventCenter.fire('switch',new Date(_year+'/'+_month+'/01'));
							con.query('.setime').addClass('hidden');
						}else if(e.target.hasClass('cancel')){
							con.query('.setime').addClass('hidden');
						}
					});
				}
				return this;

			};
			/**
			 * �õ���ǰ��������node����
			 */
			this.getNode = function(){
				var cc = this;
				return cc.node;
			};
			/**
			 * �������ڵ�html
			 */
			this.createDS = function(){
				var cc = this;

				var s = '';
				var startweekday = new Date(cc.year+'/'+(cc.month+1)+'/01').getDay();//���µ�һ�������ڼ�
				var k = cc.fathor.getNumOfDays(cc.year,cc.month + 1) + startweekday;
				
				for(var i = 0;i< k;i++){
					//prepare data {{
					if(/532/.test(Y.UA.webkit)){//hack for chrome
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
								
								//alert(Y.dump(_td_s.getDate()));
								
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

	S.namespace('KISSY.Calendar');
	KISSY.Calendar = S.Calendar = Calendar;

});
