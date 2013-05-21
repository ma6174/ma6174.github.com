var thehits=document.getElementById("thehit");
if (thehits!=null){
thehits.innerHTML="22936";
}

document.body.oncopy = function ()
{
setTimeout(
function ()
{
var text = clipboardData.getData("text");
if (text)
{
text = text + "\r\n测试链接(著作权以及版权属于才储公司)：http://www.apesk.com/mbti/dati.asp ";
clipboardData.setData("text", text);
}
},
100
)
}
window.onload = function()
{
this.focus();
} 


// JavaScript Document