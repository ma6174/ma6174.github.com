$(function() {
    var contents_url = "https://api.github.com/repos/ma6174/ma6174.github.com/contents/post";
    var contents = $.getJSON(contents_url,function(data){
        var ul = $("<ul></ul>");
        ul.attr("id","article_list");
        var i = data.length - 1;
        for(;i>0;i--){
            $.get(data[i].url).done(function(data){
                var filename = data.name;
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
                markdown = new Showdown.converter();
                var html = markdown.makeHtml(content_data);
                div.attr("id",filename.split(".")[0]);
                div.addClass("div_article");
                div.html(html);
                div.appendTo($("#body"));
                div.hide();
            });
        }
        ul.appendTo($("#body"));
    });
    
    $("a").live('click',function(){
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

