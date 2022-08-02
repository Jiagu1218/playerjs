package com.example.playerjs.util;

import junit.framework.TestCase;

public class HttpUtilTest extends TestCase {

    public void testGet() {
        System.out.println(HttpUtil.getRedirectUrl("https://japaneseasmr.com/dlz.php?f=RJ323864"));
    }
}