if ($("#videodetails").length > 0) {
  $("#videodetails:first > br:first").before("<br/><div id='dplayer' style='width:100%;height:500px;'>").remove();
  var vid = $("div[id=VUID]").text()
  var VID = $("div[id=VID]").text()
  $("head").append('<link href="https://cdn.staticfile.org/dplayer/1.9.0/DPlayer.min.css" rel="stylesheet"> ')
  $.getScript("https://e1016.91p01.com/js/m.js");
  $("#useraction").append('<span class="title"><br>视频分享(<font color="red">禁止分享在未成年可能看到的地方</font>)html5 :</span><textarea rows="2" name="video_link" id="fm-video_link" class="fullboxtext" onclick="this.focus();this.select()" readonly="readOnly">http://91.9p9.xyz/ev.php?VID=' + vid + '</textarea>');
  $("h3").after('<br><span class="close91" onclick="close91()"  >关闭</span><a class="a91" href="javascript:" target="_blank"></a>  <br>')
  console.log('https://91.9p9.xyz/ev.php?VID=' + vid);
  var ut = [];
  ut[0] = {url: 'https://cns.killcovid2021.com', name: "VIP线路"} //视频vip加速地址头
  ut[1] = {url: 'https://la2.killcovid2021.com', name: "线路A"}
  ut[2] = {url: 'https://fnew.91p49.com', name: "线路D"}
  ut[3] = {url: 'https://cdn77.91p49.com', name: "线路I"}
  var jpgUrl = "https://i.killcovid2021.com/thumb/" + VID + ".jpg"
  var mp4Url, url, dpurl = [];
  $.ajax({
    url: "https://cns.killcovid2021.com//m3u8/" + VID + "/" + VID + ".m3u8",
    type: "get",
    async: false,
    success: function () {
      //说明请求的url存在，并且可以访问， m3u8
      mp4Url = "//m3u8/" + VID + "/" + VID + ".m3u8"
    },
    error: function () {
      //说明请求的url不存在，不可以访问， mp4
      mp4Url = "//mp43/" + VID + ".mp4";
      ut.splice(0, 2);
    }
  });
  console.log("图片链接： " + jpgUrl)
  for (var i = 0; i < ut.length; i++) {
    url = ut[i].url + mp4Url;
    dpurl.push({
      name: ut[i].name,
      url: url,
      type: 'auto'
    })
    console.log("视频链接： " + ut[i].url + mp4Url)
  }
}
