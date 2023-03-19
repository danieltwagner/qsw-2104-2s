
function Include (files)
{
	var files = typeof files == "string" ? [files] : files;
	for (var i = 0; i < files.length; i++)
	{
		var file = files[i];
		var name = file.replace(/^\s|\s$/g, "");
		var att = name.split('.');
		var ext = att[att.length - 1].toLowerCase();
		var txt='';

        ////// EDIMAX MODIFICATION START //////
        /* If we are running on file protcol (local file system).
           Make the "/xx,js" to "../xx.js". */
        //if (window.location.protocol === "file:")
            file = file.replace(/^\//, "../");
        ////// EDIMAX MODIFICATION END  //////

		if(ext == "css")
			txt = '<link rel="stylesheet" href="'+file+'" type="text/css">'
		else
			txt = ('<script type="text/javascript" src="'+file+'"></script>');

		document.writeln(txt);
	}
}


//get value of param from url
function GetParam(ParamName)
{
	ParamName = ParamName?ParamName:"Param";
	var args = GetUrlParms();
	return args[ParamName];
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

function IncludeDefault(files)
{
// common js lib load.
	Include(['/css/edimax.css']);

	Include(['/js/jq191min.js', '/js/edimax.js']);
	Include(files);
}
