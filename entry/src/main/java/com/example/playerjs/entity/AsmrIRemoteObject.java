package com.example.playerjs.entity;

import com.alibaba.fastjson.JSONObject;
import com.example.playerjs.util.HTMLUtils;
import ohos.rpc.*;
import ohos.utils.zson.ZSONObject;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

public class AsmrIRemoteObject extends RemoteObject implements IRemoteBroker {
    private static final String BASE_URL = "https://www.hentaiasmr.moe/";
    public AsmrIRemoteObject(String descriptor) {
        super(descriptor);
    }

    /**
     * @param code 业务代码
     * @param data 请求数据
     * @param reply 返回数据
     * @param option
     * @return
     */
    @Override
    public boolean onRemoteRequest(int code, MessageParcel data, MessageParcel reply, MessageOption option) throws RemoteException {
        switch (code) {
            case 1:
                getPageInfo(data,reply);
                break;
            case 2:
                getMusicUrl(data,reply);
                break;
        }
//        return super.onRemoteRequest(code, data, reply, option);
        return true;
    }

    private static void getMusicUrl(MessageParcel data, MessageParcel reply){
        String pageUrl = data.readString();
        String musicUrl = HTMLUtils.getElements(pageUrl, 10, "meta[property='og:audio']").attr("content");
        reply.writeString(musicUrl);
    }

    private static void getPageInfo(MessageParcel data, MessageParcel reply){
        //以jsonObjectString 传入
        String params = data.readString();
        JSONObject paramsObject=JSONObject.parseObject(params);
        int pageIndex = paramsObject.getInteger("pageIndex");
        String filter = paramsObject.getString("filter");
        String search = paramsObject.getString("search");
        String url = initUrl(pageIndex,filter,search);

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

    private static String initUrl(int pageIndex,String filter,String search) {
        boolean paramFlag = false;
        StringBuilder url = new StringBuilder(BASE_URL);
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

    @Override
    public IRemoteObject asObject() {
        return this;
    }
}
