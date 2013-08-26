$(function() {
    var user_name = "ma6174";
    var client_id = "f9ef585d125b0b094565";
    var client_secret = "ba769ead1c8282b1aaee0c421283e77b4392d3b3";
    var contents_url = "https://api.github.com/repos/"+user_name+"/"+user_name+".github.com/contents/post";
    var contents = $.getJSON(contents_url,{"client_id":client_id,"client_secret":client_secret},
        function(data){
            var ul = $("<ul></ul>");
            ul.attr("id","article_list");
            var i = data.length - 1;
            for(;i>0;i--){
                $.get(data[i].url,{"client_id":client_id,"client_secret":client_secret}).done(function(data){
                    var filename = data.name;
                    if(filename.slice(0,2) != "20"){
                        return false;
                    }
                    var content_data = utf8to16(base64decode(data.content));
                    var title = content_data.split("\n")[0].slice(2);
                    if(title === "") {
                        return false;
                    }
                    var li = $("<li></li>");
                    li.addClass("content_url");
                    var a = $("<a></a>");
                    a.attr("href","#show/"+filename.split(".")[0]);
                    a.attr("id",filename);
                    a.text(title);
                    a.appendTo(li);
                    li.appendTo(ul);
                    var div = $("<div></div>");
                    var markdown = new Showdown.converter();
                    var html = markdown.makeHtml(content_data);
                    div.attr("id",filename.split(".")[0]);
                    div.addClass("div_article");
                    div.html(html);
                    div.appendTo($("#body"));
                    div.hide();
                });
            }
//            $("h1").append($("<hr />"));
            ul.appendTo($("#body"));
        });
        $("li a").live('click',function(){
            $("#article_list").fadeToggle();
            $("#"+this.id.split(".")[0]).show();
        });
        window.onhashchange = function(){
            var window_url=window.location.href;
            var title = window_url.split("#show/")[1];
            if(title === undefined){
                $("#article_list").fadeToggle();
                $(".div_article").hide();
            }
        };
});
