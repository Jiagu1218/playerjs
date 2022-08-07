package com.example.playerjs.widget.widget;

import com.example.playerjs.MainAbility;
import com.example.playerjs.entity.AsmrData;
import com.example.playerjs.util.HTMLUtils;
import com.example.playerjs.widget.controller.FormController;
import ohos.aafwk.ability.AbilitySlice;
import ohos.aafwk.ability.FormBindingData;
import ohos.aafwk.ability.FormException;
import ohos.aafwk.ability.ProviderFormInfo;
import ohos.aafwk.content.Intent;
import ohos.app.Context;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.utils.zson.ZSONObject;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class WidgetImpl extends FormController {
    private static final HiLogLabel TAG = new HiLogLabel(HiLog.DEBUG, 0x0, WidgetImpl.class.getName());

    public WidgetImpl(Context context, String formName, Integer dimension) {
        super(context, formName, dimension);
    }

    @Override
    public ProviderFormInfo bindFormData(long formId) {
        ZSONObject zsonObject = new ZSONObject();
        zsonObject.put("musicInfo",initData());
        ProviderFormInfo providerFormInfo = new ProviderFormInfo();
        providerFormInfo.setJsBindingData(new FormBindingData(zsonObject));
        return providerFormInfo;
    }

    /**初始化数据
     * @return 卡片musicInfo数据
     */
    private ZSONObject initData(){
        List<AsmrData> list = HTMLUtils.analyzeHeASMRPageInfo(1,"random","");
        for(AsmrData data : list){
            List<AsmrData> jpList = HTMLUtils.analyzeJpASMRPageInfo(1,"",data.getTitle());
            for(AsmrData jpData : jpList){
                String url = HTMLUtils.analyzeJpASMRMusicUrl(jpData.getPageUrl());
                if (!StringUtils.isEmpty(url)){
                    data.setMusicUrl(url);
                    return ZSONObject.classToZSON(data);
                }
            }
        }
        return new ZSONObject();
    }

    @Override
    public void updateFormData(long formId, Object... vars) {
        ZSONObject zsonObject = new ZSONObject();
        zsonObject.put("musicInfo",initData());
        FormBindingData formBindingData = new FormBindingData(zsonObject);
        try {
            ((MainAbility)context).updateForm(formId,formBindingData);
        } catch (FormException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onTriggerFormEvent(long formId, String message) {
        HiLog.info(TAG, message);
    }

    @Override
    public Class<? extends AbilitySlice> getRoutePageSlice(Intent intent) {
        return null;
    }
}
