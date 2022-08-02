package com.example.playerjs.util;

import com.alibaba.fastjson.JSONObject;
import com.example.playerjs.entity.AsmrData;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import ohos.rpc.MessageParcel;
import ohos.utils.zson.ZSONObject;
import org.jsoup.Jsoup;
import org.jsoup.internal.StringUtil;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * html工具
 */
public class HTMLUtils {
    private static final String HE_ASMR_BASE_URL = "https://www.hentaiasmr.moe/";
    private static final String JP_ASMR_BASE_URL = "https://japaneseasmr.com/";

    /**获取链接页面dom
     * @param url
     * @param timeout 超时时间，单位秒
     * @return
     */
    public static Document getDocument(String url,int timeout){
        try {
            return Jsoup.parse(new URL(url),timeout*1000);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**通过url和css选择器获取页面元素
     * @param url
     * @param timeout 超时时间，单位秒
     * @param cssQuery css选择表达式
     */
    public static Elements getElements(String url,int timeout,String cssQuery){
        Document document = getDocument(url,timeout);
        if (document == null){
            document = getDocument(url,timeout);;
            if (document == null){
                return null;
            }
        }
        return document.select(cssQuery);
    }

    /**通过css选择器获取页面元素
     * @param document 页面dom
     * @param cssQuery
     * @return
     */
    public static Elements getElements(Document document,String cssQuery){
        if(document != null){
            return document.select(cssQuery);
        }else {
            return null;
        }
    }


    public static Document executeJsBefore(String url,int timeout){
        WebClient webClient = new WebClient();
        webClient.getOptions().setCssEnabled(false);
        webClient.getOptions().setJavaScriptEnabled(true);
        webClient.getOptions().setThrowExceptionOnScriptError(false);
        try {
            HtmlPage page=webClient.getPage(url);
            webClient.waitForBackgroundJavaScript(timeout);
            return Jsoup.parse(page.asXml());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /*****************hentaiasmr start********************/

    public static void getHeASMRMusicUrl(MessageParcel data, MessageParcel reply){
        String params = data.readString();
        JSONObject paramsObject=JSONObject.parseObject(params);
        String musicUrl = HTMLUtils.getElements(paramsObject.getString("pageUrl"), 10, "meta[property='og:audio']").attr("content");
        reply.writeString(musicUrl);
    }

    public static void getHeASMRPageInfo(MessageParcel data, MessageParcel reply){
        //以jsonObjectString 传入
        String params = data.readString();
        JSONObject paramsObject=JSONObject.parseObject(params);
        int pageIndex = paramsObject.getInteger("pageIndex");
        String filter = paramsObject.getString("filter");
        String search = paramsObject.getString("search");
        String url = initHeASMRUrl(pageIndex,filter,search);

        List<AsmrData> list = new ArrayList<>();
        Document document = HTMLUtils.getDocument(url,10);
        Elements elements = HTMLUtils.getElements(document,"article");
        for (Element article:elements){
            int articleId = Integer.parseInt(article.attr("data-post-id"));
            String pageUrl = article.selectFirst("a").attr("href");
            String title = article.selectFirst("a").attr("title");
            String imgUrl = article.selectFirst("img").attr("data-src");
            String duration = article.selectFirst(".duration").text().trim();
            String views = article.selectFirst(".views").text().trim();
            String heart = article.selectFirst(".fa.fa-heart").text().trim();
            AsmrData asmrData = new AsmrData(articleId,articleId,title,"",pageUrl,imgUrl,views,duration,heart);
            list.add(asmrData);
        }
        //将本地业务响应返回给Js端的MessageParcel对象，当前仅支持String格式。
        //以jsonObjectString 传出

        reply.writeString(ZSONObject.toZSONString(list));
    }

    private static String initHeASMRUrl(int pageIndex, String filter, String search) {
        boolean paramFlag = false;
        StringBuilder url = new StringBuilder(HE_ASMR_BASE_URL);
        if (pageIndex<1){
            pageIndex = 1;
        }
        url.append("page/"+pageIndex);
        if (filter !=null &&!"".equals(filter) ){
            url.append("/?filter="+filter);
            paramFlag = true;
        }
        if (search !=null &&!"".equals(search)){
            try {
                search = URLEncoder.encode(search, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if (paramFlag){
                url.append("&s="+search);
            }else{
                url.append("/?s="+search);
            }
        }
        return url.toString();
    }

    /*****************hentaiasmr end********************/


    /*****************japaneseasmr start********************/

    public static void getJpASMRMusicUrl(MessageParcel data, MessageParcel reply){
        String params = data.readString();
        JSONObject paramsObject=JSONObject.parseObject(params);
        String pageUrl = paramsObject.getString("pageUrl");

        Elements elements = HTMLUtils.getElements(pageUrl, 10, ".download_links a");
//        Elements elements = HTMLUtils.getElements("https://japaneseasmr.com/1073/", 10, ".download_links a");
        for(Element element : elements){
            String text = element.text();
            String href = element.attr("href");
            if ("download".equalsIgnoreCase(text)){
                //解析zippyshare.com
                if (!StringUtil.isBlank(href)){
                    String url = HttpUtil.getRedirectUrl(href);
                    if (!StringUtil.isBlank(url)){
                        try {
                            URL temp = new URL(url);
                            String protocol = temp.getProtocol();
                            String host = temp.getHost();
                            ArrayList key = new ArrayList();
                            Collections.addAll(key,temp.getPath().split("/"));
                            if(key.size() > 2){
                                reply.writeString(protocol + "://" + host + "/downloadAudio" + "?key="+key.get(2));
                                return;
                            }
                        } catch (MalformedURLException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

    public static void getJpASMRPageInfo(MessageParcel data, MessageParcel reply){
        //以jsonObjectString 传入
        String params = data.readString();
        JSONObject paramsObject=JSONObject.parseObject(params);
        int pageIndex = paramsObject.getInteger("pageIndex");
        String filter = paramsObject.getString("filter");
        String search = paramsObject.getString("search");
        String url = initJpASMRUrl(pageIndex,filter,search);

        List<AsmrData> list = new ArrayList<>();
        Document document = HTMLUtils.getDocument(url,10);
        Elements elements = HTMLUtils.getElements(document,"ul.site-archive-posts>li .entry-preview-wrapper.clearfix");
        for (Element article:elements){

            String pageUrl = article.selectFirst(".entry-title a").attr("href");
            String title = article.selectFirst(".entry-title a").text();

            int articleId;
            Pattern p = Pattern.compile("(\\/(\\d+)\\/)");
            Matcher matcher = p.matcher(pageUrl);
            if (matcher.find()) {
                articleId = Integer.parseInt(matcher.group(2));
            }else {
                articleId = 0;
            }

            String imgUrl = article.selectFirst(".op-square img").attr("data-src");

            String duration = "";
            String views = "";
            String heart = "";
            AsmrData asmrData = new AsmrData(articleId,articleId,title,"",pageUrl,imgUrl,views,duration,heart);
            list.add(asmrData);
        }
        //将本地业务响应返回给Js端的MessageParcel对象，当前仅支持String格式。
        //以jsonObjectString 传出

        reply.writeString(ZSONObject.toZSONString(list));
    }



    private static String initJpASMRUrl(int pageIndex, String filter, String search) {
        boolean paramFlag = false;
        StringBuilder url = new StringBuilder(JP_ASMR_BASE_URL);
        if (pageIndex<1){
            pageIndex = 1;
        }
        url.append("page/"+pageIndex);
        if (filter !=null &&!"".equals(filter) ){
            url.append("/?orderby="+filter);
            url.append("&order=desc");
            paramFlag = true;
        }
        if (search !=null &&!"".equals(search)){
            try {
                search = URLEncoder.encode(search, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if (paramFlag){
                url.append("&s="+search);
            }else{
                url.append("/?s="+search);
            }
        }
        return url.toString();
    }

    /*****************japaneseasmr end********************/

}
