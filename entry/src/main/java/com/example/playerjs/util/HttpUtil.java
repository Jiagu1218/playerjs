package com.example.playerjs.util;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

public class HttpUtil {

    public static String get(String url)throws Exception{
        URL url1=new URL(url);
        HttpsURLConnection httpsURLConnection=(HttpsURLConnection) url1.openConnection();
        httpsURLConnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36");
        InputStreamReader inputStreamReader=new InputStreamReader(httpsURLConnection.getInputStream());
        int responseInput=inputStreamReader.read();
        StringBuilder sb=new StringBuilder();
        while (responseInput!=-1){
            sb.append((char)responseInput);
            responseInput=inputStreamReader.read();
        }
        return sb.toString();
    }

    /**获取重定向链接
     * @param url
     * @return
     */
    public static String getRedirectUrl(String url) {
        HttpsURLConnection conn = null;
        try {
            conn = (HttpsURLConnection) new URL(url).openConnection();
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
        conn.setInstanceFollowRedirects(false);
        conn.setConnectTimeout(5000);
        return conn.getHeaderField("Location");

    }
}
