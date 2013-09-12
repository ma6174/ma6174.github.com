var user_name = "ma6174";
var client_id = "f9ef585d125b0b094565";
var client_secret = "ba769ead1c8282b1aaee0c421283e77b4392d3b3";
function parsePostData(postUrl){
    var post = {};
    $.ajax({url:postUrl,data:{"client_id":client_id,"client_secret":client_secret},async:false}).done(function(data){
        var filename = data.name;
        var content_data = utf8to16(base64decode(data.content));
        var title = content_data.split("\n")[0].slice(2);
        if(title === "") {
            return false;
        }
        var markdown = new Showdown.converter();
        var html = markdown.makeHtml(content_data);
        post.title = title;
        post.html = html;
        post.content = content_data;
    });
    return post;
}

$(function() {
    var contents_url = "https://api.github.com/repos/"+user_name+"/"+user_name+".github.com/contents/post";
    var comments_url = "https://api.github.com/repos/"+user_name+"/"+user_name+".github.com/issues/1/comments";
    var window_url=window.location.href;
    var title = window_url.split("#show/")[1];
    if(title != undefined){
        $("#article_list").fadeToggle();
        $("#"+title).show();
    }
    $.getJSON(contents_url,{"client_id":client_id,"client_secret":client_secret},
         function(data){
             var ul = $("<ul></ul>");
             ul.attr("id","article_list");
             ul.appendTo($("#body"));
             var i = data.length - 1;
             for(;i>0;i--){
//               console.log(parsePostData(data[i].url));
                 $.ajax({
                     url:data[i].url,
                     data:{"client_id":client_id,"client_secret":client_secret},
                     async:false
                 }).done(function(data){
                     var filename = data.name;
                     var content_data = utf8to16(base64decode(data.content));
                     var title = content_data.split("\n")[0].slice(2);
                     if(title === "") {
                         return false;
                     }
                     var li = $("<li></li>");
                     li.addClass("content_url");
                     var a = $("<a></a>");
                     var id = filename.split(".")[0];
                     a.attr("href","#show/"+id);
                     a.attr("id",filename);
                     a.text(title);
                     a.appendTo(li);
                     li.appendTo(ul);
                     var div = $("<div></div>");
                     var markdown = new Showdown.converter();
                     var html = markdown.makeHtml(content_data);
                     div.attr("id",id);
                     div.addClass("div_article");
                     div.html(html);
                     div.appendTo($("#body"));
                     $("#"+filename.split(".")[0]+' pre code').each(function(i, e) {hljs.highlightBlock(e)});
                     var window_url=window.location.href;
                     var urltitle = window_url.split("#show/")[1];
                     if(urltitle == id){
                         $("#article_list").hide();
                     }else{
                         div.hide();
                     }
                     //comment
                 });
             }
             //            $("h1").append($("<hr />"));
         });
         $("li a").live('click',function(){
             $("#article_list").hide();
             $("#"+this.id.split(".")[0]).show();
         });
         window.onhashchange = function(){
             var window_url=window.location.href;
             var title = window_url.split("#show/")[1];
             if(title === undefined){
                 $("#article_list").show();
                 $(".div_article").hide();
             }
         };
});
