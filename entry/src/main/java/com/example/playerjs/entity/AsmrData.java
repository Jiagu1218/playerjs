package com.example.playerjs.entity;

public class AsmrData {
    private int id;
    private int articleId;
    private String title;
    private String musicUrl;
    private String pageUrl;
    private String imgUrl;
    private String views;
    private String duration;
    private String heart;

    public AsmrData() {
    }

    public AsmrData(int id, int articleId, String title, String musicUrl, String pageUrl, String imgUrl, String views, String duration, String heart) {
        this.id = id;
        this.articleId = articleId;
        this.title = title;
        this.musicUrl = musicUrl;
        this.pageUrl = pageUrl;
        this.imgUrl = imgUrl;
        this.views = views;
        this.duration = duration;
        this.heart = heart;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getArticleId() {
        return articleId;
    }

    public void setArticleId(int articleId) {
        this.articleId = articleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMusicUrl() {
        return musicUrl;
    }

    public void setMusicUrl(String musicUrl) {
        this.musicUrl = musicUrl;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getViews() {
        return views;
    }

    public void setViews(String views) {
        this.views = views;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getHeart() {
        return heart;
    }

    public void setHeart(String heart) {
        this.heart = heart;
    }

    @Override
    public String toString() {
        return "AsmrData{" +
                "id=" + id +
                ", articleId=" + articleId +
                ", title='" + title + '\'' +
                ", musicUrl='" + musicUrl + '\'' +
                ", pageUrl='" + pageUrl + '\'' +
                ", imgUrl='" + imgUrl + '\'' +
                ", views='" + views + '\'' +
                ", duration='" + duration + '\'' +
                ", heart='" + heart + '\'' +
                '}';
    }
}
