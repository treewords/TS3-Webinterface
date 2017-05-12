/*
	First-Coder Teamspeak 3 Webinterface for everyone
	Copyright (C) 2017 by L.Gmann

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
	for help look http://first-coder.de/
*/
	
function slideBackups(direction) {if(direction=="up") {$('#slideBackups').slideUp("slow")} else{$('#slideBackups').slideDown("slow")}};function instanzMessagePoke() {var instanz,message=$('#instanzMessagePokeContent').val(),mode=$('#instanzMode').hasClass("active");if(document.getElementById('selectInstanzMsgPoke')) {instanz=$("#selectInstanzMsgPoke").val()} else{instanz=$("input[name='instanzMsgPoke']:checked").val()};if(message!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'instanzMsgPoke',message:message,mode:mode,instanz:instanz},success:function(data) {if(data=="done") {setNotifySuccess(lang.server_msg_poke_done)} else{setNotifyFailed(data)}}})}};function serverMessage() {var message=$('#serverMessageContent').val();if(message!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverMessage',instanz:instanz,port:port,mode:'3',message:encodeURIComponent(message),serverid:serverId},success:function(data) {if(data=="done") {setNotifySuccess(lang.servermessage_done)} else{setNotifyFailed(data)}}})}};function serverPoke() {var message=$('#serverMessageContent').val();if(message!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverPoke',instanz:instanz,port:port,message:encodeURIComponent(message),serverid:serverId},success:function(data) {if(data=="done") {setNotifySuccess(lang.serverpoke_done)} else{setNotifyFailed(data)}}})}};function toggleStartStopTeamspeakserver(id,instanz,serverPort) {if(tsStatus=='online') {stopTeamspeakserver(id,instanz,serverPort);tsStatus="offline"} else{startTeamspeakserver(id,instanz,serverPort);tsStatus="online"}};function stopTeamspeakserver(id,instanz,serverPort) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverStop',instanz:instanz,port:serverPort,serverid:id},success:function(data) {if(data=='done') {var objectUptime=document.getElementById('uptime-'+instanz+'-'+id),objectOnline=document.getElementById('online-'+instanz+'-'+id),objectClients=document.getElementById('progress-bar-'+instanz+'-'+id),objectTable=document.getElementById('serverlist-'+instanz+'-'+id),objectTableSlots=document.getElementById('serverlist-slots-'+instanz+'-'+id);if(objectUptime&&objectOnline&&objectClients) {objectUptime.removeAttribute('uptime-timestamp');objectUptime.innerHTML=lang.online_since+": -";objectOnline.innerHTML=lang.offline;objectClients.style.display="none"};if(objectTable&&objectTableSlots) {objectTable.classList.remove("text-success");objectTable.classList.add("text-danger");objectTableSlots.innerHTML="-"};if(document.getElementById("clients-"+instanz+"-"+id)) {document.getElementById("clients-"+instanz+"-"+id).innerHTML='-';document.getElementById("status-"+instanz+"-"+id).innerHTML='offline';$('#status-'+instanz+'-'+id).removeClass("text-success");$('#status-'+instanz+'-'+id).addClass("text-danger")};setNotifySuccess(lang.server_stoped)} else{setNotifyFailed(data)}}})};function startTeamspeakserver(id,instanz,serverPort) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverStart',instanz:instanz,port:serverPort,serverid:id},success:function(data) {if(data=='done') {var objectUptime=document.getElementById('uptime-'+instanz+'-'+id),objectOnline=document.getElementById('online-'+instanz+'-'+id),objectClients=document.getElementById('progress-bar-'+instanz+'-'+id),objectTable=document.getElementById('serverlist-'+instanz+'-'+id),objectTableSlots=document.getElementById('serverlist-slots-'+instanz+'-'+id);if((objectTable&&objectTableSlots)||(objectUptime&&objectOnline&&objectClients)||document.getElementById("clients-"+instanz+"-"+id)) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'getInstanzServerlistInformations'},success:function(data) {var informations=JSON.parse(data);if(objectUptime&&objectOnline&&objectClients) {objectUptime.setAttribute('uptime-timestamp','1');objectOnline.innerHTML=lang.online;objectClients.style.display="inline";objectClients.innerHTML=informations[instanz][id].clients+" / "+informations[instanz][id].maxclients;objectClients.style.width=(informations[instanz][id].clients/informations[instanz][id].maxclients)*100+"%"};if(objectTable&&objectTableSlots) {objectTable.classList.remove("text-danger");objectTable.classList.add("text-success");objectTableSlots.innerHTML=informations[instanz][id].clients+" / "+informations[instanz][id].maxclients};if(document.getElementById("clients-"+instanz+"-"+id)) {document.getElementById("clients-"+instanz+"-"+id).innerHTML=informations[instanz][id].clients+'&nbsp;/&nbsp;'+informations[instanz][id].maxclients;document.getElementById("status-"+instanz+"-"+id).innerHTML='online';$('#status-'+instanz+'-'+id).removeClass("text-danger");$('#status-'+instanz+'-'+id).addClass("text-success")}}})};setNotifySuccess(lang.server_started)} else{setNotifyFailed(data)}}})};function deleteTeamspeakserver(serverId,instanz,port) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverDelete',serverid:serverId,instanz:instanz,port:port},success:function(data) {if(data=='done') {if(serverCount>5) {deleteRow=Array(serverId);$('#serverTable_'+instanz).bootstrapTable('remove',{field:'id',values:deleteRow})} else{$('#serverbox_'+instanz+'_'+port).remove()};setNotifySuccess(lang.server_deleted)} else{setNotifyFailed(lang.server_could_be_not_deleted)};$('#modalAreYouSure').modal('hide')}})};function goBackToMain() {if('replaceState' in history) {history.replaceState(null,document.title,"index.php?web_teamspeak_server")};$(".preloader").fadeIn("fast",function() {$("#hp").load("./php/main/web_main.php")})};function showTeamspeakserver(id,instanz) {if('replaceState' in history) {history.replaceState(null,document.title,"index.php?web_teamspeak_serverview?"+instanz+"?"+id)};$(".preloader").fadeIn("fast",function() {$("#hp").load("./php/main/web_main.php?temp?"+instanz+"?"+id)})};function serverEdit(right,newValue,instanz,serverId,serverPort) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'serverEdit',instanz:instanz,port:serverPort,right:right,value:newValue,serverid:serverId},success:function(data) {if(data=="done") {setNotifySuccess(lang.server_successfull_edit);if(right=='virtualserver_port') {goBackToMain();stopTeamspeakserver(serverId,instanz,serverPort);startTeamspeakserver(serverId,instanz,serverPort)}} else{setNotifyFailed(data)}}})};function createChannel() {var channeldata=new Object();channeldata.cpid=$('#cpid').val();channeldata.channel_name=$('#channel_name').val();channeldata.channel_topic=$('#channel_topic').val();channeldata.channel_description=$('#channel_description').val();channeldata.channel_codec=$('#channel_codec').val();channeldata.channel_codec_quality=$('#channel_codec_quality').val();channeldata.channel_maxclients=$('#channel_maxclients').val();channeldata.channel_maxfamilyclients=$('#channel_maxfamilyclients').val();channeldata.channel_flag_maxfamilyclients_inherited=$('#channel_flag_maxfamilyclients_inherited').val();channeldata.channel_needed_talk_power=$('#channel_needed_talk_power').val();channeldata.channel_name_phonetic=$('#channel_name_phonetic').val();switch($('#channel_typ').val()) {case "1":channeldata.channel_flag_permanent="1";channeldata.channel_flag_semi_permanent="0";break;case "2":channeldata.channel_flag_permanent="0";channeldata.channel_flag_semi_permanent="1";break;case "3":channeldata.channel_flag_permanent="1";channeldata.channel_flag_semi_permanent="0";channeldata.channel_flag_default="1";break};$.ajax({url:"./php/functions/functionsTeamspeakPost.php",type:"post",data:{action:'createChannel',instanz:instanz,port:port,channeldata:encodeURIComponent(JSON.stringify(channeldata))},success:function(data){if(data=='done') {setNotifySuccess(lang.channel_created)} else{setNotifyFailed(data)}}})};function changeTokenSelectmenu() {var kindOfGroup=$('#tokenChooseKindOfGroup').val();$('#tokenChooseChannel').prop('disabled',function(i,v) {return!v});if($('#tokenChooseChannel').hasClass("input-danger")) {$('#tokenChooseChannel').removeClass("input-danger")};if(kindOfGroup==0) {$("#tokenChooseGroup").html(sgroup)} else{$("#tokenChooseGroup").html(cgroup)}};function deleteToken(token) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteToken',token:encodeURIComponent(token),serverid:serverId,instanz:instanz,port:port},success:function(data) {if(data=="done") {deleteRow=Array(token);$('#channelTokenTable').bootstrapTable('remove',{field:'token',values:deleteRow});setNotifySuccess(lang.token_successful_deleted)} else{setNotifyFailed(data)}}})};function createToken() {var failState=!1,tokenAnzahl=$('#tokenChooseAnzahl').val(),tokenDesc=escapeText($('#tokenChooseDescription').val()),tokenKindGroup=$('#tokenChooseKindOfGroup').val(),tokenGroup=$('#tokenChooseGroup').val(),tokenChannel=0;if(tokenKindGroup==1) {tokenChannel=$('#tokenChooseChannel').val()};if(tokenAnzahl==''||tokenAnzahl<=0) {failState=!0;$('#tokenChooseAnzahl').addClass("input-danger")} else{if($('#tokenChooseAnzahl').hasClass("input-danger")) {$('#tokenChooseAnzahl').removeClass("input-danger")}};if(tokenKindGroup==1&&tokenChannel=='') {failState=!0;$('#tokenChooseChannel').addClass("input-danger")} else{if($('#tokenChooseChannel').hasClass("input-danger")) {$('#tokenChooseChannel').removeClass("input-danger")}};if(!failState) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'addToken',type:tokenKindGroup,tokenid1:tokenGroup,tokenid2:tokenChannel,description:tokenDesc,number:tokenAnzahl,serverid:serverId,instanz:instanz,port:port},success:function(data) {var informations=JSON.parse(data);if(informations.done=='true') {var newRow=[],tokenTable=$('#channelTokenTable');for(var k in informations) {if(k!='done') {newRow.push({groupname:$('#tokenChooseGroup :selected').text(),channel:(tokenChannel!=0)?$('#tokenChooseChannel :selected').text():"-",create_on:'Now',token:informations[k].token,description:escapeText(informations[k].description),actions:'<button style="margin-bottom: 0px;padding: .0rem .75rem;" class="btn btn-sm btn-danger" onClick="deleteToken(\''+informations[k].token+'\')"><i class="fa fa-fw fa-trash"></i> '+lang.delete+'</button>'})}};tokenTable.bootstrapTable('prepend',newRow)} else{setNotifyFailed(informations.error)}}})}};function resetServer() {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'resetServer',instanz:instanz,port:port},success:function(data) {if(data=="") {setNotifyFailed("There was something wrong in the reset progress :/")} else{setNotifySuccess(lang.reset_server_success+"<br/>"+lang.server_token+": <i>"+data+"</i>")};$('#modalAreYouSure').modal('hide')}})};function createBackup() {var backupKind=$('#backupChannel').prop("checked");var backupChannelKind=$('#backupChannelName').prop("checked");$.ajax({type:"POST",url:"./php/functions/functionsBackupPost.php",data:{action:'createBackup',instanz:instanz,port:port,kind:(backupKind)?'channel':'server',kindChannel:(backupChannelKind)?"name":"all"},success:function(data) {if(data.includes('.json')) {var newRow=[],splitData=data.replace(".json","").split("_"),backupTable,folder;if(backupKind) {if(backupChannelKind) {backupTable='channelBackupNameTable';folder='channelname'} else{backupTable='channelBackupNameSettingsTable';folder='channelnamesettings'}} else{backupTable='serverBackupTable';folder='server'};newRow.push({instanz:splitData[1],port:splitData[3],date:splitData[7]+":"+splitData[8]+"-"+splitData[6]+"."+splitData[5]+"."+splitData[4],actions:"<button class=\"btn btn-success btn-sm\" onClick=\"activateBackup('"+data+"', '"+folder+"');\"><i class=\"fa fa-check\"></i> <font class=\"hidden-md-down\">"+lang.activate+"</font></button>\ <a href=\"./php/functions/functionsDownload.php?action=downloadBackup&port="+port+"&instanz="+instanz+"&type="+folder+"&name="+data+"\">\ <button class=\"btn btn-primary btn-sm\"><i class=\"fa fa-download\"></i> <font class=\"hidden-md-down\">"+lang.download+"</font></button>\ </a>\ <button class=\"btn btn-danger btn-sm\" onClick=\"AreYouSure('"+lang.delete_backup+"', 'deleteBackup(\\'"+folder+"/"+data+"\\', \\'"+backupTable+"\\', \\'"+data.replace(".json","")+"\\');');\"><i class=\"fa fa-trash\"></i> <font class=\"hidden-md-down\">"+lang.delete+"</font></button>",id:data.replace(".json","")});$('#'+backupTable).bootstrapTable('prepend',newRow);setNotifySuccess(lang.backup_created)} else{setNotifyFailed(data)}}})};function deleteBackup(path,id,removeId) {$.ajax({url:"./php/functions/functionsPost.php",type:"post",data:{action:'deleteBackup',file:path},success:function(data){if(data=="done") {deleteRow=Array(removeId);$('#'+id).bootstrapTable('remove',{field:'id',values:deleteRow});setNotifySuccess(lang.file_delete_success)} else{setNotifyFailed(lang.file_could_not_deleted)};$('#modalAreYouSure').modal('hide')}})};function activateBackup(file,subaction) {alert("This can take a while.... Dont get panic ;)");$.ajax({url:"./php/functions/functionsBackupPost.php",type:"post",data:{action:'activateBackup',subaction:subaction,instanz:instanz,port:port,file:file},success:function(data){if(data=="done") {setNotifySuccess(lang.backup_activation_successfull)} else{setNotifyFailed(data)};$('#modalAreYouSure').modal('hide')}})};function deleteIcon(id) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteIcon',id:id,instanz:instanz,serverId:serverId,port:port},success:function(data) {if(data=="done") {deleteRow=Array(id);$('#fileTable').bootstrapTable('remove',{field:'id',values:deleteRow});setNotifySuccess(lang.icon_successful_deleted)} else{setNotifyFailed(lang.file_could_not_deleted)}}})};function clientMsg(clid) {var message=escapeText($('#inputMessagePoke').val()),mode=$('#selectMessagePoke').val(),action=(mode==1)?"clientMsg":"clientPoke";if(message!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:action,message:encodeURIComponent(message),instanz:instanz,port:port,clid:clid},success:function(data) {if(data=="done") {setNotifySuccess((mode==1)?lang.client_message_success:lang.client_poke_success)} else{setNotifyFailed(data)}}})}};function clientMove(clid) {var cid=$('#selectMoveInChannel').val();if(cid!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientMove',message:'',instanz:instanz,port:port,clid:clid,cid:cid},success:function(data) {if(data=='done') {setNotifySuccess(lang.client_move_success)} else{setNotifyFailed(data)}}})}};function clientKick(clid) {var mode=$('#selectKickStyle').val(),message=escapeText($('#inputMessageKick').val());$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientKick',message:encodeURIComponent(message),instanz:instanz,port:port,clid:clid,kickmode:mode},success:function(data) {if(data=='done') {setNotifySuccess(lang.client_kick_success)} else{setNotifyFailed(data)}}})};function clientBan(clid) {var time=($('#inputBanTime').val()=="")?0:$('#inputBanTime').val(),message=escapeText($('#inputMessageBan').val());$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientBan',message:encodeURIComponent(message),instanz:instanz,port:port,clid:clid,bantime:time},success:function(data) {if(data=='done'&&document.getElementById("infoBan")) {setNotifySuccess(lang.client_ban_success)} else{setNotifyFailed(data)}}})};function addRemoveSRights(clid,sgid,id) {var hasRight=$('#'+id).hasClass("btn-success");$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientAddRemoveServerGroup',sgid:sgid,instanz:instanz,port:port,clid:clid,permission:!hasRight},success:function(data) {if(data=='done') {if(hasRight) {$('#'+id).removeClass("btn-success");$('#'+id+'_icon').removeClass("fa-check");$('#'+id).addClass("btn-danger");$('#'+id+'_icon').addClass("fa-ban");document.getElementById(id+'_text').innerHTML=' '+lang.blocked} else{$('#'+id).removeClass("btn-danger");$('#'+id+'_icon').removeClass("fa-ban");$('#'+id).addClass("btn-success");$('#'+id+'_icon').addClass("fa-check");document.getElementById(id+'_text').innerHTML=' '+lang.unblocked}} else{setNotifyFailed(data)}}})};function addRemoveCRights(cid,oldCgid,clid,cgid,id) {if(clientChannelGroupId!=-1) {oldCgid=clientChannelGroupId};var hasRight=$('#'+id).hasClass("btn-success");if(!hasRight) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientChangeChannelGroup',cid:cid,cgid:cgid,instanz:instanz,port:port,clid:clid},success:function(data) {if(data=='done') {clientChannelGroupId=cgid;$('#'+id).removeClass("btn-danger");$('#'+id+'_icon').removeClass("fa-ban");$('#'+id).addClass("btn-success");$('#'+id+'_icon').addClass("fa-check");document.getElementById(id+'_text').innerHTML=' '+lang.unblocked;$('#cgroup_'+oldCgid).removeClass("btn-success");$('#cgroup_'+oldCgid+'_icon').removeClass("fa-check");$('#cgroup_'+oldCgid).addClass("btn-danger");$('#cgroup_'+oldCgid+'_icon').addClass("fa-ban");document.getElementById('cgroup_'+oldCgid+'_text').innerHTML=' '+lang.blocked} else{setNotifyFailed(data)}}})}};function massactionsChangeMessagePoke(action=0) {var who=$("#selectMessagePokeGroup").find(':selected').attr('group'),channel=$('#selectMessagePokeChannel').val(),group=$('#selectMessagePokeGroup').val();massactionsMassInfo(who,group,channel,'msg',action)};function massactionsChangeMove(action=0) {var whichChannel=$('#selectMoveFromChannel').val(),toChannel=$('#selectMoveInChannel').val();if(whichChannel!=''&&toChannel!='') {var who=$("#selectMoveGroup").find(':selected').attr('group'),group=$('#selectMoveGroup').val();massactionsMassInfo(who,group,whichChannel,'move',action)}};function massactionsChangeKick(action=0) {var who=$("#selectKickGroup").find(':selected').attr('group'),channel=$('#selectKickChannel').val(),group=$('#selectKickGroup').val();massactionsMassInfo(who,group,channel,'kick',action)};function massactionsChangeBan(action=0) {var who=$("#selectBanGroup").find(':selected').attr('group'),channel=$('#selectBanChannel').val(),group=$('#selectBanGroup').val();massactionsMassInfo(who,group,channel,'ban',action)};function massactionsMassInfo(who,group,channel,action,id=0) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'getUsersMassActions',ts3_server:instanz,ts3_port:port,who:who,group:group,channel:channel,mass_action:action,just_id:id},success:function(data) {var informations=JSON.parse(data);if(id==0) {if(informations.length<=1) {if(informations[0]=='move'&&document.getElementById("infoMove")) {document.getElementById("infoMove").innerHTML=lang.catched_clients};if(informations[0]=='kick'&&document.getElementById("infoKick")) {document.getElementById("infoKick").innerHTML=lang.catched_clients};if(informations[0]=='ban'&&document.getElementById("infoBan")) {document.getElementById("infoBan").innerHTML=lang.catched_clients};if(informations[0]=='msg'&&document.getElementById("infoMessagePoke")) {document.getElementById("infoMessagePoke").innerHTML=lang.catched_clients}} else{var clients='';for($i=1;$i<informations.length;$i++) {if($i==0||$i==informations.length-1) {clients+=informations[$i]} else{clients+=informations[$i]+', '}};if(informations[0]=='move'&&document.getElementById("infoMove")) {document.getElementById("infoMove").innerHTML=clients};if(informations[0]=='kick'&&document.getElementById("infoKick")) {document.getElementById("infoKick").innerHTML=clients};if(informations[0]=='ban'&&document.getElementById("infoBan")) {document.getElementById("infoBan").innerHTML=clients};if(informations[0]=='msg'&&document.getElementById("infoMessagePoke")) {document.getElementById("infoMessagePoke").innerHTML=clients}}} else{var succeeded=0;if(informations.length>1) {for($i=1;$i<informations.length;$i++) {switch(informations[0]) {case "msg":var message=escapeText($('#inputMessagePoke').val()),mode=$('#selectMessagePoke').val();if(message!='') {action=(mode==1)?"clientMsg":"clientPoke";$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:action,message:encodeURIComponent(message),instanz:instanz,port:port,clid:informations[$i]},async:!1,success:function(data) {if(data=="done") {succeeded++}}})};break;case "move":var cid=$('#selectMoveInChannel').val();if(cid!='') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientMove',message:'',instanz:instanz,port:port,clid:informations[$i],cid:cid},async:!1,success:function(data) {if(data=='done'&&document.getElementById("infoMove")) {document.getElementById("infoMove").innerHTML=lang.catched_clients;succeeded++}}})};break;case "kick":var mode=$('#selectKickStyle').val(),message=escapeText($('#inputMessageKick').val());$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientKick',message:encodeURIComponent(message),instanz:instanz,port:port,clid:informations[$i],kickmode:mode},async:!1,success:function(data) {if(data=='done'&&document.getElementById("infoKick")) {document.getElementById("infoKick").innerHTML=lang.catched_clients;succeeded++}}});break;case "ban":var time=$('#inputBanTime').val(),message=escapeText($('#inputMessageBan').val());$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientBan',message:encodeURIComponent(message),instanz:instanz,port:port,clid:informations[$i],bantime:time},async:!1,success:function(data) {if(data=='done'&&document.getElementById("infoBan")) {document.getElementById("infoBan").innerHTML=lang.catched_clients;succeeded++}}});break}};if((informations.length-1)==succeeded) {setNotifySuccess(lang.massaction_success)} else{setNotifyFailed(lang.massaction_failed)}}}}})};function addBan() {var input=escapeText($('#banInput').val()),banReason=escapeText($('#banReason').val()),banTime=$('#banTime').val(),bantype="uid";if($('#banName').prop("checked")) {var bantype="name"};if($('#banIp').prop("checked")) {var bantype="ip"};if(input!=""&&banTime!="") {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientBanManuell',port:port,bantype:bantype,instanz:instanz,input:encodeURIComponent(input),time:banTime,reason:encodeURIComponent(banReason)},success:function(data) {if(data=="done") {setNotifySuccess(lang.ban_successfull_added);teamspeakBansInit()} else{setNotifyFailed(data)}}})} else{setNotifyFailed(lang.add_ban_error)}};function deleteBan(banid) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'clientUnban',port:port,banid:banid,instanz:instanz},success:function(data) {if(data=="done") {deleteRow=Array(banid);$('#banTable').bootstrapTable('remove',{field:'id',values:deleteRow});setNotifySuccess(lang.ban_successful_deleted)} else{setNotifyFailed(data)}}})};$(function(){$('#serverCreatePort').focusout(function(){if($(this).val()=="") {$(this).removeClass("text-danger-no-cursor");$(this).removeClass("text-success")} else{$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'checkTeamspeakPort',port:$(this).val(),instanz:$("#serverCreateWhichInstanz").val()},success:function(data){if(data=="done") {$("#serverCreatePort").addClass("text-danger-no-cursor");$("#serverCreatePort").removeClass("text-success")} else{$("#serverCreatePort").addClass("text-success");$("#serverCreatePort").removeClass("text-danger-no-cursor")}}})}})});function createServer(requestName="",requestPw="",filename,isRequest=!1) {$('#createServer').addClass("disabled");$('#createServer').prop('disabled',!0);var serverdata=new Object();serverdata.virtualserver_reserved_slots=($('#serverCreateReservedSlots').val()!='')?$('#serverCreateReservedSlots').val():ts3_server_create_default['reserved_slots'];serverdata.virtualserver_hostmessage=($('#serverCreateHostMessage').val()!=''&&!isRequest)?$('#serverCreateHostMessage').val():ts3_server_create_default['host_message'];serverdata.virtualserver_hostbanner_url=($('#serverCreateHostUrl').val()!=''&&!isRequest)?$('#serverCreateHostUrl').val():ts3_server_create_default['host_url'];serverdata.virtualserver_hostbanner_gfx_url=($('#serverCreateHostBannerUrl').val()!=''&&!isRequest)?$('#serverCreateHostBannerUrl').val():ts3_server_create_default['host_banner_url'];serverdata.virtualserver_hostbanner_gfx_interval=($('#serverCreateHostBannerInterval').val()!=''&&!isRequest)?$('#serverCreateHostBannerInterval').val():ts3_server_create_default['host_banner_int'];serverdata.virtualserver_hostbutton_gfx_url=($('#serverCreateHostButtonGfxUrl').val()!=''&&!isRequest)?$('#serverCreateHostButtonGfxUrl').val():ts3_server_create_default['host_button_gfx'];serverdata.virtualserver_hostbutton_tooltip=($('#serverCreateHostButtonTooltip').val()!=''&&!isRequest)?$('#serverCreateHostButtonTooltip').val():ts3_server_create_default['host_button_tip'];serverdata.virtualserver_hostbutton_url=($('#serverCreateHostButtonUrl').val()!=''&&!isRequest)?$('#serverCreateHostButtonUrl').val():ts3_server_create_default['host_button_url'];serverdata.virtualserver_complain_autoban_count=($('#serverCreateAutobanCount').val()!=''&&!isRequest)?$('#serverCreateAutobanCount').val():ts3_server_create_default['auto_ban_count'];serverdata.virtualserver_complain_autoban_time=($('#serverCreateAutobanDuration').val()!=''&&!isRequest)?$('#serverCreateAutobanDuration').val():ts3_server_create_default['auto_ban_time'];serverdata.virtualserver_complain_remove_time=($('#serverCreateAutobanDeleteAfter').val()!=''&&!isRequest)?$('#serverCreateAutobanDeleteAfter').val():ts3_server_create_default['remove_time'];serverdata.virtualserver_antiflood_points_tick_reduce=($('#serverCreateReducePoints').val()!=''&&!isRequest)?$('#serverCreateReducePoints').val():ts3_server_create_default['points_tick_reduce'];serverdata.virtualserver_antiflood_points_needed_command_block=($('#serverCreatePointsBlock').val()!=''&&!isRequest)?$('#serverCreatePointsBlock').val():ts3_server_create_default['points_needed_block_cmd'];serverdata.virtualserver_antiflood_points_needed_ip_block=($('#serverCreatePointsBlockIp').val()!=''&&!isRequest)?$('#serverCreatePointsBlockIp').val():ts3_server_create_default['needed_block_ip'];serverdata.virtualserver_max_upload_total_bandwidth=($('#serverCreateUploadLimit').val()!=''&&!isRequest)?$('#serverCreateUploadLimit').val():ts3_server_create_default['upload_bandwidth_limit'];serverdata.virtualserver_upload_quota=($('#serverCreateUploadKontigent').val()!=''&&!isRequest)?$('#serverCreateUploadKontigent').val():ts3_server_create_default['upload_quota'];serverdata.virtualserver_max_download_total_bandwidth=($('#serverCreateDownloadLimit').val()!=''&&!isRequest)?$('#serverCreateDownloadLimit').val():ts3_server_create_default['download_bandwidth_limit'];serverdata.virtualserver_download_quota=($('#serverCreateDownloadKontigent').val()!=''&&!isRequest)?$('#serverCreateDownloadKontigent').val():ts3_server_create_default['download_quota'];serverdata.virtualserver_log_client=(!isRequest)?$('#serverCreateProtokolClient').val():ts3_server_create_default['virtualserver_log_client'];serverdata.virtualserver_log_query=(!isRequest)?$('#serverCreateProtokolQuery').val():ts3_server_create_default['virtualserver_log_query'];serverdata.virtualserver_log_channel=(!isRequest)?$('#serverCreateProtokolChannel').val():ts3_server_create_default['virtualserver_log_channel'];serverdata.virtualserver_log_permissions=(!isRequest)?$('#serverCreateProtokolRights').val():ts3_server_create_default['virtualserver_log_permissions'];serverdata.virtualserver_log_server=(!isRequest)?$('#serverCreateProtokolServer').val():ts3_server_create_default['virtualserver_log_server'];serverdata.virtualserver_log_filetransfer=(!isRequest)?$('#serverCreateProtokolTransfer').val():ts3_server_create_default['virtualserver_log_filetransfer'];serverdata.virtualserver_name=($('#serverCreateServername').val()!='')?$('#serverCreateServername').val():ts3_server_create_default['servername'];serverdata.virtualserver_maxclients=($('#serverCreateSlots').val()!='')?$('#serverCreateSlots').val():ts3_server_create_default['slots'];serverdata.virtualserver_password=($('#serverCreatePassword').val()!='')?$('#serverCreatePassword').val():ts3_server_create_default['password'];serverdata.virtualserver_welcomemessage=$('#serverCreateWelcomeMessage').val();if($('#serverCreatePort').val()!='') {serverdata.virtualserver_port=$('#serverCreatePort').val()};if(!isRequest) {serverdata.virtualserver_hostmessage_mode=$('#serverCreateHosttype').val()};$.ajax({url:"./php/functions/functionsTeamspeakPost.php",type:"post",data:{action:'createServer',instanz:$('#serverCreateWhichInstanz').val(),serverdata:encodeURIComponent(JSON.stringify(serverdata)),copyInstanz:$('#serverCreateServerCopy').val(),copyPort:$('#serverCreateServerCopyPort').val(),isRequest:isRequest,requestName:requestName,requestPw:requestPw,filename:filename},success:function(data){informations=JSON.parse(data);if(informations.success==="1") {$.notify({title:'<strong>'+lang.success+'</strong><br />',message:lang.server_id+":<i> "+informations.serverid+"</i><br />"+lang.port+":<i> "+informations.port+"</i><br />"+lang.token+":<i> "+informations.token+"</i>",icon:'fa fa-check'},{type:'info',allow_dismiss:!0,delay:0,placement:{from:'bottom',align:'right'}})} else{setNotifyFailed(informations.error)};$('#createServer').prop('disabled',!1);$('#createServer').removeClass('disabled')}})};function deleteWantServer(file) {$.ajax({type:"POST",url:"./php/functions/functionsPost.php",data:{action:'deleteServerRequest',file:file},success:function(data) {if(data=='error') {setNotifyFailed(lang.file_does_not_exist)} else{setNotifySuccess(lang.file_delete_success);teamspeakServerRequestsInit()}}})};function serverCreateChangePort() {var instanz=$('#serverCreateServerCopy').val();if(instanz!='nope') {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'getTeamspeakPorts',instanz:instanz},success:function(data){var element=document.getElementById('serverCreateServerCopyPort');while(element.childNodes.length>=1) {element.removeChild(element.firstChild)};if(data!="") {var ports=JSON.parse(data);for(i=0;i<ports.length;i++) {port=document.createElement('option');port.value=ports[i];port.text=ports[i];element.appendChild(port)}} else{nope=document.createElement('option');nope.value='nope';nope.text=unescape(lang.ts3_no_copy);element.appendChild(nope)}}})} else{var element=document.getElementById('serverCreateServerCopyPort');while(element.childNodes.length>=1) {element.removeChild(element.firstChild)};nope=document.createElement('option');nope.value='nope';nope.text=unescape(lang.ts3_no_copy);element.appendChild(nope)}};function deleteTeamspeakChannel(cid,sid) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteChannel',cid:cid,instanz:instanz,port:port,serverid:sid},success:function(data){if(data=='done') {setNotifySuccess(lang.channel_deleted)} else{setNotifyFailed(data)}}})};function deleteDBClientTime() {var datapickerValue=$('#datapickerClients').val().split(".");datapickerValue=datapickerValue[1]+'.'+datapickerValue[0]+'.'+datapickerValue[2];datapickerValue=new Date(datapickerValue).getTime()/1000;if(!isNaN(datapickerValue)) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteDBClient',time:datapickerValue,instanz:instanz,port:port},success:function(data){var ids=JSON.parse(data);if(ids.success) {$('#clientsTable').bootstrapTable('remove',{field:'id',values:ids.ids});setNotifySuccess(lang.client_successfull_deleted)} else{setNotifyFailed(data)}}})};$('#modalAreYouSure').modal('hide')};function deleteDBClient(cldbid) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteDBClient',cldbid:cldbid,instanz:instanz,port:port},success:function(data){if(data=='done') {deleteRow=Array(cldbid);$('#clientsTable').bootstrapTable('remove',{field:'id',values:deleteRow});setNotifySuccess(lang.client_successfull_deleted)} else{setNotifyFailed(data)}}})};function showServerRequest(file) {$("#mainContent").fadeOut("fast",function() {$("#mainContent").load('./php/teamspeak/web_teamspeak_server_requests_info.php',{"file":file},function() {$("#mainContent").fadeIn("fast")})})};function deleteFile(path,cid,id) {$.ajax({type:"POST",url:"./php/functions/functionsTeamspeakPost.php",data:{action:'deleteFileFromFilelist',cid:cid,path:encodeURIComponent(path),instanz:instanz,port:port},success:function(data){if(data=='done') {deleteRow=Array(id);$('#fileTable').bootstrapTable('remove',{field:'id',values:deleteRow});setNotifySuccess(lang.file_delete_success)} else{setNotifyFailed(data)}}})}