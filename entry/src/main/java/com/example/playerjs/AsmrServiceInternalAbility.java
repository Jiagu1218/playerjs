package com.example.playerjs;

import com.example.playerjs.util.HTMLUtils;
import ohos.ace.ability.AceInternalAbility;
import ohos.app.AbilityContext;
import ohos.rpc.MessageOption;
import ohos.rpc.MessageParcel;
import ohos.rpc.RemoteException;


public class AsmrServiceInternalAbility extends AceInternalAbility {

    private static final String BUNDLE_NAME = "com.example.playerjs";
    private static final String ABILITY_NAME = "com.example.playerjs.AsmrServiceInternalAbility";
    private static AsmrServiceInternalAbility instance;
    private AbilityContext abilityContext;

    public AsmrServiceInternalAbility(String bundleName, String abilityName) {
        super(bundleName, abilityName);
    }
    boolean onRemoteRequest(int code, MessageParcel data, MessageParcel reply, MessageOption option) throws RemoteException{
        switch (code) {
            case 1:
                HTMLUtils.getHeASMRPageInfo(data, reply);
                break;
            case 2:
                HTMLUtils.getHeASMRMusicUrl(data,reply);
                break;
            default:

        }
        return true;
    }


    /**
     * Internal ability 注册接口。
     */
    public static void register(AbilityContext abilityContext) {
        instance = new AsmrServiceInternalAbility(BUNDLE_NAME,ABILITY_NAME);
        instance.onRegister(abilityContext);
    }

    private void onRegister(AbilityContext abilityContext) {
        this.abilityContext = abilityContext;
        this.setInternalAbilityHandler((code, data, reply, option) -> {
            return this.onRemoteRequest(code, data, reply, option);
        });
    }

    /**
     * Internal ability 注销接口。
     */
    public static void unregister() {
        instance.onUnregister();
    }

    private void onUnregister() {
        abilityContext = null;
        this.setInternalAbilityHandler(null);
    }

}