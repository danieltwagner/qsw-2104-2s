var inProgress = false;
var isAutoReboot= true;
function CB_EnUpdFirmAgain()
{
    transmitingStatus.innerHTML ="";
    DisableCtrls("LogoutBtn", false);
    changeBtnStyle("LogoutBtn");
    DisableCtrls("ApplyBtn", false);
    changeBtnStyle("ApplyBtn");
    inProgress = false;
    startSessionCheck();
}
var fileUpload = function(apiHandler, file, filename) {
    inProgress = true;
    var fd = new FormData();
    var percent = 0;

    if (file) {
        fd.append(filename, file);

        var xhr = new XMLHttpRequest();
        xhr.open('post', apiHandler, true);

        transmitingStatus.innerHTML = 'Firmware is transmitting, Please wait... ';

        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            percent = Math.round((e.loaded / e.total) * 100);
            transmitingStatus.innerHTML = 'Firmware is transmitting, Please wait... ' + percent +' % completed.';//1
          }
        };

        xhr.onload = function() {
          if (this.status == 200) {
            var r = JSON.parse(this.response);
            if (r){
                if(r.status=="0"){
                    transmitingStatus.innerHTML = 'New Firmware is being applied as next boot image, Please wait... '; //2
                    changeBoot();
                }
                else
                {
                    var errmsg = "Firmware update failed ( "+r.status+" ) .";
                    jAlert(errmsg, "ERROR");
                    CB_EnUpdFirmAgain();
                }
            }
          } else {
            var r = JSON.parse(this.response);
            if(r)
            {
                var errmsg = "Firmware update failed ( "+r.status+" ) .";
                jAlert(errmsg, "ERROR");
            }
            else
            {
                jAlert("Firmware update failed.", "ERROR");
            }
            CB_EnUpdFirmAgain();
          };
        }

        xhr.send(fd);
    }
    inProgress = false;
}

function refershPage() {
    imageInfo=RpcGet('/api/fw/data/get');
}

function CB_OnPageInit()
{
    refershPage();
}
var ImageSizeLimit = 4000000;  //4 MB
function checkSize(loadFile) {
    var fileSize = 0;
    if (loadFile.files !== undefined) {
        fileSize = loadFile.files[0].size;
        if(fileSize > ImageSizeLimit) {
        	jAlert("The size of the firmware image is too big to fit into the flash.", "ERROR");
        	return false;
        }
    }
    return true;
}
function OnApply()
{
	if (CheckValue() == false)
		return;

	stopSessionCheck();
	DisableCtrls("ApplyBtn", true);
	changeBtnStyle("ApplyBtn");
    DisableCtrls("LogoutBtn", true);
    changeBtnStyle("LogoutBtn");

	var file = document.formFwUpgradeHttp.firmware.files[0];
	fileUpload("/api/fw/upload", file, null);
}
function OnAbort()
{
    self.location.href = "fw_http.htm";
}
function OnContinue()
{
    if(!isAutoReboot)
    {
        self.location.href = "switch.htm";
    }
    else
    {
        window.top.location = "/login.htm";
    }
}

function CheckValue()
{
	if (document.formFwUpgradeHttp.firmware.value == "")
	{
	    jAlert("File is not specified!", "ERROR");
		return false;
	}

  if(!checkSize(document.formFwUpgradeHttp.firmware))
  	return false;

	return true;
}
function OnRebootApply()
{
    if(isAutoReboot)
    {
        stopSessionCheck();
        RpcSet('/api/system/reboot',[],true,0);
        setTimeout(function(){
            DisableCtrls("ContinueBtn", false);
            changeBtnStyle("ContinueBtn");
            DisableCtrls("LogoutBtn1", false);
            changeBtnStyle("LogoutBtn1");
        }, 15000);
    }
}
function changeBoot() {
    $.ajax({
        url : '/api/fw/image/toggle',
        contentType : 'application/json; charset=utf-8',
        success : function(data) {
            if (data.status !== 0){
                var errmsg = "Change Boot Image Failed ( "+data.status+" ) .";
                jAlert(errmsg, "ERROR");
                CB_EnUpdFirmAgain();
            }
            else {
                startSessionCheck();
                $("#main_upgrade").hide();
                $("#main_complete").show();
                if(!isAutoReboot)
                {
                    ContinueStatus.innerHTML = 'Please reboot system to activate new boot image or click \'Continue\' to main page.';
                }
                else
                {
                    DisableCtrls("ContinueBtn", true);
                    changeBtnStyle("ContinueBtn");
                    DisableCtrls("LogoutBtn1", true);
                    changeBtnStyle("LogoutBtn1");
                    setTimeout(OnRebootApply, 3000);//Step3
                    ContinueStatus.innerHTML = 'Please wait while system booting up and then click \'Continue\' to login page.';
                }
            }
        },
        fail : function(xhr, status, error) {
            jAlert(xhr.responseText, "ERROR");
        }
    });
}
