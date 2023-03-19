var psize=20;
var page_err = "Please select page 1-";
/*
 * Paging class

 var pag1 =new Paging(	{	Container   : 'PagingBox2',
							Update		: YourUpdateCallBackFun});
 */
var Paging = function(options){
	/*return a object.*/

	var _cfg ={
		Container   : 'PagingBox',	// Container div id
		CurrPage	: 1,			// current page index
		TotalPage	: 1,			// total page number
		PerPage		: psize 		// entry number per-page
		//Update   	: null,	// Container div id
	};

	/* The global data stores the indexes to be shown on table.
	 * Used by "InsertRow" module. */
	PagingFrom = 0;
	PagingTo = 0;

	// Update options to _cfg setting
	for ( var name in options)
			_cfg[name] = options[name];

	var Update = function(from, to)
	{
		if(typeof(_cfg.Update) === "undefined")
		{
			//Dbg("no Update function");
			return;
		}

	    PagingFrom = from - 1;
	    PagingTo = to - 1;

		var entry = _cfg.Update(from, to);

		var count = GetEntryCount(entry) - GetEntryUnActiveCount (entry);
		_cfg.TotalPage = Math.ceil(count/_cfg.PerPage);
		if(_cfg.TotalPage == 0)
			_cfg.CurrPage = 0;
	}
	//TODO update total page.

	var InitCtrls = function()
	{
		//Init paging ctrls.
		var s = '';
		s += '<span id="pgInfo">Page '+_cfg.CurrPage+'/'+_cfg.TotalPage+'</span>&nbsp;';
		s += '<input type="button" class="pagingBtn" id="pgFirst_'+_cfg.Container+'" value="First Page" style="width:95px;">&nbsp;';
		s += '<input type="button" class="pagingBtn" id="pgPrev_'+_cfg.Container+'" value="Previous Page" style="width:126px;">&nbsp;';
		s += '<input type="button" class="pagingBtn" id="pgNext_'+_cfg.Container+'" value="Next Page" style="width:98px;">&nbsp;';
		s += '<input type="button" class="pagingBtn" id="pgLast_'+_cfg.Container+'" value="Last Page" style="width:93px;">&nbsp;';
		s += '<span>Page </span>';
		s += '<input id="pgPageId_'+_cfg.Container+'" style="width:22px;" class="speNum" size="3" maxlength="3">&nbsp;';
		s += '<input type="button" id="pgGo_'+_cfg.Container+'" style="width:33px;" value="GO">&nbsp;';
		$('#'+_cfg.Container).html(s);

		/*
		//Bind Event.*/
		$('#'+_cfg.Container + ' #pgFirst_'+_cfg.Container).click(OnFirst);
		$('#'+_cfg.Container + ' #pgPrev_'+_cfg.Container).click(OnPrev);
		$('#'+_cfg.Container + ' #pgNext_'+_cfg.Container).click(OnNext);
		$('#'+_cfg.Container + ' #pgLast_'+_cfg.Container).click(OnLast);
		$('#'+_cfg.Container + ' #pgGo_'+_cfg.Container).click(function(){
			var pid = $('#'+_cfg.Container + ' #pgPageId_'+_cfg.Container).val();

			if(pid==""||(checkForNum(pid)==false ))
			{
				alert(COMMON_Err.number);
				return;
			}

			pid = parseInt(pid);
			if((pid < 1)||(pid > _cfg.TotalPage))
			{
				alert(page_err+_cfg.TotalPage);
				return;
			}
			if(pid==_cfg.CurrPage)
			{
				GetElement("pgPageId_"+_cfg.Container).value = "";
				return;
			}
			OnGo(pid);
		});

		if(_cfg.CurrPage == 0)
		{
			GetElement("pgFirst_"+_cfg.Container).disabled = true;
			GetElement("pgPrev_"+_cfg.Container).disabled = true;
			GetElement("pgNext_"+_cfg.Container).disabled = true;
			GetElement("pgLast_"+_cfg.Container).disabled = true;
			//GetElement("pgPageId").disabled = true;
			//GetElement("pgPageId").readonly = true;
			var ctl = $("[id=pgPageId_"+_cfg.Container+"]");
			ctl.attr("disabled","disabled");
			ctl.attr("readonly","readonly");
			ctl.addClass("inDisable");
			GetElement("pgGo_"+_cfg.Container).disabled = true;
		}
	};

	var OnGo = function(pid)
	{
		//pid = (pid > 1)? pid : 1;
		//pid = (pid < _cfg.TotalPage)? pid : _cfg.TotalPage;
		if(_cfg.TotalPage == 0)
			pid = 1;

		_cfg.CurrPage = pid;

		var from 	= (_cfg.CurrPage-1) * _cfg.PerPage +1;
		var to		= from + _cfg.PerPage-1;

		Update(from, to);
		InitCtrls();

		if(pid==1)
			GetElement("pgPrev_"+_cfg.Container).disabled = true;
		if(pid == _cfg.TotalPage)
			GetElement("pgNext_"+_cfg.Container).disabled = true;

		ChangeBtnStyle();
	};

	var OnFirst = function()
	{
		OnGo(1);
	}

	var OnPrev = function()
	{
		var pid = _cfg.CurrPage -1;
		OnGo(pid);
	}

	var OnNext = function()
	{
		var pid = _cfg.CurrPage +1;
		OnGo(pid);
	}

	var OnLast = function()
	{
		OnGo(_cfg.TotalPage);
	}

	var GetCurPage = function()
	{
		return (_cfg.CurrPage);
	};

	var SetUpdate = function(fUpdate)
	{
		_cfg.Update = fUpdate;
		OnFirst();
	};

	var GetPerPage = function()
	{
		return (_cfg.PerPage);
	};

	OnFirst();

	return {
		Init 	: InitCtrls,
		OnGo 	: OnGo,
		PerPage : GetPerPage,
		CurPage : GetCurPage,
		Update  : SetUpdate};

};

function GetEntryCount (entry)
{
	if (typeof(entry) === "undefined" || typeof(entry.length) === "undefined")
		return 0;
	else
		return entry.length;
	/*
	if(	typeof(entry) === "undefined" ||
		typeof(entry[0]) === "undefined" ||
		typeof(entry[0]['Count']) === "undefined")
		return 0;

	return parseInt(entry[0]['Count']);
	*/
}

function GetEntryUnActiveCount (entry)
{
	if(	typeof(entry) === "undefined" ||
		typeof(entry[0]) === "undefined" ||
		typeof(entry[0]['UnActiveCount']) === "undefined")
		return 0;
	return parseInt(entry[0]['UnActiveCount']);
}

function addScrollToPage()
{
	$("#overflowIE").width(895);
	SetIEWidth();
}
