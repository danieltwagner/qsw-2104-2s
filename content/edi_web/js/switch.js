var page_init = true;
function confirm_fw_http()
{
	if (!confirm('Do you want to reboot device to Firmware upgrade?')) {
		return false
	}
	self.location.href ="fw_http.htm";
}
function CB_OnPageInit()
{
	DataLoading();
	testInit();
	page_init = false;
	setTimeout(CB_OnPageInit, 1000);

}

function DataLoading()
{
    //get system up time from switch
	sysSystemInfo = RpcGet('/api/system/params/get').params;//TBD?
	if(page_init)
        firmwareInfo  = RpcGet('/api/fw/data/get');
}

function testInit() {
	if(page_init)
	{
	    var datestr= "&nbsp;"+firmwareInfo.build_date.substr(4); //cut day ex:remove "Thu"
        Fillvalue("sysInfoFirmwareBuildDate", datestr);
        var hrefstr="&nbsp;"+"<a href=\"javascript: void(0)\" onclick=\"confirm_fw_http()\" >"+firmwareInfo.active_descr+"</a>";
        Fillvalue("sysInfoFirmwareVersion",hrefstr);
    }
    var LoopSwitchStr="Off";
		var EEESwitchStr="Off";

		if (sysSystemInfo.loop)
			LoopSwitchStr="On";
		if (sysSystemInfo.eee)
			EEESwitchStr="On";

		Fillvalue("sysInfoLoopSwitch", LoopSwitchStr);
		Fillvalue("sysInfoEEESwitch", EEESwitchStr);
}
