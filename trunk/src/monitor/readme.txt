<textarea style="width: 1024px; height: 600px">
ʹ��˵����

����Ҫ��ص�ҳ�棬������� js��

<title>ҳ�����</title>
<script type="text/javascript">g_ks_monitor_st=+new Date</script>

...

<script type="text/javascript" src="http://a.tbcdn.cn/kissy/1.0.0/build/monitor/monitor-min.js?t=20090917.js">
    KISSY.Monitor.init({
        apiUrl: "http://igw.monitor.taobao.com/monitor-gw/receive.do",
        pageId: 1000,
        sampleRate: 10000,
        sections: ["id1", "id2"]
    });
</script>
</body>

Ŀǰ pageId ��Լ����
    Detailҳ��1000, �Ա���ҳ2000, �̳���ҳ3000,������ҳ4000, listing 5000

�ر�˵����

  1. ��һ�� js ���� title ����

  2. �ڶ��� js ���� </body> ����
  
  3. �ڶ��� js��ֻ�� pageId �Ǳ��봫�ģ����� ������ҳ�������ǣ�
<script type="text/javascript" src="http://a.tbcdn.cn/kissy/1.0.0/build/monitor/monitor-min.js?t=20090917.js">
    KISSY.Monitor.init({pageId:4000});
</script>
</textarea>