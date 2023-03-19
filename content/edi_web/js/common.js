/* +++ const_default.js +++ */
var Model_name="AVS-MT1314F";
var Trunk_num = 4;
var Port_num = 14;
var PoePort_num = 8;
var Timeout=5000;
var Max_Vlan_Id = 4094;
var SaveCheckTime = 8;
var Def_Vlan_Interface_Name = "System";
var Func_Bitmap="128-0-0-0", Func_Bitmap_Len=4;
/* --- const_default.js --- */

/* +++ func_bitmap.js +++ */
var FuncBitmapArray = null;
var FUNCTION_SUPPORT = 1;
var FUNCTION_NOT_SUPPORT = 2;

/*Add Function Bit location here*/
var FUNCTION_BIT_MAP_POE = 1;

/*Web Tree Name*/
var POE_Web_TREE_NAME = 'Power over Ethernet';
function IS_Support_Function(BitArray,FuncBitloc)
{
    if(BitArray == null)
        BitArray = Func_Bitmap.split("-");

    var bitBytePos = 0;
    var bitBitPos = 0;
    var BITS_PER_BYTE = 8;
    var BitMaskMap = new Array(0x01, 0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02);

    bitBytePos = parseInt(FuncBitloc/BITS_PER_BYTE);
    bitBitPos = parseInt(FuncBitloc%BITS_PER_BYTE);
    if(bitBitPos == 0) {bitBytePos -= 1;}
    if(bitBytePos < Func_Bitmap_Len)
    {
        if ((BitArray[bitBytePos] & BitMaskMap[bitBitPos]) != 0)
        {
            return FUNCTION_SUPPORT;
        }
    }
    return FUNCTION_NOT_SUPPORT;
}
/* --- func_bitmap.js --- */

/* +++ page_table.js +++ */
/*
Description:    init the page ctrl
Parameter:
Usage:          initPageList();
*/
function initPageList()
{
    var panstr = "";
    panstr += '<div class="parallelDiv" id="Page_Info"></div>';
    panstr += '<div class="parallelDiv"><input value="     First Page     " type="button" onclick="OnFrist()"></div>';
    panstr += '<div class="parallelDiv"><input value="    Previous Page   " type="button" onclick="OnPre()"></div>';
    panstr += '<div class="parallelDiv"><input value="     Next Page     "  type="button" onclick="OnNext()"></div>';
    panstr += '<div class="parallelDiv"><input value="     Last Page     "  type="button" onclick="OnLast()"></div>';
    panstr += '<div class="parallelDiv">&nbsp; Page <input maxLength=3 size=3 name="Go_Page_Name"><input value=GO type="button" onclick="OnGo()"></div>';

    GetElement("divPage").innerHTML =panstr;
    UpdateTable(1);
}
/*
Description:    the table has page ctrl
Parameter:      strEmpty:the string will show when table is empty
Usage:          PageTable("<< Table is empty >>");
*/
function PageTable(strEmpty)
{
    var tablename=arguments[1]?arguments[1]:"TableShow";
    var TableShow=[];
    if(Entity.length==0)
    {
        var Row={};
        Row["Empty"] = strEmpty;
        TableShow.push(Row);
        for(var i=0;i<TableShow.length;i++)
        {
            InsertRow(TableShow,i,true,"textContent",tablename);
        }
    }
    else
    {
        PagingTable();
    }
}
/*
Description:    delete the table's data first,then add new rows
Parameter:
Usage:          PagingTable();
*/
function PagingTable()
{
    if(TableShow!="")
    {
        for(var j=0;j<TableShow.length;i++)
        {
            document.getElementById('TableShow').deleteRow(-1);
            j++;
        }
    }
    TableShow= JsonConvertForShow();

    for(var i=0;i<TableShow.length;i++)
    {
        InsertRow(TableShow,i,false,"textContent");
    }
}


/*
Description:    get first record
Parameter:
Usage:          GetBeginIndex();
*/
function GetBeginIndex()
{
    if(Entity.CurrutPageIndex < 1)
        Entity.CurrutPageIndex =1;
    if(Entity.CurrutPageIndex > Math.ceil(Entity.length/Entity.EntitiesPerPage))
        Entity.CurrutPageIndex =Math.ceil(Entity.length/Entity.EntitiesPerPage);
    return (Entity.CurrutPageIndex-1) * Entity.EntitiesPerPage +1;
}
/*
Description:    get last record
Parameter:
Usage:          GetEndIndex();
*/
function GetEndIndex()
{
    var max = (Entity.CurrutPageIndex) * Entity.EntitiesPerPage;
    if(max > Entity.length)
    {
        max = Entity.length;
    }
    return max;
}
/*
Description:    goto first page
Parameter:
Usage:          OnFrist();
*/
function OnFrist()
{
    UpdateTable(1);
}
/*
Description:    goto last page
Parameter:
Usage:          OnLast();
*/
function OnLast()
{
    UpdateTable(Math.ceil(Entity.length/Entity.EntitiesPerPage));
}
/*
Description:    goto previous page
Parameter:
Usage:          OnPre();
*/
function OnPre()
{
    if(Entity.CurrutPageIndex>1)
    {
    Entity.CurrutPageIndex -=1;
    }
    UpdateTable();
}
/*
Description:    goto next page
Parameter:
Usage:          OnNext();
*/
function OnNext()
{
    var lastPage = Math.ceil(Entity.length/Entity.EntitiesPerPage);
    if(Entity.CurrutPageIndex<lastPage)
    {
        Entity.CurrutPageIndex +=1;
    }
    UpdateTable();
}
/*
Description:    goto the page which input in 'Go_Page_Name'
Parameter:
Usage:          OnGo();
*/
function OnGo()
{
    var val = parseInt(GetElement('Go_Page_Name').value);
    UpdateTable(val);
}
/*
Description:    Refresh the table
Parameter:      pageNum: the number of page which will show
Usage:          UpdateTable(1);
*/
function UpdateTable(pageNum)
{
    if(pageNum)
        Entity.CurrutPageIndex = pageNum;
    if(Entity.length == 0)
        Entity.CurrutPageIndex = 0;
    PagingTable();
    GetElement("Page_Info").innerHTML ='Page: '+
    Entity.CurrutPageIndex+'/'+Math.ceil(Entity.length/Entity.EntitiesPerPage)+"&nbsp;&nbsp;";
}
/* --- page_table.js --- */

/* For backward compability of the alert, confirm, promt. */
function alert(msg) {
    jAlert(msg, "WARNING", null);
}

function confirm(msg) {
    jConfirm(msg, "WARNING", null);
}

function prompt(msg, defaultValue) {
    jPrompt(msg, defaultValue, "WARNING", null);
}

/* +++ page_view.js +++ */
/*
 * java scirpt for conmmon page
 */
$(document).ready(function()
{
    window.onresize = function()
    {
        $(".PageTbl").width(895); //635
    }

    if(typeof CB_OnPageInit != 'undefined' )
        CB_OnPageInit();

    PageTitleInit();
    TableTitleInit();
        /*check special character*/
    $(".speChar").blur(function() {
        if(CheckSpecChar($(this).val())==false)
        {
            var ctrl = $(this);
            jAlert(COMMON_Err.speChar, 'WARNING', function() {
                ctrl.focus();
                ctrl.select();
            });
        }
    });

    $(".speNum").blur(function() {
        if($(this).val()!="")
        {
            if(checkForNum($(this).val())==false)
            {
                var ctrl = $(this);
                jAlert(COMMON_Err.number, 'WARNING', function() {
                    ctrl.focus();
                    ctrl.select();
                });
            }
        }
    });

    $("input[type='radio']").change(function() {
        $("input[type='radio']").attr('onChange');
    });

    $("input[type='checkbox']").change(function() {
        $("input[type='checkbox']").attr('onChange');
    });
    //InitButtonBox();

    ChangeBtnStyle();

});

function ChangeBtnStyle()
{
    $('input[type=button]').each(function() {
        $("input[type='button']:enabled").addClass("button1");
        $("input[type='button']:disabled").addClass("button1Dbl");
        //alert ctrl
        $("div[id='popup_panel'] input[type='button']").removeClass("button1");
        $("div[id='popup_panel'] input[type='button']").removeClass("button1Dbl");
        //deleteall ctrl
        $("div[id='divDelAll'] input[type='button']:enabled").removeClass("button1");
        $("div[id='divDelAll'] input[type='button']:enabled").addClass("buttonDelAll");
        $("div[id='divDelAll'] input[type='button']:disabled").removeClass("button1Dbl");
        $("div[id='divDelAll'] input[type='button']:disabled").addClass("buttonDelAllDbl");
        //paging ctrl
        $("div[id='PagingBox'] input[type='button']:enabled").removeClass("button1");
        $("div[id='PagingBox'] input[type='button']:enabled").addClass("button2");
        $("div[id='PagingBox'] input[type='button']:disabled").removeClass("button1Dbl");
        $("div[id='PagingBox'] input[type='button']:disabled").addClass("button2Dbl");
    });

    $('td input[type=button]').each(function() {
        $("td input[type='button']:enabled").removeClass("button1");
        $("td input[type='button']:enabled").addClass("button2");
        $("td input[type='button']:disabled").removeClass("button1Dbl");
        $("td input[type='button']:disabled").addClass("button2Dbl");
    });
}

function SetIEWidth()
{
    if(!$.support.leadingWhitespace)//for IE
    {
        $("#overflowIE").width(895);
        $(".TblHead").width(895);
        $("#TableShow").css("margin-bottom","15px");
    }
}

function PageTitleInit()
{
    $(".textTitle").hide();
    return;
}

function TableTitleInit()
{
    $(".TblHead").each(function(){
        var sHtml='<div class="HeadBg f_left HeadBgLeft"></div> \
        <div class="f_left">'+$(this).attr("title")+'</div> \
       <div id="HelpBox" class="HeadBg f_right HeadBgRight"></div>';
    $(this).html(sHtml);
    });
    return;
}
/* --- page_view.js --- */

/* +++ util_lib.js +++ */
/*
 * (Batch)Change Input status.
 * arrName: Button-Name, or Button-Name array.
 * bStatus : true(default)
 * eg:
 * disabled 3 below button
 * EnableBtn(["CANCEL","REFRESH", "APPLY"], false);
 */
function EnableInput(arrName, bStatus)
{
    if(typeof(bStatus)== "undefined")
        bStatus = true;
    var arr =[];
    if(typeof(arrName)=="string")
        arr[0] = arrName;
    else
        arr=arrName;
    if(arr.length<1) return false;
    var btn;
    for(var i=0; i<arr.length; i++)
    {
        btn = $('input[name="'+arr[i]+'"]');
        btn.attr("disabled",!bStatus);
    }
    InitButtonBox();
}

//======== debug ==========
function Dbg(sInfo)
{
    sInfo ="DBG: "+sInfo;
    if (window.console)
        console.log(sInfo);
}
function Error(sInfo)
{
    sInfo ="ERROR: "+sInfo;
    if (window.console)
        console.error(sInfo);
    else
        alert(sInfo);
}
function Warn(sInfo)
{
    sInfo ="WARN: "+sInfo;
    if (window.console)
        console.warning(sInfo);
}

//======== Table operation ==========
function RowLen(tableid)
{
    return $("#"+tableid+" tr").length;
}

//rowIdx from 1 ~ len
function DelRow(tableid, rowIdx)
{
    var rowsnum = RowLen(tableid);
    if(rowIdx<1 || rowIdx>rowsnum)
        return false;

    $("#"+tableid+" tr:eq("+rowIdx+")").remove();
    return true;
}

//nto ==0 , equal num.
function DelRows(tableid, nfrom, nto)
{
    var num = RowLen(tableid);
    if (nto == 0)
        nto = num;
    //console.log("len " + num);
    if (nfrom < 1 || nfrom > num || nto < 1 || nto > num)
    {
        //Error("error  param in DelRows, nfrom="+nfrom+", nto="+nto);
        return false;
    }
    if (nfrom > nto)
    {
        //Error("error  param in DelRows, nfrom="+nfrom+", nto="+nto);
        return false;
    }
    for (var i =nto; i >= nfrom; i--)
    {
        $("#" + tableid + " tr:eq(" + i + ")").remove();
    }
    return true;
}

/*
 * Mac Address to HexString.
 * MacArray: Mac Address array.
 * bStatus : true or false
 * eg:
 * make web input mac address like "00-11-22-33-44-55"
 * or "00:11:22:33:44:55"  to HEX String
 * Mac2HexString(MacAddressVlaue);
 */
function  Mac2HexString(MacArray)
{
    var hexStringArray =MacArray.split("-");
    if(hexStringArray.length  != 6)
    {
        hexStringArray = MacArray.split(":");
        if(hexStringArray.length  != 6)
        {
            return false;
        }
    }
    var  txt ="";
    /*var arrLen=arguments[1]?(hexArray.length/2-1):(hexArray.length-1);*/
    var arrLen=hexStringArray.length-1;
    for(var i=0; i< arrLen ; i++)//
    {
        txt +=hexStringArray[i].toString(16)+":";
    }
    txt += hexStringArray[hexStringArray.length-1].toString(16);
    return txt;
}

/*
 * Format the Mac Address.
 * MacArray: Mac Address array.
 * eg:
 * make web input mac address like "00-11-22-33-44-55",
 * "00:11:22:33:44:55" or "001122334455" to "001122334455"
 * FormatMac(MacAddress);
 */
function FormatMac(sMac)
{
    sMac = sMac.replace(/-/g, '');
    sMac = sMac.replace(/:/g, '');
    return sMac;
}
/* --- util_lib.js --- *///get ctrl's value
var PORT_NUM_INROW = 16;
var PORT_MAXNUM = 32;
function GetElement(ctrlName)
{
	var ctrl;
	ctrl= document.getElementsByName(ctrlName);
	if(ctrl.length ==1)
		return ctrl[0];

	ctrl = document.getElementById(ctrlName);
	if(ctrl)
		return ctrl;
	return false;
}

//get value of Gambit
function GetInputGambit()
{
	return GetElement("Gambit").value;
}

//get value of param from url
function GetParam(ParamName)
{
	ParamName = ParamName?ParamName:"Param";
	var args = GetUrlParms();
	return args[ParamName];
}

//get index number in array accord index value
function GetEntityByIndex(indexName,indexValue,entityName)
{
	var entityVal=arguments[2]?arguments[2]:Entity;

	for(var i=0; i<entityVal.length; i++)
	{
		if(entityVal[i][indexName]==indexValue)
		{
			return i;
		}
	}
	return null;
}

//get multi-index number in array accord index value
function GetEntityByMultIndex(entity,indexNameFirst,indexFirstValue,indexNameSed,indexSedValue)
{
	var indexNameThr=arguments[5]?arguments[5]:0;
	var tblThrValue=arguments[6]?arguments[6]:0;
	for(var i=0; i<entity.length; i++)
	{
		if((entity[i][indexNameFirst]==indexFirstValue)&&(entity[i][indexNameSed]==indexSedValue))
		{
			if(indexNameThr == 0)
				return i;
			else if(entity[i][indexNameThr] == tblThrValue)
				return i;
		}
	}
}

//get radio/checkbox's value
function GetRadioValue(radName)
{
	var objs = GetInputsByName(radName);
	for(var i in objs)
	{
	   if(objs[i].checked)
	   {
			return objs[i].value;
		}
	}
	return;
}

//set radio check according to value
function SetRadioValue(radName, value)
{
	var objs = GetInputsByName(radName);
	for(var i in objs)
	{
		if (objs[i].value == value)
		{
			objs[i].checked = true;
		}
	}
	return;
}

//fill "selName" with "values" when ctrl is select
function InitSelect(selName,values)
{
	var selObj = GetElement(selName);
	if(!selObj)
		return false;

	selObj.options.length   =   0;

	for(var txt in values)
	{
		selObj.options.add(new Option(txt,values[txt]));
	}
	return true;
}
//fill "selName" with "values" when "selName" is a array
function InitSelectArr(selName,values)
{
	var selObj = document.getElementsByName(selName);
	if(!selObj)
		return false;

	for(var i=0;i <selObj.length;i++)
	{
		selObj[i].options.length   =   0;

		for(var txt in values)
		{
			selObj[i].options.add(new Option(txt,values[txt]));
		}
	}
	return true;
}


function InitBoolSelect(selName)
{
	var val_list={
		"Enabled"		: 1,
		"Disabled"	: 2
	};
	InitSelect(selName,val_list);
}

//from 1/2/3/4/5/6/7/8/9 to 01/02/03/04/05/06/07/08/09
function InitIntSelect(selName,from, to)
{
	var selObj = GetElement(selName);
	if(!selObj)
	{
		return false;
	}
	selObj.options.length   =   0;
	for(var i=from; i<=to; i++)
	{
		var text = i;
		if(i<10)
			var text="0"+i;
		selObj.options.add(new Option(text,i));
	}
	return true;
}

function FillvalueSingle(listCtrl,listValue)
{
		ctl =GetElement(listCtrl);
		if(typeof(ctl.value) != "undefined")
			ctl.value = listValue;
		else
			ctl.innerHTML = listValue;

}
//fill "listCtrl" with "listValue" when ctrl is text
function Fillvalue(listCtrl,listValue)
{
	var ctl;
	if(!jQuery.isArray(listCtrl)&&!jQuery.isArray(listValue)){
	  FillvalueSingle(listCtrl,listValue);
	  return
    }
	for(var i=0; i<listCtrl.length; i++)
	{
		ctl =GetElement(listCtrl[i]);
		if(typeof(ctl.value) != "undefined")
			ctl.value = listValue[i];
		else
			ctl.innerHTML = listValue[i];
	}
}

//disable ctrl like button
function DisableCtrls(list,isDisabled)
{
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	for(var i=0; i<lists.length; i++)
	{
		GetElement(lists[i]).disabled = isDisabled;
		GetElement(lists[i]).readonly = isDisabled;
	}
}

//disable input/select ctrl
function DisableInputCtrls(list,isDisabled)
{
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	for(var i=0; i<lists.length; i++)
	{
		var cusName = lists[i];
		var ctl = $("[id="+cusName+"]");

		if(isDisabled)//true
		{
			ctl.attr("disabled","disabled");
			//ctl.attr("readonly","readonly");
			ctl.addClass("inDisable");
		}
		else
		{
			ctl.removeAttr("disabled");
			//ctl.attr("readonly","");
			ctl.removeClass("inDisable");
		}
	}
}

/*
Description:	enable or disable ctrl of html
Parameter:		list:list of ctrl
				isDisabled:true/false
Usage:			var svrCtrlList = ["sntpPollInterval","txtPriIp6N"];
DisableRadioCtrls(svrCtrlList,false);
*/
function DisableRadioCtrls(list, isDisabled)
{
	for(var i=0; i<list.length; i++)
	{
		var objs = GetInputsByName(list[i]);
		for(var k in objs)
		{
			objs[k].disabled = isDisabled;
			objs[k].readonly = isDisabled;
		}
	}
}

/*
Description:	display or hide ctrl of html
Parameter:		list:list of ctrl
			isDisplay: true/false
			displayType : type of display
Usage:			var ctrlsList = ["trSrcIPv6", "txtSrcIPv6Pre"];
			DisplayCtrl(ctrlsList,true,"table-row");
			DisplayCtrl(ctrlsList,true);
			DisplayCtrl(ctrlsList,false);
*/
function DisplayCtrl(list,isDisplay,displayType)
{
	var displayType = arguments[2]?arguments[2]:"block";
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	if(isDisplay == true)//display
	{
		for(var i=0; i<lists.length; i++)
			GetElement(lists[i]).style.display = displayType;
	}
	else//hide
	{
		for(var i=0; i<lists.length; i++)
			GetElement(lists[i]).style.display = "none";
	}
}

/*
Description:	insert one row which has checkbox to print table
Parameter:		celNum:num of cell
				tblName:the table which need insert
Usage:			InsertChkRow(8,"TableShow");

*/
function InsertChkRow(portNum,tblName,isAll)
{
	var classname=arguments[3]?arguments[3]:"textThBk";
	var chkName = tblName +"Id";

	var celNum = (portNum > PORT_NUM_INROW)?((portNum > PORT_MAXNUM)?portNum/3:portNum/2):portNum;

	var x=document.getElementById(tblName).insertRow(-1);//todo
	var cell = [];
	var i,j=0;

	x.align="center";
	if(isAll==true)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML="";
		cell[j].className=classname;
		cell[j].width="50px";
		j++;
	}
	for(i=0;i<celNum;i++)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML=(i+1);
		cell[j].className=classname;
		j++;
	}

	x=document.getElementById(tblName).insertRow(-1);
	cell = [];
	j=0;

	x.align="center";
	if(isAll==true)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='<input style="width:50px;" type="button" id="btnAll0" value="All" onclick="OnPortListSelAll(\''+chkName+'\',0);">';
		cell[j].align="left";
		cell[j].className=classname;
		j++;
	}
	for(var i=0;i<celNum;i++)
	{
		var portId = i+1;
		//var chkName = tblName +portId;
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='<input type="checkbox" id="'+chkName+'" name="'+chkName+'"' + 'onChange="ChangeCheckBox('+portId+')">';//"chkID"
		cell[j].className=classname;
		j++;
	}

	if(portNum > PORT_NUM_INROW)
	{	//Row3
		x=document.getElementById(tblName).insertRow(-1);//todo
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML="";
			cell[j].className=classname;
			cell[j].width="50px";
			j++;
		}
		var rowMax = (portNum > PORT_MAXNUM)?celNum*2:portNum;
		for(i=celNum;i<rowMax;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML=(i+1);
			cell[j].className=classname;
			j++;
		}
		//Row4
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='';
			cell[j].className=classname;
			j++;
		}
		for(var i=celNum;i<rowMax;i++)
		{
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="checkbox" id="'+chkName+'" name="'+chkName+'"' + 'onChange="ChangeCheckBox('+portId+')">';//"chkID"
			cell[j].className=classname;
			j++;
		}
	}

	if(portNum > PORT_MAXNUM)
	{	//Row5
		x=document.getElementById(tblName).insertRow(-1);//todo
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML="";
			cell[j].className=classname;
			cell[j].width="50px";
			j++;
		}
		for(i=celNum*2;i<portNum;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML=(i+1);
			cell[j].className=classname;
			j++;
		}
		//Row6
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='';
			cell[j].className=classname;
			j++;
		}
		for(var i=celNum*2;i<portNum;i++)
		{
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="checkbox" id="'+chkName+'" name="'+chkName+'"' + 'onChange="ChangeCheckBox('+portId+')">';//"chkID"
			cell[j].className=classname;
			j++;
		}
	}
	//$("table.MibTable tr:nth-child(odd)").addClass("MibTable1");
}

/*
Description:	insert one row which has radiobox to print table
Parameter:		celNum:num of cell
				tblName:the table which need insert
				isVerticallyGroup:the radio group is Vertically or parallel
				groupVal: group value
				isAll: is need "all" button
Usage:			InsertRadRow(8,"TableShow",true,i,ture);
				InsertRadRow(8,"TableShow",false,0,false);

*/
function InsertRadRow(portNum,tblName,isVerticallyGroup,groupVal,isAll)
{
	var classname=arguments[5]?arguments[5]:"textThBk";
	var radName = tblName +"Id";

	var celNum = (portNum > PORT_NUM_INROW)?((portNum > PORT_MAXNUM)?portNum/3:portNum/2):portNum;
	//Row1
	var x=document.getElementById(tblName).insertRow(-1);//todo
	var cell = [];
	var i,j=0;

	x.align="center";
	if(isAll==true)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML="";
		cell[j].className=classname;
		cell[j].width="50px";
		j++;
	}
	for(i=0;i<celNum;i++)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML=(i+1);
		cell[j].className=classname;
		j++;
	}
	//Row2
	x=document.getElementById(tblName).insertRow(-1);
	cell = [];
	j=0;

	x.align="center";
	if(isAll==true)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='<input style="width:50px;" type="button" id="btnAll'+groupVal+'" value="All" onclick="OnPortListSelAll('+tblName+','+groupVal+');">';
		cell[j].align="left";
		cell[j].className=classname;
		j++;
	}
	for(var i=0;i<celNum;i++)
	{
		if(isVerticallyGroup == true)
			radName = "chkID" +(i+1);
		var portId = i+1;
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='<input type="radio" id="'+radName+'" name="'+radName+'" value="'+groupVal+'" onChange="ChangeRadio('+portId+',this.value)">';//"chkID"
		cell[j].className=classname;
		j++;
	}
	//Row3
	if(portNum > PORT_NUM_INROW)
	{
		x=document.getElementById(tblName).insertRow(-1);//todo
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML="";
			cell[j].className=classname;
			cell[j].width="50px";
			j++;
		}
		var rowMax = (portNum > PORT_MAXNUM)?celNum*2:portNum;
		for(i=celNum;i<rowMax;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML=(i+1);
			cell[j].className=classname;
			j++;
		}
		//Row4
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='';
			cell[j].className=classname;
			j++;
		}
		for(var i=celNum;i<rowMax;i++)
		{
			if(isVerticallyGroup == true)
				radName = "chkID" +(i+1);
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="radio" id="'+radName+'" name="'+radName+'" value="'+groupVal+'" onChange="ChangeRadio('+portId+',this.value)">';//"chkID"
			cell[j].className=classname;
			j++;
		}

	}
	//Row 5
	if(portNum > PORT_MAXNUM)
	{
		x=document.getElementById(tblName).insertRow(-1);//todo
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML="";
			cell[j].className=classname;
			cell[j].width="50px";
			j++;
		}
		for(i=celNum*2;i<portNum;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML=(i+1);
			cell[j].className=classname;
			j++;
		}
		//Row6
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		if(isAll==true)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='';
			cell[j].className=classname;
			j++;
		}
		for(var i=celNum*2;i<portNum;i++)
		{
			if(isVerticallyGroup == true)
				radName = "chkID" +(i+1);
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="radio" id="'+radName+'" name="'+radName+'" value="'+groupVal+'" onChange="ChangeRadio('+portId+',this.value)">';//"chkID"
			cell[j].className=classname;
			j++;
		}

	}
	//$("table.MibTable tr:nth-child(odd)").addClass("MibTable1");
}

function  OnPortListSelAll(chkName,rowNum)
{
	var btnName = "btnAll" + rowNum;
	var val = GetElement(btnName).value;
	var flag;

	if(rowNum==0)
	{
		if(val == "All")
		{
			GetElement(btnName).value = "Clear";
			flag = true;
		}
		else//clear
		{
			GetElement(btnName).value = "All";
			flag = false;
		}
		var chk = document.getElementsByName(chkName);
		for(var i=0; i<Port_num; i++)
		{
			if(chk[i].disabled == false)
				chk[i].checked = flag;
		}
	}
	else
	{
		for(var i=1;i<=Port_num;i++)
		{
			var ctrlName = "chkID" +i;
			var chk = document.getElementsByName(ctrlName);
			chk[rowNum-1].checked = true;
		}
	}
}

/*
Description:	insert one row to print table
Parameter:		jsonTable:the data which make up will be show
				rowIndex:index of row which need insert
				emptyFlag:table is empty or not
				className:cell's class(Optional parameters)
Usage:			InsertRow(TableShow,index,true,"textContent");
				InsertRow(TableShow,index,false);
*/
function InsertRow(jsonTable,rowIndex,emptyFlag)
{
	//var classname=arguments[3]?arguments[3]:"textThBk"; //if table is empty,use "textContent"
	var classname= "textThBk";
	var tblName=arguments[4]?arguments[4]:"TableShow";

	var tableObj = document.getElementById(tblName);
	var x= tableObj.insertRow(-1);
	var cell = [];
	var i=0;
	var cellLength = tableObj.rows[0].cells.length; //(Edimax) get the columns in table

	 /* Check the from and to indexes */
    if(typeof(PagingFrom)!="undefined"&&typeof(PagingTo)!="undefined"){
    if (rowIndex < PagingFrom || rowIndex > PagingTo)
        return;
    }

	x.align="center";

	for(var item in jsonTable[rowIndex])
	{
		cell[i]=x.insertCell(i);
		cell[i].innerHTML=jsonTable[rowIndex][item];
		//if(i==0)
		cell[i].className=classname;
		if(emptyFlag==true)
			cell[i].colSpan = cellLength; //(Edimax) The colSpan number should be equal to columns

		i++;
	}

	//$("table.MibTable tr:nth-child(odd)").addClass("altrow");
}

/*
Description:	get one row from json table
Parameter:		jsonTable:the table which need insert
				indexName:the name of index in json table
				rowIndex:index of row which will search
				emptyFlag:table is empty or not
Usage:			InsertRow(TableShow,index,true,"textContent");
*/
function GetTabRow(jsonTable, indexName, rowIndex)
{
	var row;
	for(var i=0;i<jsonTable.length;i++)
	{
		row = jsonTable[i];
		if(typeof(row) === 'undefined')
		{
			return null;
		}

		if(parseInt(row[indexName]) == rowIndex)
		{
			return row;
		}
	}
	return null;
}

function ChkRadGroup(){}
/*
Description:
	get/set for Checkbox & radio group  while the group is in line
Parameter:		tblName:the table which need insert
				portLen:the length of portlist to set
Usage:
	var portGroup=new ChkRadGroup();
	portGroup.getPortInLine("chk"+id,4);
Return:
	strPort
*/
ChkRadGroup.prototype.getPortInLine = function(tblName,portLen)
{
	var chkRadName = tblName +"Id";
	var chk = document.getElementsByName(chkRadName);
	var arrOutPlt=[];

	for(var i=0;i <Port_num;i++)
	{
		if(chk[i].checked == true)
		{
			arrOutPlt.push(i+1);
		}
	}

	var out_plt = new PortList(arrOutPlt,"PortArray");
	//suport different port length
	var strPort = out_plt.getHexString();
	var out_plt_len = out_plt.getHexString().length;

	if(out_plt_len>portLen*2)
		strPort = strPort.substr(0,portLen*2);
	else if(out_plt_len<portLen*2)
	{
		for(var j=out_plt_len;j <portLen*2;j++)
			strPort = strPort+"0";
	}
	return strPort;//out_plt.getHexString();
}
/*
Description:
	get/set for Checkbox & radio group while the group is in line
Parameter:		tblName:the table which need insert
				portList:the port List to set
Usage:
	var portGroup=new ChkRadGroup();
	portGroup.setPortInLine("chk"+id,"C0:00:00:00");
Return:
	strPort
*/
ChkRadGroup.prototype.setPortInLine = function(tblName,portList)
{
	var chkRadName = tblName +"Id";
	var chk=document.getElementsByName(chkRadName);
	var arrPlt = new PortList(portList,"HexString");

	for(var i=1; i<Port_num+1; i++)
	{
		chk[i-1].checked = false;
		if(arrPlt.has(i) == true)
		{
			chk[i-1].checked = true;
		}
	}
}
/*
Description:
	get/set for Checkbox & radio group  while the group is in Vertically
Parameter:		rowIndex:the index in group
				isArrFlag: out put is array (or hexStr)
				portLen:the length of portlist to set
Usage:
	var portGroup=new ChkRadGroup();
	portGroup.getPortInVertically(1,false,4);
	portGroup.getPortInVertically(1,true);
Return:
	strPort
*/
ChkRadGroup.prototype.getPortInVertically = function(rowIndex,isArrFlag,portLen)
{
	var chkRadName;
	var arrOutPlt=[];
	var chk;

	for(var i=0;i <Port_num;i++)
	{
		chkRadName = "chkID" +(i+1);
		chk = document.getElementsByName(chkRadName);

		if(chk[rowIndex-1].checked == true)
		{
			arrOutPlt.push(i+1);
		}
	}

	var out_plt = new PortList(arrOutPlt,"PortArray");
	if(isArrFlag == true)
		return out_plt;
	else
	{
		if(typeof(portLen) === "undefined")
			return out_plt.getHexString();
		else
		{
			//suport different port length
			var strPort = changeHexStrLen(out_plt,portLen);
			return strPort;
			/*var strPort = out_plt.getHexString();
			var out_plt_len = out_plt.getHexString().length;

			if(out_plt_len>portLen*2)
				strPort = strPort.substr(0,portLen*2);
			else if(out_plt_len<portLen*2)
			{
				for(var j=out_plt_len;j <portLen*2;j++)
					strPort += strPort+"0";
			}
			return strPort;//out_plt.getHexString();*/
		}
	}
}
/*
Description:
	get/set for Checkbox & radio group while the group is in Vertically
Parameter:		portList:the port List to set
				rowIndex:the index in group
Usage:
	var portGroup=new ChkRadGroup();
	portGroup.setPortInLine("C0:00:00:00",1);
Return:
	strPort
*/
ChkRadGroup.prototype.setPortInVertically = function(portList,rowIndex)
{
	var chkRadName;
	var chk;
	var arrPlt = new PortList(portList,"HexString");

	for(var i=1; i<Port_num+1; i++)
	{
		chkRadName = "chkID" +i;
		chk = document.getElementsByName(chkRadName);
		chk[rowIndex-1].checked = false;
		if(arrPlt.has(i) == true)
		{
			chk[rowIndex-1].checked = true;
		}
	}
}
/*
Description:	change hex str lenght
Parameter:		portLit:port list(array)
                portLen:hex string lenght
Usage:			changeHexStrLen(out_plt,portLen);
*/
function changeHexStrLen(portLit,portLen)
{
	var strPort = portLit.getHexString();
	var out_plt_len = portLit.getHexString().length;

	if(out_plt_len>portLen*2)
		strPort = strPort.substr(0,portLen*2);
	else if(out_plt_len<portLen*2)
	{
		for(var j=out_plt_len;j <portLen*2;j++)
			strPort += "0";
	}
	return strPort;
}
/*
Description:	init ip or mac ctrl
Parameter:		cusName:the div name which need the ctrl
                strSplit:the type to split,such as ":"/"."
Usage:			initCusCtrl("inputMac",":");
*/
function initCusCtrl(cusName,strSplit)
{
	cusid=cusName+"N";
	var maxlength;
	var className ="";
	if(strSplit==":")
	{
		maxlength=2;
		className = "macStyle";
	}
	else if(strSplit==".")
	{
		maxlength=3;
		className = "flat";
	}
	var strCus = '<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" 	value="" type="text">&nbsp;';
		strCus += strSplit+'&nbsp;<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" value="" type="text">&nbsp;';
		strCus += strSplit+'&nbsp;<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" value="" type="text">&nbsp;';
		strCus += strSplit+'&nbsp;<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" value="" type="text">';
		if(strSplit==":")
		{
			strCus += "&nbsp;"+strSplit+'&nbsp;<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" value="" type="text">&nbsp;';
			strCus += strSplit+'&nbsp;<input class="'+className+'" id="'+cusid+'" name="'+cusid+'" size="4" maxlength="'+maxlength+'" value="" type="text"> ';
		}

	GetElement(cusName).innerHTML =strCus;

	//EDIMAX_MODIFICATION
    var selObj = document.getElementsByName(cusid);

    for(var i = 0; i < selObj.length; i++) {
        selObj[i].onkeypress  = function(event){
            event = event || window.event
            var key = event.which || event.keyCode;
            var valueLength = this.value.length;

            var index = jQuery.inArray(this, selObj);
            if (index !== selObj.length - 1) {
                nextObj = selObj[index + 1];
            } else {
                nextObj = null;
            }

            /* MAC Address */
            if (strSplit === ":") {
                if ((key >= 97 && key <= 102) ||
                    (key >= 65 && key <= 70) ||
                    (key >= 48 && key <= 57)) {

                    if (nextObj !== null && valueLength == this.maxLength - 1) {
                        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                        this.value += String.fromCharCode(key);
                        nextObj.select();
                    }

                } else {
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                }

            } else if (strSplit === ".") {
                /* IP address */
                if (key < 48 || key > 57) {
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    if (key === 46 && nextObj !== null && valueLength != 0)
                        nextObj.select();

                } else if (nextObj !== null && valueLength == this.maxLength - 1) {
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    this.value += String.fromCharCode(key);
                    nextObj.select();
                }
            }
        }

        /* The onkeydown event is used to handle backspace (keycode == 8) */
        selObj[i].onkeydown = function(downEvent) {
            downEvent = downEvent || window.event
            var downKey = downEvent.which || downEvent.keyCode;

            var downIndex = jQuery.inArray(this, selObj);
            if (downIndex !== 0) {
                downNextObj = selObj[downIndex - 1];
            } else {
                downNextObj = null;
            }

            if (downKey === 8 && this.value.length === 0 && downNextObj !== null) {
                downEvent.preventDefault ? downEvent.preventDefault() : (downEvent.returnValue = false);
                downNextObj.select();
            }
        }
    }
    //EDIMAX_MODIFICATION
}
/*
Description:	set the ctrl's value
Parameter:		cusValue:the value to set
                cusName:the div name which will be set
				strSplit:the type to split,such as ":"/"."
Usage:			setCusCtrlValue("inputMac","11:22:33:44:55:66",":");
				setCusCtrlValue("inputIp","1.2.3.4",".");
*/
function setCusCtrlValue(cusName,cusValue,strSplit)
{
	var cusid=cusName+"N";
	var arrCus = cusValue.split(strSplit);
	var selObj = document.getElementsByName(cusid);
	for(var i=0;i<selObj.length;i++)
	{
		if(arrCus=="")
			selObj[i].value = "";
		else
			selObj[i].value = arrCus[i].toUpperCase();
	}
}
/*
Description:	get the ctrl's value
Parameter:		cusName:the div name which need get data
				strSplit:the type to split,such as ":"/"."
Usage:			getCusCtrlValue("inputMac",":");
*/
function getCusCtrlValue(cusName,strSplit)
{
	var cusid=cusName+"N";
	var selObj = document.getElementsByName(cusid);
	var strCus = selObj[0].value.toUpperCase();

	//if(strCus!="")
	//	strCus = selObj[0].value.toUpperCase();

	for(var i=1;i<selObj.length;i++)
	{
		if(strCus == "")
		{
			if(selObj[i].value!="")
				return null;
		}
		else
		{
			if(selObj[i].value=="")
				return null;
			else
				strCus += strSplit+selObj[i].value.toUpperCase();
		}
	}

	return strCus;
}

/*
Description: enable/disable the ctrl
Parameter:  list:the div name which need get data
    isDisabled:enable/disable
Usage:			DisCusCtrl("inputMac",true);
*/
function DisCusCtrl(list,isDisabled)
{
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	for(var i=0; i<lists.length; i++)
	{
		var cusName = lists[i] + "N";
		var ctl = $("input[id="+cusName+"]");

		if(isDisabled)//true
		{
			ctl.attr("disabled","disabled");
			ctl.attr("readonly","readonly");
			ctl.addClass("inDisable");
		}
		else
		{
			ctl.removeAttr("disabled");
			ctl.attr("readonly","");
			ctl.removeClass("inDisable");
		}
	}
}

/*
Description:	get the la info (channel,member) by port
Parameter:		portId: port id
				entity
Usage:			var laInfo = getLaInfo(1);
				laInfo.isInLA
				laInfo.channelId
				laInfo.lamember
				laInfo.lamemberNoSelf
*/
var Form_Common_laInfoCache = undefined;
function getLaInfo(portId,entity)
{
	var find = false;

	if(typeof(entity) === "undefined") {
	    if (Form_Common_laInfoCache === undefined) {
	        var Entity = RpcGet('/api/lag/get');
	        Form_Common_laInfoCache = Entity;
	    } else {
	        Entity = Form_Common_laInfoCache;
	    }
	}
	else
		var Entity = entity;

	var laInfo={};
	laInfo.isInLA = false;
	laInfo.channelId = 0;
	laInfo.lamember=[];
	laInfo.lamemberNoSelf=[];

	if(Entity===false)
		return;

	var plist = Entity.availPortList;

	$.each(Entity.availPortList, function(port_idx, plist) {
        if (plist.id === portToifIndex(portId) && plist.lag !== 0) {
            /* Found the portId and it's in LAG */
            laInfo.isInLA = true;

            $.each(Entity.lagList, function(idx, lagObj) {
               if (lagObj.id === plist.lag) {
                   laInfo.channelId = lagObj.descr;
                   $.each(lagObj.members, function(idx2, ifindex) {
                       laInfo.lamember.push(ifIndexToPort(ifindex));

                       if (ifIndexToPort(ifindex) !== portId)
                           laInfo.lamemberNoSelf.push(ifIndexToPort(ifindex));
                   });
                   return false;
               }
            });
            return false; //break $.each function
        }
	});

	if (laInfo.isInLA === true)
	    return laInfo;
	else
	    return false;
}

/*
Description:	print empty table
Parameter:		strEmpty: empty string
                tablename:table name(Optional parameters)
Usage:			PrintEmptyTable("XX is empty","TableShow");
				PrintEmptyTable("XX is empty");
*/
function PrintEmptyTable(strEmpty,tablename)
{
	var tablename=arguments[1]?arguments[1]:"TableShow";
	var TableShow=[];

	var Row={};
	Row["Empty"] = strEmpty;
	TableShow.push(Row);
	for(var i=0;i<TableShow.length;i++)
	{
		InsertRow(TableShow,i,true,"textContent",tablename);
	}
}

function GetObjValues(Obj, names)
{
	if(typeof(names) === "String")
		return Obj[names];

	var vals = [];
	for(var i=0; i<names.length; i++)
	{
		vals[i] = Obj[names[i]];
	}
	return vals;
}

function GetCtrlVal(name, prefix)
{
	if(typeof(prefix) === "undefined")
		prefix ='';
	var value;
	var ctl =GetElement(name+prefix)
	if(typeof(ctl.value) != "undefined")
		value = ctl.value;
	else
		value =ctl.innerHTML;
	return value;
}

function SetCtrlVal(name, val, prefix)
{
	if(typeof(prefix) === "undefined")
		prefix ='';
	var ctl =GetElement(name+prefix)
	if(typeof(ctl.value) != "undefined")
		ctl.value = val;
	else
		ctl.innerHTML = val;
}

function GetPairs(names, prefix)
{
  var pairs ={};
  var novname=99;
  var vname=arguments[2]?arguments[2]:novname;


  if(typeof(names) === "String")
  	names = [names];

  if(typeof(prefix) === "undefined")
  	prefix ='';

  if(typeof(vname) === "String"&&vname!=novname){

  	vnames = [vname];
   }

  for(var i=0; i<names.length; i++)
  {
  	var name = names[i];
    if(vname!=novname)
      pairs[vname[i]] =GetCtrlVal(name, prefix);
    else
  	  pairs[name] =GetCtrlVal(name, prefix);
  }
	return pairs;
}

/*Validator class*/
function Validator(){}
/*
Description:
	Mac Validator
Usage:
	var valid=new Validator();
	valid.Mac("00:11:22:33:44:55","Mac is illegal.");
	valid.Mac("00-11-22-33-44-55","Mac is illegal.");
	valid.Mac("001122334455","Mac is illegal.");
Return:
	true or false;
*/
Validator.prototype.Mac = function(sMac,sErrMsg)
{
	var reg_name;

	if(sMac.indexOf('-',1)!=-1)
	{
		reg_name=/^([A-F,a-f\d]{2}-){5}[A-F,a-f\d]{2}$/;
	}
	else if(sMac.indexOf(':',1)!=-1)
	{
		reg_name=/^([A-F,a-f\d]{2}:){5}[A-F,a-f\d]{2}$/;
	}
	else
	{
		reg_name=/^[A-F,a-f\d]{12}$/;
	}
	reg_name.lastIndex=0
	if(reg_name.test(sMac))
		return true;

	if(sErrMsg)
		jAlert(sErrMsg, "WARNING");
	return false;
}



/*check number and letter*/
function  CheckNumLetter(txtVal)
{
	if (txtVal!="")
	{
		reg_name=/^[A-Za-z0-9]+$/;

		if (!reg_name.test(txtVal))
			return false;
	}
	return true;
}

/*check number and range*/
function ValidateIntRange(ctrlName,max,min,errMes)
{
	var ctrlValue=GetElement(ctrlName).value;
	if (!checkForNum(ctrlValue)||ctrlValue<min||ctrlValue>max)
	{
		//alert(errMes);
		jAlert(errMes, 'WARNING');
		GetElement(ctrlName).select();
		GetElement(ctrlName).focus();
		return false;
	}
	return true;
}

/* check txtVal contains invalid char or not
eg:CheckCharInvalid(GetElement("txtSysName").value)
*/
function CheckCharInvalid(txtVal)
{
    var str1,str2,err;
    str1='~`!@#$%^&*{}[]|\\:;"\'<>,.?/';

    for(i=0;i<txtVal.length;i++)
	{
       str2=txtVal;
       str2 =str2.substr(i,1);
       err = str1.indexOf(str2);
       if(err>=0)
	   {
         return false;
       }
    }
	return true;
}

/*check special character except &, ', " three symbols.
 * & are used to connect parameters in query string;
 * ' and " are symbols to represent string in JS or HTML. */
function  CheckSpecChar(val)
{
    var reg_name= /^[A-Za-z0-9~`!@#%{}_=;:,<>&'"\|\+\-\(\)\$\/\^\*\.\[\]\\\?]*$/;
	if (!reg_name.test(val))
		return false;
	return true;
}

/* Check special characters, almost all special symbols on
 * keyboard are supported. This function should be used only
 * when your web pages won't pass the name via query string */
function  CheckSpecCharExtend(val)
{
    var reg_name= /^[A-Za-z0-9~`!@#%{}_=;:'",&<>\|\+\-\(\)\$\/\^\*\.\[\]\\\?]*$/;
    if (!reg_name.test(val))
        return false;
    return true;
}

/*check index exist
eg:
checkIndexExist(Entity,"fsMIMstInstanceIndex",GetElement("txtMSTIID").value)
checkIndexExist(Entity,"SnmpEngineID",GetElement("txtEngineID").value,"SnmpUsername",GetElement("txtUsername").value)
*/
function checkIndexExist(entity, index, chkval)
{
	var argsCount = arguments.length-1;
	var argsKeyVal = [];
    var flag = true;
	for(var i=1;i<=argsCount;i++)
	{
		var indexs = {};
		indexs["name"] = arguments[i];
		indexs["value"] = arguments[++i];
		argsKeyVal.push(indexs);
	}
	for(var i=0;i<entity.length;i++)
	{
		for(var j=0;j<argsKeyVal.length;j++)
		{
			var name = argsKeyVal[j].name;
			if(entity[i][name] != argsKeyVal[j].value)
			{
				flag = true; /* not duplicated */
				break;
			}
			else
			{
				flag = false; /* duplicated */
			}
		}
		if(flag == false)
			return false;
	}
	return true;
}
/*check ctrlName is Multi multiVal:16*N=256   */
function ValidateIntMulti(ctrlName,multiVal,errMes)
{
	var ctrlValue=GetElement(ctrlName).value;
	var diviVal = parseInt(multiVal);
	if (isNaN(ctrlValue)||(parseInt(ctrlValue)%diviVal)!=0)
	{
		jAlert(errMes, "WARNING");
		GetElement(ctrlName).select();
		GetElement(ctrlName).focus();
		return false;
	}
	return true;
}

/*function to validate whether the input is integer like "12"*/
function checkForNum(value)
{
	//if(value == -1) return true;
	var pattern = /^0$|^[1-9][0-9]*$/;
	if(pattern.test(value))
		return true;
   return false;
}

/*function to validate whether the input is consist of digits*/
function checkForDigit(value)
{
	var pattern=/^[0-9]*$/;
	if (!pattern.exec(value))
		return false
	return true
}
/*function to validate emal address*/
function CheckEmail(email)
{
    var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if(!pattern.test(email))
        return false;
    return true;
}

function ReloadJs(file)
{
    var head = $('head').remove('#loadScript');
    $('<script></script>').attr({src:file,type:'text/javascript',id:'load'}).appendTo(head);
}

/*function CheckPortlistformat(PortList, totalPortnum)
  can use "PortString2PortArray(GetElement("txtPortList").value)==null)"
*/

/*form 11-22-33-44-55-66 to 1122334455 or
  form 11:22:33:44:55:66 to 1122334455
*/
function MacFormatNoSplit(macAddress)
{
	var arr;
	var macAddressPost  ="";

	if(macAddress.indexOf('-',1)!=-1)
	{
		arr 	   = macAddress.split("-");
		for(var i=0;i<arr.length;i++)
		{
			macAddressPost+=arr[i];
		}
	}
	else if(macAddress.indexOf(':',1)!=-1)
	{
		arr 	   = macAddress.split(":");
		for(var i=0;i<arr.length;i++)
		{
			macAddressPost+=arr[i];
		}
	}
	else
	{
		macAddressPost = macAddress;
	}

	return macAddressPost;
}

/* form 11-22-33-44-55-66 to 11:22:33:44:55:66 */
function MacFormatChangeSplit(macAddress)
{
	var arrMac = [];
	var macAddressPost  ="";

	arrMac = macAddress.split("-");
	for(var i=0;i<arrMac.length;i++)
	{
		if(i == 0)
			macAddressPost+=arrMac[i];
		else
			macAddressPost+=":"+arrMac[i];
	}
	return macAddressPost;
}

/* form aa:bb:33:44:55:66 to AA:BB:33:44:55:66 */
function MacFormatChange2UpperCase(macAddress)
{
	var arrMac = [];
	var macAddressPost  ="";

	arrMac = macAddress.split(":");
	for(var i=0;i<arrMac.length;i++)
	{
		if(i == 0)
			macAddressPost+=arrMac[i].toUpperCase();
		else
			macAddressPost+=":"+arrMac[i].toUpperCase();
	}
	return macAddressPost;
}

/*====================================================================================================*/

//get value accord ctrl name used by GetRadioValue.
function GetInputsByName(name)
{
	var returns = new Array();
	var e = document.getElementsByTagName('input');
	for(i = 0; i < e.length; i++)
	{
		if(e[i].getAttribute('name') == name)
		{
			returns[returns.length] = e[i];
		}
	}
	return returns;
}

function GoToModifyPage(pageName, paramObj) {

    var url = pageName + "?";

    for (var element in paramObj)
        url += ("&" + element + "=" + escape(paramObj[element]));

    window.location.href = url;
}

//get value of param from url used by GetParam
function GetUrlParms()
{
	var args=new Object();
	var query=location.search.substring(1);

	var pairs=query.split("&");
	for(var i=0;i<pairs.length;i++)
	{
		var pos=pairs[i].indexOf('=');
			if(pos==-1)   continue;
			var argname=pairs[i].substring(0,pos);
			var value=pairs[i].substring(pos+1);
			args[argname]=unescape(value);
	}
	return args;
}

/* fot ati web page */
/* Descript:init the select controller
 * Params : selName:name of select controller
 *		 	val_list:value list for port 1~max
 *			all_list:value list for port "ALL"
 */
function InitSelectWithAll(selName, val_list, all_list)
{
	InitSelect(selName+'_0',all_list);

	for(var i=1;i<=Port_num;i++)
	{
		InitSelect(selName+'_'+i, val_list);
	}
}

/* Descript : insert controller name to the row of table in html.
 *			  use in table which with variable controller init.
 *	Params :  name and id to make the name of controller
				width:the width of ctrl
 */
function InsertSelectCtrl(name, id, width)
{
	if(arguments[2])
		return '<select id="'+name+'_'+id+'" style="width:'+arguments[2]+'"></select>';
	else
		return '<select id="'+name+'_'+id+'"></select>';
}

function InsertButtonCtrl(name, id, btnVal)
{
	return '<input type="button" id="'+name+'_'+id+'" value="'+btnVal+'" onclick="On'+btnVal+'('+id+');">';
}

function OnSuccess()
{
	jAlert("Success.", "INFORMATION");
}

/*
Description:	insert a text ctrl for ipv6 input
Parameter:		spanId:the span name which need the ctrl
Usage:			InsertIp6AddrCtrl("txtIpv6Addr");
*/
function InsertIp6AddrCtrl(spanId)
{
	var txtAddrCtrl = spanId+"N";
	var spanName = txtAddrCtrl+"_interface";
	var hml='<input type="text" size=40 maxlength=39 name="'+ txtAddrCtrl +'" id="' + txtAddrCtrl +'" class="lflat" ONBLUR=OnIp6AddrBlur("'+txtAddrCtrl+'")>';
	hml+='<span id="'+ spanName+'"></span>'

	GetElement(spanId).innerHTML = hml;
}

function OnIp6AddrBlur(spanId)
{
	/*
	//0005976: [0022946]ATI Confirm does need to remove interface name(%System) for IPv6 Link local address. (ATI Bug ID: 328)
	var txtAddrCtrl = spanId;
	var spanName = spanId+"_interface";
	var value=GetElement(txtAddrCtrl).value;

	if(value!=undefined&&value.length!=0)
	{
		var type=ipv6_addr_type(value);
		if(type==3) // if input is a  link-local address,then add interface name to the end
		{
			GetElement(spanName).innerHTML = "%"+Def_Vlan_Interface_Name;
		}
	}*/
	return true;
}

function ReloadPage(url)
{
    if (window.location.protocol === "file:")
        window.location.href = url+"?Gambit="+GetInputGambit();
    else
        window.location.href ="/iss/"+url+"?Gambit="+GetInputGambit();
}

function ReloadJs(url)
{
	$.ajax({
	  url: url,
	  dataType: "script",
	  async:false
	});
}

/*normal string to hex string
 *eg: "abcdefg" -> "61626364656667"
*/
function NormalStrToHexStr(username)
{
	 var len = username.length;
	 var oid_suffix = "";
	 var temp = 0;
	 for(var i=0;i<len;i++)
	 {
		  temp = parseInt(username.charCodeAt(i));
		  if(temp<16)
			   oid_suffix = oid_suffix + "0" + temp.toString(16);
		  else
			   oid_suffix = oid_suffix + temp.toString(16);
	 }
	 return oid_suffix;
 }

/* add delete all button*/
function BtnDelAllInit(title)
{
	$("#divDelAllInit").each(function(){
		var sHtml='<div style="margin-top:15px;margin-left:5px;">\
			<div  class="textTh">'+ title +'</div>\
			<div style="margin-top:-25px;" align="right">\
				<input id="btnDelAll" type="button" value="Delete All"  onclick="OnDelAll()">\
			</div>\
		</div>';
		$(this).html(sHtml);
	});
	return;
}
/* for navtre */
function DisBtnInTbl(list)
{
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	for(var i=0; i<lists.length; i++)
	{
		$("td input[id='"+lists[i]+"']:enabled").removeClass("button2Dbl");
		$("td input[id='"+lists[i]+"']:enabled").addClass("button2");
		$("td input[id='"+lists[i]+"']:disabled").removeClass("button2");
		$("td input[id='"+lists[i]+"']:disabled").addClass("button2Dbl");
	}
}

/* To change the button displayed status based on disabled state.
 * This function will check the disabled status of
 * each button in the list. Depends on different
 * status, applied different css style. */
function changeBtnStyle(list)
{
    var lists;
    if(typeof(list) === "string")
        lists = [list];
    else
        lists = list;

    for(var i=0; i<lists.length; i++)
    {
        $("input[id='"+lists[i]+"']:enabled").removeClass("button1Dbl");
        $("input[id='"+lists[i]+"']:enabled").addClass("button1");
        $("input[id='"+lists[i]+"']:disabled").removeClass("button1");
        $("input[id='"+lists[i]+"']:disabled").addClass("button1Dbl");
    }
}

function DisBtnNotTbl(list)
{
	var lists;
	if(typeof(list) === "string")
		lists = [list];
	else
		lists = list;

	for(var i=0; i<lists.length; i++)
	{
		$("input[type='"+lists[i]+"']:enabled").removeClass("button1Dbl");
		$("input[id='"+lists[i]+"']:enabled").addClass("button1");
		$("input[id='"+lists[i]+"']:disabled").removeClass("button1");
		$("input[id='"+lists[i]+"']:disabled").addClass("button1Dbl");
	}
}
 /* Hex string to Normal string
 *eg:"61:62:63:64:65:66:67" -> "abcdefg"
*/
function HexStrToNoramlStr(HexStr)
{
	var HexArry=new Array;
	var NormalStr="";
	HexArry = HexStr.split(":");
	for(var i=0;i<HexArry.length;i++)
	{
		NormalStr=NormalStr+String.fromCharCode(parseInt(HexArry[i],16))
	}
	return NormalStr;
}

function InsertChkPort(portNum, tblName, rowIndex)
{
	var x = document.getElementById(tblName).insertRow(-1);
	var cell = [];
	var i,j=0;
	//var length = (portNum > PORT_NUM_INROW)?portNum/2:portNum;
	var length = (portNum > PORT_NUM_INROW)?((portNum > PORT_MAXNUM)?portNum/3:portNum/2):portNum;

	x.align="center";
	cell[j]=x.insertCell(j);
	cell[j].innerHTML="";
	cell[j].className="textThBk";
	cell[j].width="50px";
	j++;
	for(i=0;i<length;i++)
	{
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='&nbsp;'+(i+1);
		cell[j].className="textThBk";
		j++;
	}

	x=document.getElementById(tblName).insertRow(-1);
	cell = [];
	j=0;

	x.align="center";
	cell[j]=x.insertCell(j);
	cell[j].innerHTML='<input style="width:50px;" type="button" id="btnAll'+(rowIndex+1)+'" value="All" onclick="OnSelAll('+tblName+','+(rowIndex+1)+');">';
	cell[j].align="left";
	cell[j].className="textThBk";
	j++;

	for(var i=0;i<length;i++)
	{
		var portId = i+1;
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='<input type="checkbox" id="chkID'+portId+'" name="chkID'+portId+'" onChange="ChangeSrcPort('+portId+',this.value)" value="'+rowIndex+'">';//"chkID"
		cell[j].className="textThBk";
		j++;
	}

	if(portNum > PORT_NUM_INROW)
	{	//Row3
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		cell[j]=x.insertCell(j);
		cell[j].innerHTML="";
		cell[j].className="textThBk";
		cell[j].width="50px";
		j++;
		var rowMax = (portNum > PORT_MAXNUM)?length*2:portNum;
		for(i=length;i<rowMax;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='&nbsp;'+(i+1);
			cell[j].className="textThBk";
			j++;
		}

		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='';
		cell[j].align="left";
		cell[j].className="textThBk";
		j++;

		for(var i=length;i<rowMax;i++)
		{
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="checkbox" id="chkID'+portId+'" name="chkID'+portId+'" onChange="ChangeSrcPort('+portId+',this.value)" value="'+rowIndex+'">';//"chkID"
			cell[j].className="textThBk";
			j++;
		}
	}

	if(portNum > PORT_MAXNUM)
	{	//Row5
		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		cell[j]=x.insertCell(j);
		cell[j].innerHTML="";
		cell[j].className="textThBk";
		cell[j].width="50px";
		j++;
		for(i=length*2;i<portNum;i++)
		{
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='&nbsp;'+(i+1);
			cell[j].className="textThBk";
			j++;
		}

		x=document.getElementById(tblName).insertRow(-1);
		cell = [];
		j=0;

		x.align="center";
		cell[j]=x.insertCell(j);
		cell[j].innerHTML='';
		cell[j].align="left";
		cell[j].className="textThBk";
		j++;
		for(var i=length*2;i<portNum;i++)
		{
			var portId = i+1;
			cell[j]=x.insertCell(j);
			cell[j].innerHTML='<input type="checkbox" id="chkID'+portId+'" name="chkID'+portId+'" onChange="ChangeSrcPort('+portId+',this.value)" value="'+rowIndex+'">';//"chkID"
			cell[j].className="textThBk";
			j++;
		}
	}
}

String.prototype.trim = function() {return this.replace(/^\s+|\s+$/g, '');}

/* Check IPv4 reserved multicast address */
function IPv4_Reserved_Multicast_Check(address) {
    var reservedMcastRegex = /^224\.0\.0\.\d{1,3}$/;
    return reservedMcastRegex.test(address);
}

/* Check IPv4 reserved multicast address */
function IPv6_Reserved_Multicast_Check(address) {
    var reservedMcastRegex = /^ff02/;
    return reservedMcastRegex.test(address);
}

function InsertSelectCtrlWithLa(name, id)
{
	return '<select id="'+name+'_'+id+'" onChange="ChangeWithLa(\''+name+'\','+id+')"></select>';
}

function startSessionCheck() {
    window.top.startSessionCheck();
}

function stopSessionCheck() {
    window.top.stopSessionCheck();
}function jsonToString(obj) {
    var THIS = obj;
    switch (typeof (obj)) {
    case 'string':
        return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
    case 'array':
        return '[' + obj.map(jsonToString(THIS)).join(',') + ']';
    case 'object':
        if (obj instanceof Array) {
            var strArr = [];
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                strArr.push(jsonToString(obj[i]));
            }
            return '[' + strArr.join(',') + ']';
        } else if (obj == null) {
            return 'null';

        } else {
            var string = [];
            for ( var property in obj)
                string.push(jsonToString(property) + ':' + jsonToString(obj[property]));
            return '{' + string.join(',') + '}';
        }
    case 'boolean':
    case 'number':
        return obj;
    case false:
        return obj;
    }
}

String.prototype.ToJson = function() {
    return eval('(' + this + ')');
}

String.prototype.ToString = function() {
    return "\"" + this + "\"";
}

Array.prototype.ToString = function() {
    return jsonToString(this);
}

function clone(obj) {
    if (null == obj || "object" != typeof obj)
        return obj;
    var copy = obj.constructor();
    for ( var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}

var ERR_SESSION_TIMEOUT = 'Session timeout, please login again.';
var ERR_NO_RESPONSE = 'Device no response, please refresh again.';

/*
 * ------------- Json RPC -------------
 */
function Rpc(fun, params, basync, timeoutV, callback) {

    if (typeof (params) === 'undefined')
        params = [];

    if (typeof (basync) === 'undefined')
        basync = false;

    if (typeof (timeoutV) === 'undefined')
        timeoutV = 30000;

    var obj = {};

    var post_data = JSON.stringify(params); // escape(jsonToString(obj));
    $.ajax({
        url : fun,
        type : 'POST',
        data : post_data,
        dataType : "json",
        async : basync,
        timeout : timeoutV,
        success : function(response) {
            obj = response;
        },
        error : function (jqXHR, textStatus, errorThrown) {
            MyAlert("Ajax request failed. Error : " + textStatus);
            obj = null;
        },
    });
    return obj;
}

function MyAlert(msg, flag) {
    if (flag == false)
        return;
    alert(msg);
}
// parse RPC reponse result, and check error code.
// if failed, alert message, then return false;
// if success, return result.
function RpcResult(response, optFlag) {
    var flag;
    if (typeof (optFlag) === 'undefined')
        flag = true;
    else
        flag = optFlag;

    if (response && response.hasOwnProperty("errMsg")) {
        MyAlert("Error : " + jqXHR.responseText);
        return null;
    }

    /* get operate result */
    return response;
}

function RpcGet(sTmp, params, basync, timeoutV, callback, optFlag) {
    var response = Rpc(sTmp, params, basync, timeoutV, callback);
    return RpcResult(response, optFlag);
}

function RpcSet(sTmp, params, optFlag, basync) {
    return RpcFunc(sTmp, params, optFlag, basync);
}
// delete all data for a table
function RpcDelAll(sTmp, params, optFlag) {
    return RpcFunc(sTmp, params, optFlag);
}

function RpcFunc(sFunc, params, optFlag, basync) {
    var flag;
    if (typeof (optFlag) === 'undefined')
        flag = true;
    else
        flag = optFlag;

    var response = Rpc(sFunc, params, basync);
    return RpcResult(response, flag);
}

// internal port is 0 based, GUI is 1 based
function portToifIndex(port) {
    return (port-1);
}

function ifIndexToPort(ifIndex) {
    return (ifIndex+1);
}
// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
//
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//
(function($) {

	$.alerts = {

		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

		verticalOffset: -300,               // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .01,                // transparency level of overlay
		overlayColor: '#FFF',               // base color of overlay
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '&nbsp;OK&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs

		// Public methods

		alert: function(message, title, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},

		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},

		prompt: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},

		// Private methods

		_show: function(title, msg, value, type, callback) {

			$.alerts._hide();
			$.alerts._overlay('show');

			/*navtre merge
			if( $.browser.msie && parseInt($.browser.version) == 6 )
			{
				$("BODY").append(
				  '<div id="popup_container">' +
				   '<iframe id="if_cont" style="width:100%;filter:alpha(opacity=0);-moz-opacity:0; position:absolute; margin-top:-3px;z-index:-1"></iframe> ' +
					'<h1 id="popup_title"></h1>' +
					'<div id="popup_content">' +
					  '<div id="popup_message"></div>' +
					'</div>' +
				  '</div>');
			}
			else
			{	*/
				$("BODY").append(
				  '<div id="popup_container">' +
					'<h1 id="popup_title"></h1>' +
					'<div id="popup_content">' +
					  '<div id="popup_message"></div>' +
					'</div>' +
				  '</div>');
			//}
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);

			// IE6-9 Fix /msie/.test(navigator.userAgent.toLowerCase());
			var pos = (!$.support.leadingWhitespace) ? 'absolute' : 'fixed';
			//var pos = (!$.support.leadingWhitespace && parseInt($.browser.version) <= 9 ) ? 'absolute' : 'fixed';

			// IE6 Fix
			//var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed';
			var pos = 'absolute';
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});

			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );

			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});

			$.alerts._reposition();
			$.alerts._maintainPosition(true);

			switch( type ) {
				case 'alert':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == 13 || e.keyCode == 27 ) $("#popup_ok").trigger('click');
					});
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_ok").focus();
					$("#popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
				break;
				case 'prompt':
					$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_prompt, #popup_ok, #popup_cancel").keypress( function(e) {
						if( e.keyCode == 13 ) $("#popup_ok").trigger('click');
						if( e.keyCode == 27 ) $("#popup_cancel").trigger('click');
					});
					if( value ) $("#popup_prompt").val(value);
					$("#popup_prompt").focus().select();
				break;
			}

			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},

		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},

		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},

		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			// IE6 fix
			if( !$.support.leadingWhitespace) top = top + $(window).scrollTop()+120;
			if( !$.support.leadingWhitespace) left = left + 80;

			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			/*$("#if_cont").css({
				top: top + 'px',
				left: left + 'px'
			});*/
			$("#popup_overlay").height( $(document).height() );
		},

		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}

	}

	// Shortuct functions
	jAlert = function(message, title, callback) {
		$.alerts.alert(message, title, callback);
	}

	jConfirm = function(message, title, callback) {
		$.alerts.confirm(message, title, callback);
	};

	jPrompt = function(message, value, title, callback) {
		$.alerts.prompt(message, value, title, callback);
	};

})(jQuery);

COMMON_Err ={}
COMMON_Err.speChar = "Please input a valid value."
COMMON_Err.number = "Please input a valid value."
